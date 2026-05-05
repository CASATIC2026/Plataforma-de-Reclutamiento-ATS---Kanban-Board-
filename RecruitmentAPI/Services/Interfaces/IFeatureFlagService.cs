using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IFeatureFlagService
{
    Task<List<FeatureFlagResponseDTO>> GetAllAsync();
    Task<FeatureFlagResponseDTO?> ToggleAsync(Guid id, Guid? usuarioId);
}
