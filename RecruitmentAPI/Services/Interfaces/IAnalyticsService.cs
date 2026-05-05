using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IAnalyticsService
{
    Task<AnalyticsPipelineDTO> GetPipelineFunnelAsync(Guid? empresaId = null);
    Task<AnalyticsTimeToHireDTO> GetTimeToHireAsync(Guid? empresaId = null);
    Task<AnalyticsSourceDTO> GetSourceStatsAsync(Guid? empresaId = null);
    Task<AnalyticsTeamDTO> GetTeamActivityAsync(Guid? empresaId = null);
}
