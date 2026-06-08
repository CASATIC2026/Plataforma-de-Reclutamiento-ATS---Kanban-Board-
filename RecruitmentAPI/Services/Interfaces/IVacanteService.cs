using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IVacanteService
{
    /// <summary>
    /// Lists vacantes scoped by the current user's role:
    ///  - Recruiter: own jobs in own company
    ///  - Manager: all jobs in own company
    ///  - Platform tier: all jobs (optionally filtered by <paramref name="filterCompanyId"/>)
    /// Anonymous/public callers see only active vacantes across all companies.
    /// </summary>
    Task<List<VacanteResponseDTO>> GetAllAsync(Guid? filterCompanyId = null);
    Task<VacanteResponseDTO?> GetByIdAsync(Guid id);
    Task<VacanteResponseDTO> CreateAsync(CreateVacanteDTO dto, Guid? targetCompanyId = null);
    Task<VacanteResponseDTO?> UpdateAsync(Guid id, UpdateVacanteDTO dto);
    Task<bool> DeleteAsync(Guid id);
}
