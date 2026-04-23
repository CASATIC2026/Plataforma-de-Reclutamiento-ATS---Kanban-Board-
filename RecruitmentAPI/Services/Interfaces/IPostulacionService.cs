using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Services.Interfaces;

public interface IPostulacionService
{
    Task<List<PostulacionResponseDTO>> GetAllAsync();
    Task<PostulacionResponseDTO?> GetByIdAsync(Guid id);
    Task<List<PostulacionResponseDTO>> GetByVacanteIdAsync(Guid vacanteId);
    Task<PostulacionResponseDTO> CreateAsync(CreatePostulacionDTO dto);
    Task<PostulacionResponseDTO?> UpdateEstadoAsync(Guid id, EstadoPostulacion estado);
    Task<PostulacionResponseDTO?> UpdateNotasAsync(Guid id, string? notas);
    Task<(string FilePath, string FileName)?> GetCvAsync(Guid id);
    Task<bool> DeleteAsync(Guid id);
}
