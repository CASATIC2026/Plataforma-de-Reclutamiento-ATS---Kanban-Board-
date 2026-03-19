using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class PostulacionService : IPostulacionService
{
    private readonly IPostulacionRepository _repository;
    private readonly IWebHostEnvironment _env;

    public PostulacionService(IPostulacionRepository repository, IWebHostEnvironment env)
    {
        _repository = repository;
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
            var extension = Path.GetExtension(dto.CvFile.FileName);
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
<<<<<<< HEAD
            CvFileName = cvFileName, 
=======
            CvFileName = cvFileName,
>>>>>>> 0145ebc5970147f9474b6bd257190a89db667477
            CvFilePath = cvFilePath,
        };

        var created = await _repository.CreateAsync(postulacion);

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
            CreatedAt = postulacion.CreatedAt,
            UpdatedAt = postulacion.UpdatedAt,
        };
    }
<<<<<<< HEAD

    public async Task<PostulacionResponseDTO?> UpdateEstadoAsync(Guid id, UpdatePostulacionEstadoDTO dto)
{
    var estadosValidos = new[] { "Nuevo", "Entrevista", "PruebaTecnica", "Oferta" };
    if (!estadosValidos.Contains(dto.Estado))
        throw new ArgumentException($"Estado inválido: {dto.Estado}");

    var postulacion = await _repository.UpdateEstadoAsync(id, dto.Estado);
    if (postulacion is null) return null;

    return new PostulacionResponseDTO
    {
        Id = postulacion.Id,
        VacanteId = postulacion.VacanteId,
        NombreCandidato = postulacion.NombreCandidato,
        Email = postulacion.Email,
        Telefono = postulacion.Telefono,
        CvFileName = postulacion.CvFileName,
        Estado = postulacion.Estado,
        CreatedAt = postulacion.CreatedAt
    };
}
=======
>>>>>>> 0145ebc5970147f9474b6bd257190a89db667477
}
