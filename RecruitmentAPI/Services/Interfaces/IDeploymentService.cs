using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IDeploymentService
{
    Task<List<DeploymentLogResponseDTO>> GetHistoryAsync();
    Task<DeploymentLogResponseDTO> TriggerAsync(Guid? usuarioId);
    Task<DeploymentLogResponseDTO?> RollbackAsync(Guid deploymentId, Guid? usuarioId);
}
