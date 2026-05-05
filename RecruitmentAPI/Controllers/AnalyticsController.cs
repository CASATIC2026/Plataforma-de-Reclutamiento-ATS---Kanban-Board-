using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/analytics")]
[Authorize(Roles = "Administrador,Manager")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analytics;

    public AnalyticsController(IAnalyticsService analytics) => _analytics = analytics;

    [HttpGet("pipeline")]
    public async Task<IActionResult> GetPipeline([FromQuery] Guid? empresaId) =>
        Ok(await _analytics.GetPipelineFunnelAsync(empresaId));

    [HttpGet("time-to-hire")]
    public async Task<IActionResult> GetTimeToHire([FromQuery] Guid? empresaId) =>
        Ok(await _analytics.GetTimeToHireAsync(empresaId));

    [HttpGet("sources")]
    public async Task<IActionResult> GetSources([FromQuery] Guid? empresaId) =>
        Ok(await _analytics.GetSourceStatsAsync(empresaId));

    [HttpGet("team")]
    public async Task<IActionResult> GetTeam([FromQuery] Guid? empresaId) =>
        Ok(await _analytics.GetTeamActivityAsync(empresaId));
}
