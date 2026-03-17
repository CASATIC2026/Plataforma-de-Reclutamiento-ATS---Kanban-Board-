using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IPostulacionService
{
    Task<List<PostulacionResponseDTO>> GetAllAsync();
    Task<PostulacionResponseDTO?> GetByIdAsync(Guid id);
    Task<List<PostulacionResponseDTO>> GetByVacanteIdAsync(Guid vacanteId);
    Task<PostulacionResponseDTO> CreateAsync(CreatePostulacionDTO dto);
    Task<PostulacionResponseDTO?> UpdateEstadoAsync(Guid id, UpdatePostulacionEstadoDTO dto);
    Task<bool> DeleteAsync(Guid id);
}
