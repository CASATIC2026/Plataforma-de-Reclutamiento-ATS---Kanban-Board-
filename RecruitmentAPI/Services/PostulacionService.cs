using System.Text.Json;
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

    public PostulacionService(
        IPostulacionRepository repository,
        IVacanteRepository vacanteRepository,
        IScoringService scoringService,
        IEmailService emailService,
        IWebHostEnvironment env)
    {
        _repository = repository;
        _vacanteRepository = vacanteRepository;
        _scoringService = scoringService;
        _emailService = emailService;
        _env = env;
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
            // Validate file extension
            var extension = Path.GetExtension(dto.CvFile.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                throw new InvalidOperationException($"File type '{extension}' is not allowed. Allowed types: {string.Join(", ", AllowedExtensions)}");

            // Validate file size (5 MB max)
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
        };

        var created = await _repository.CreateAsync(postulacion);

        // Load vacante for scoring
        var vacante = await _vacanteRepository.GetByIdAsync(created.VacanteId);
        if (vacante != null)
        {
            // Run scoring
            var scoreResult = _scoringService.Score(created, vacante, dto.Carrera, dto.Ubicacion);
            created.Puntaje = scoreResult.Puntaje;
            created.PuntajeDetalle = JsonSerializer.Serialize(scoreResult.Detalle);

            // Determine estado: if screening active and score below threshold → Rechazado
            if (vacante.ScreeningActivo && scoreResult.Puntaje < vacante.UmbralPuntaje)
            {
                created.Estado = EstadoPostulacion.Rechazado;
            }

            // Update postulacion with scores and estado
            await _repository.UpdateAsync(created);

            // Send confirmation email
            await _emailService.SendConfirmacionAsync(created, vacante);

            // Send result email only if screening is active
            if (vacante.ScreeningActivo)
            {
                bool apto = created.Estado != EstadoPostulacion.Rechazado;
                await _emailService.SendResultadoAsync(created, vacante, apto);
            }
        }

        // Reload with Vacante included
        var withVacante = await _repository.GetByIdAsync(created.Id);
        return MapToResponseDTO(withVacante!);
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

    // --- Private mapping helper ---
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
