using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IVacanteService
{
    Task<List<VacanteResponseDTO>> GetAllAsync();
    Task<VacanteResponseDTO?> GetByIdAsync(Guid id);
    Task<VacanteResponseDTO> CreateAsync(CreateVacanteDTO dto);
    Task<VacanteResponseDTO?> UpdateAsync(Guid id, UpdateVacanteDTO dto);
    Task<bool> DeleteAsync(Guid id);
}