using System.Linq.Expressions;
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

    // Frontend sends JSON with camelCase keys (skillName, proficiencyLevel) while the
    // DTOs use PascalCase. System.Text.Json defaults to case-sensitive matching, so
    // without this option deserialized properties stay at their default values and
    // skills/availabilities/responses are silently dropped.
    private static readonly JsonSerializerOptions JsonOpts =
        new(JsonSerializerDefaults.Web);

    private readonly IPostulacionRepository _repository;
    private readonly IVacanteRepository _vacanteRepository;
    private readonly IScoringService _scoringService;
    private readonly IEmailService _emailService;
    private readonly IWebHostEnvironment _env;
    private readonly AppDbContext _context;
    private readonly ICurrentUser _current;

    public PostulacionService(
        IPostulacionRepository repository,
        IVacanteRepository vacanteRepository,
        IScoringService scoringService,
        IEmailService emailService,
        IWebHostEnvironment env,
        AppDbContext context,
        ICurrentUser current)
    {
        _repository = repository;
        _vacanteRepository = vacanteRepository;
        _scoringService = scoringService;
        _emailService = emailService;
        _env = env;
        _context = context;
        _current = current;
    }

    /// <summary>
    /// Postulaciones inherit company scope from their parent Vacante. Anonymous reads
    /// are blocked at the controller layer; this method assumes an authenticated caller.
    /// </summary>
    private Expression<Func<Postulacion, bool>>? BuildScopePredicate()
    {
        if (_current.UserId == null) return p => false;          // anonymous reads return nothing
        if (_current.IsPlatformTier) return null;                // cross-tenant
        if (_current.CanSeeAllCompanyJobs)
            return p => p.Vacante.EmpresaId == _current.CompanyId;
        if (_current.HasPermission("applications:read"))         // recruiter scope
            return p => p.Vacante.EmpresaId == _current.CompanyId && p.Vacante.CreadoPor == _current.UserId;
        return p => false;
    }

    public async Task<List<PostulacionResponseDTO>> GetAllAsync()
    {
        var postulaciones = await _repository.GetAllAsync(BuildScopePredicate());
        return postulaciones.Select(MapToResponseDTO).ToList();
    }

    public async Task<PostulacionResponseDTO?> GetByIdAsync(Guid id)
    {
        var postulacion = await _repository.GetByIdAsync(id);
        if (postulacion == null) return null;
        if (!_current.CanAccessResource(postulacion.Vacante?.EmpresaId, postulacion.Vacante?.CreadoPor))
            return null;
        return MapToResponseDTO(postulacion);
    }

    public async Task<List<PostulacionResponseDTO>> GetByVacanteIdAsync(Guid vacanteId)
    {
        // Confirm the vacante itself is in scope before exposing its applications
        var vacante = await _vacanteRepository.GetByIdAsync(vacanteId);
        if (vacante == null) return new();
        if (!_current.CanAccessResource(vacante.EmpresaId, vacante.CreadoPor)) return new();

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
            var scoringInput = BuildScoringInput(dto);
            var scoreResult = _scoringService.Score(created, vacante, scoringInput);
            created.Puntaje = scoreResult.Puntaje;
            created.PuntajeDetalle = JsonSerializer.Serialize(scoreResult.Detalle);

            if (vacante.ScreeningActivo && scoreResult.Puntaje < vacante.UmbralPuntaje)
            {
                created.Estado = EstadoPostulacion.Rechazado;
            }

            // Schedule the candidate-facing email for delayed dispatch so a recruiter
            // has time to review/cancel/send-now before it goes out. Auto-rejected
            // candidates get a rechazo email; everyone else gets a confirmation.
            var delayMinutes = int.TryParse(Environment.GetEnvironmentVariable("EMAIL_DELAY_MINUTES"), out var d) ? d : 5;
            created.EmailStatus = "pending";
            created.EmailScheduledFor = DateTime.UtcNow.AddMinutes(delayMinutes);
            created.EmailTypeToSend = vacante.ScreeningActivo && created.Estado == EstadoPostulacion.Rechazado
                ? "rechazo_screening"
                : "confirmacion_recepcion";
            created.EmailRetryCount = 0;

            await _repository.UpdateAsync(created);

            // Persist structured application data in transaction
            await PersistStructuredDataAsync(created.Id, dto);
        }

        var withVacante = await _repository.GetByIdAsync(created.Id);
        return MapToResponseDTO(withVacante!);
    }

    /// <summary>
    /// Build the scoring inputs from the apply form. The 4-step modal sends skills
    /// and soft-skills as JSON; we parse them here so the algorithm gets real signal
    /// instead of falling through to neutral defaults (the cause of the "everyone
    /// scores 58" symptom).
    /// </summary>
    private static ScoringInput BuildScoringInput(CreatePostulacionDTO dto)
    {
        var skills = new List<CandidateSkillInput>();
        if (!string.IsNullOrEmpty(dto.SkillsJson))
        {
            try
            {
                var parsed = JsonSerializer.Deserialize<List<SkillDTO>>(dto.SkillsJson, JsonOpts);
                if (parsed != null)
                    skills.AddRange(parsed
                        .Where(s => !string.IsNullOrWhiteSpace(s.SkillName))
                        .Select(s => new CandidateSkillInput(s.SkillName, s.ProficiencyLevel)));
            }
            catch { /* malformed JSON falls back to empty skills */ }
        }

        // Legacy fallback: a comma-separated Carrera string from the old single-step
        // form still scores correctly via the new path.
        if (skills.Count == 0 && !string.IsNullOrWhiteSpace(dto.Carrera))
        {
            skills.AddRange(dto.Carrera.Split(',')
                .Select(s => s.Trim())
                .Where(s => s.Length > 0)
                .Select(s => new CandidateSkillInput(s, "Intermedio")));
        }

        int softSkillsCount = 0;
        if (!string.IsNullOrEmpty(dto.SoftSkillsJson))
        {
            try
            {
                var soft = JsonSerializer.Deserialize<List<string>>(dto.SoftSkillsJson, JsonOpts);
                softSkillsCount = soft?.Count ?? 0;
            }
            catch { }
        }

        return new ScoringInput(
            Skills: skills,
            Ubicacion: dto.Ubicacion,
            SoftSkillsCount: softSkillsCount,
            ImpactStatementLength: dto.ImpactStatement?.Length ?? 0
        );
    }

    private async Task PersistStructuredDataAsync(Guid postulacionId, CreatePostulacionDTO dto)
    {
        // Parse and persist skills
        if (!string.IsNullOrEmpty(dto.SkillsJson))
        {
            var skills = JsonSerializer.Deserialize<List<SkillDTO>>(dto.SkillsJson, JsonOpts);
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
            var availability = JsonSerializer.Deserialize<List<AvailabilityDTO>>(dto.AvailabilityJson, JsonOpts);
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
            var responses = JsonSerializer.Deserialize<List<ScreeningResponseDTO>>(dto.ScreeningResponsesJson, JsonOpts);
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
        if (!_current.CanAccessResource(postulacion.Vacante?.EmpresaId, postulacion.Vacante?.CreadoPor))
            return null;

        postulacion.Estado = estado;
        postulacion.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(postulacion);
        return updated == null ? null : MapToResponseDTO(updated);
    }

    public async Task<PostulacionResponseDTO?> UpdateNotasAsync(Guid id, string? notas)
    {
        var postulacion = await _repository.GetByIdAsync(id);
        if (postulacion == null) return null;
        if (!_current.CanAccessResource(postulacion.Vacante?.EmpresaId, postulacion.Vacante?.CreadoPor))
            return null;

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
        if (!_current.CanAccessResource(postulacion.Vacante?.EmpresaId, postulacion.Vacante?.CreadoPor))
            return null;
        return (postulacion.CvFilePath, postulacion.CvFileName);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var postulacion = await _repository.GetByIdAsync(id);
        if (postulacion == null) return false;
        if (!_current.CanAccessResource(postulacion.Vacante?.EmpresaId, postulacion.Vacante?.CreadoPor))
            return false;

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
            EmailStatus = postulacion.EmailStatus,
            EmailScheduledFor = postulacion.EmailScheduledFor,
            EmailSentAt = postulacion.EmailSentAt,
            EmailTypeToSend = postulacion.EmailTypeToSend,
            EmailRetryCount = postulacion.EmailRetryCount,
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
