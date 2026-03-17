using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IPostulacionService
{
    Task<List<PostulacionResponseDTO>> GetAllAsync();
    Task<PostulacionResponseDTO?> GetByIdAsync(Guid id);
    Task<List<PostulacionResponseDTO>> GetByVacanteIdAsync(Guid vacanteId);
    Task<PostulacionResponseDTO> CreateAsync(CreatePostulacionDTO dto);
<<<<<<< HEAD
    Task<PostulacionResponseDTO?> UpdateEstadoAsync(Guid id, UpdatePostulacionEstadoDTO dto);
=======
>>>>>>> 0145ebc5970147f9474b6bd257190a89db667477
    Task<bool> DeleteAsync(Guid id);
}
