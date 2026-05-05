using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/ops")]
[Authorize(Roles = "Administrador")]
public class OpsController : ControllerBase
{
    private readonly IDeploymentService _deployments;
    private readonly IFeatureFlagService _flags;

    public OpsController(IDeploymentService deployments, IFeatureFlagService flags)
    {
        _deployments = deployments;
        _flags = flags;
    }

    [HttpGet("deployments")]
    public async Task<IActionResult> GetDeployments() =>
        Ok(await _deployments.GetHistoryAsync());

    [HttpPost("deploy")]
    public async Task<IActionResult> Trigger()
    {
        var userId = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : (Guid?)null;
        return Ok(await _deployments.TriggerAsync(userId));
    }

    [HttpPost("rollback/{id:guid}")]
    public async Task<IActionResult> Rollback(Guid id)
    {
        var userId = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : (Guid?)null;
        var result = await _deployments.RollbackAsync(id, userId);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("feature-flags")]
    public async Task<IActionResult> GetFlags() =>
        Ok(await _flags.GetAllAsync());
}
