using System.Text.Json;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class PostulacionService : IPostulacionService
{
    private static readonly HashSet<string> AllowedExtensions = new() { ".pdf", ".doc", ".docx" };
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

    private readonly IPostulacionRepository _repository;
    private readonly IVacanteRepository _vacanteRepository;
    private readonly IScoringService _scoringService;
    private readonly IEmailService _emailService;
    private readonly IWebHostEnvironment _env;
    private readonly AppDbContext _context;

    public PostulacionService(
        IPostulacionRepository repository,
        IVacanteRepository vacanteRepository,
        IScoringService scoringService,
        IEmailService emailService,
        IWebHostEnvironment env,
        AppDbContext context)
    {
        _repository = repository;
        _vacanteRepository = vacanteRepository;
        _scoringService = scoringService;
        _emailService = emailService;
        _env = env;
        _context = context;
    }

    public async Task<List<PostulacionResponseDTO>> GetAllAsync()
    {
        var postulaciones = await _repository.GetAllAsync();
        return postulaciones.Select(MapToResponseDTO).ToList();
    }

    public async Task<PostulacionResponseDTO?> GetByIdAsync(Guid id)
    {
        var postulacion = await _repository.GetByIdAsync(id);
        if (postulacion == null) return null;
        return MapToResponseDTO(postulacion);
    }

    public async Task<List<PostulacionResponseDTO>> GetByVacanteIdAsync(Guid vacanteId)
    {
        var postulaciones = await _repository.GetByVacanteIdAsync(vacanteId);
        return postulaciones.Select(MapToResponseDTO).ToList();
    }

    public async Task<PostulacionResponseDTO> CreateAsync(CreatePostulacionDTO dto)
    {
        string cvFileName = string.Empty;
        string cvFilePath = string.Empty;

        if (dto.CvFile != null && dto.CvFile.Length > 0)
        {
            var extension = Path.GetExtension(dto.CvFile.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                throw new InvalidOperationException($"File type '{extension}' is not allowed. Allowed types: {string.Join(", ", AllowedExtensions)}");

            if (dto.CvFile.Length > MaxFileSizeBytes)
                throw new InvalidOperationException($"File size exceeds 5 MB limit. Actual size: {dto.CvFile.Length / (1024 * 1024)} MB");

            cvFileName = $"{Guid.NewGuid()}{extension}";
            var storageDir = Path.Combine(_env.ContentRootPath, "Storage", "CVs");
            Directory.CreateDirectory(storageDir);

            cvFilePath = Path.Combine(storageDir, cvFileName);
            using var stream = new FileStream(cvFilePath, FileMode.Create);
            await dto.CvFile.CopyToAsync(stream);
        }

        var postulacion = new Postulacion
        {
            NombreCandidato = dto.NombreCandidato,
            Email = dto.Email,
            Telefono = dto.Telefono,
            VacanteId = dto.VacanteId,
            CvFileName = cvFileName,
            CvFilePath = cvFilePath,
            ImpactStatement = dto.ImpactStatement,
            SoftSkills = dto.SoftSkillsJson,
            ApplicationSource = dto.ApplicationSource ?? "direct",
            ConsentGdpr = dto.ConsentGdpr,
            ConsentMarketing = dto.ConsentMarketing,
            AttestedTruth = dto.AttestedTruth,
            AttestedSignature = dto.AttestedSignature,
            CompletionTimeSeconds = dto.CompletionTimeSeconds,
        };

        var created = await _repository.CreateAsync(postulacion);

        // Load vacante for scoring
        var vacante = await _vacanteRepository.GetByIdAsync(created.VacanteId);
        if (vacante != null)
        {
            var scoreResult = _scoringService.Score(created, vacante, dto.Carrera, dto.Ubicacion);
            created.Puntaje = scoreResult.Puntaje;
            created.PuntajeDetalle = JsonSerializer.Serialize(scoreResult.Detalle);

            if (vacante.ScreeningActivo && scoreResult.Puntaje < vacante.UmbralPuntaje)
            {
                created.Estado = EstadoPostulacion.Rechazado;
            }

            await _repository.UpdateAsync(created);

            // Persist structured application data in transaction
            await PersistStructuredDataAsync(created.Id, dto);

            // Send emails
            await _emailService.SendConfirmacionAsync(created, vacante);
            if (vacante.ScreeningActivo)
            {
                bool apto = created.Estado != EstadoPostulacion.Rechazado;
                await _emailService.SendResultadoAsync(created, vacante, apto);
            }
        }

        var withVacante = await _repository.GetByIdAsync(created.Id);
        return MapToResponseDTO(withVacante!);
    }

    private async Task PersistStructuredDataAsync(Guid postulacionId, CreatePostulacionDTO dto)
    {
        // Parse and persist skills
        if (!string.IsNullOrEmpty(dto.SkillsJson))
        {
            var skills = JsonSerializer.Deserialize<List<SkillDTO>>(dto.SkillsJson);
            if (skills?.Count > 0)
            {
                var candidateSkills = skills.Select(s => new CandidateSkill
                {
                    PostulacionId = postulacionId,
                    SkillName = s.SkillName,
                    SkillCategory = s.Category,
                    ProficiencyLevel = s.ProficiencyLevel,
                    YearsExperience = s.YearsExperience,
                    IsVerified = false,
                    Source = "self_reported",
                }).ToList();

                await _context.CandidateSkills.AddRangeAsync(candidateSkills);
            }
        }

        // Parse and persist availability
        if (!string.IsNullOrEmpty(dto.AvailabilityJson))
        {
            var availability = JsonSerializer.Deserialize<List<AvailabilityDTO>>(dto.AvailabilityJson);
            if (availability?.Count > 0)
            {
                var candidateAvailability = availability
                    .Where(a => a.IsAvailable)
                    .Select(a => new CandidateAvailability
                    {
                        PostulacionId = postulacionId,
                        DayOfWeek = a.DayOfWeek,
                        TimeSlot = a.TimeSlot,
                        IsAvailable = a.IsAvailable,
                    }).ToList();

                await _context.CandidateAvailabilities.AddRangeAsync(candidateAvailability);
            }
        }

        // Parse and persist screening responses
        if (!string.IsNullOrEmpty(dto.ScreeningResponsesJson))
        {
            var responses = JsonSerializer.Deserialize<List<ScreeningResponseDTO>>(dto.ScreeningResponsesJson);
            if (responses?.Count > 0)
            {
                var candidateResponses = responses.Select(r => new CandidateScreeningResponse
                {
                    PostulacionId = postulacionId,
                    QuestionId = r.QuestionId,
                    ResponseText = r.ResponseText,
                }).ToList();

                await _context.CandidateScreeningResponses.AddRangeAsync(candidateResponses);
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task<PostulacionResponseDTO?> UpdateEstadoAsync(Guid id, EstadoPostulacion estado)
    {
        var postulacion = await _repository.GetByIdAsync(id);
        if (postulacion == null) return null;

        postulacion.Estado = estado;
        postulacion.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(postulacion);
        return updated == null ? null : MapToResponseDTO(updated);
    }

    public async Task<PostulacionResponseDTO?> UpdateNotasAsync(Guid id, string? notas)
    {
        var postulacion = await _repository.GetByIdAsync(id);
        if (postulacion == null) return null;

        postulacion.NotasInternas = notas;
        postulacion.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(postulacion);
        return updated == null ? null : MapToResponseDTO(updated);
    }

    public async Task<(string FilePath, string FileName)?> GetCvAsync(Guid id)
    {
        var postulacion = await _repository.GetByIdAsync(id);
        if (postulacion == null || string.IsNullOrEmpty(postulacion.CvFilePath))
            return null;
        return (postulacion.CvFilePath, postulacion.CvFileName);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var postulacion = await _repository.GetByIdAsync(id);
        if (postulacion == null) return false;

        // Delete CV file from disk if it exists
        if (!string.IsNullOrEmpty(postulacion.CvFilePath) && File.Exists(postulacion.CvFilePath))
            File.Delete(postulacion.CvFilePath);

        return await _repository.DeleteAsync(id);
    }

    private static PostulacionResponseDTO MapToResponseDTO(Postulacion postulacion)
    {
        return new PostulacionResponseDTO
        {
            Id = postulacion.Id,
            NombreCandidato = postulacion.NombreCandidato,
            Email = postulacion.Email,
            Telefono = postulacion.Telefono,
            CvFileName = postulacion.CvFileName,
            VacanteId = postulacion.VacanteId,
            VacanteTitulo = postulacion.Vacante?.Titulo ?? string.Empty,
            Estado = postulacion.Estado,
            NotasInternas = postulacion.NotasInternas,
            Puntaje = postulacion.Puntaje,
            PuntajeDetalle = postulacion.PuntajeDetalle,
            CreatedAt = postulacion.CreatedAt,
            UpdatedAt = postulacion.UpdatedAt,
        };
    }
}

// Helper DTOs for JSON deserialization
public class SkillDTO
{
    public string SkillName { get; set; } = string.Empty;
    public string ProficiencyLevel { get; set; } = string.Empty;
    public decimal? YearsExperience { get; set; }
    public string? Category { get; set; }
}

public class AvailabilityDTO
{
    public string DayOfWeek { get; set; } = string.Empty;
    public string TimeSlot { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
}

public class ScreeningResponseDTO
{
    public Guid QuestionId { get; set; }
    public string? ResponseText { get; set; }
}
