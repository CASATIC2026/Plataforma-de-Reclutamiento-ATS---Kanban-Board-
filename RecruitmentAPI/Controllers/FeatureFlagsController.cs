using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/feature-flags")]
[Authorize(Roles = "Administrador")]
public class FeatureFlagsController : ControllerBase
{
    private readonly IFeatureFlagService _service;

    public FeatureFlagsController(IFeatureFlagService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpPatch("{id:guid}/toggle")]
    public async Task<IActionResult> Toggle(Guid id)
    {
        var userId = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : (Guid?)null;
        var result = await _service.ToggleAsync(id, userId);
        return result == null ? NotFound() : Ok(result);
    }
}
