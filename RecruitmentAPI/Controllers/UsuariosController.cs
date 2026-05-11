using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsuariosController : ControllerBase
{
    private readonly IAuthService _authService;

    public UsuariosController(IAuthService authService)
    {
        _authService = authService;
    }

    private string Permisos() => User.FindAll("permissions").FirstOrDefault()?.Value ?? "";

    [HttpGet]
    public async Task<ActionResult<List<UsuarioResponseDTO>>> GetAll()
    {
        if (!Permisos().Contains("users:read")) return Forbid();
        var users = await _authService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPatch("{id}/rol")]
    public async Task<ActionResult<UsuarioResponseDTO>> ChangeRol(Guid id, [FromBody] ChangeRolDTO dto)
    {
        if (!Permisos().Contains("users:update")) return Forbid();
        try
        {
            var updated = await _authService.ChangeRolAsync(id, dto.Rol);
            if (updated == null) return NotFound(new { message = "Usuario no encontrado o rol inválido." });
            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        if (!Permisos().Contains("users:disable")) return Forbid();
        try
        {
            var deleted = await _authService.DeleteUserAsync(id);
            if (!deleted) return NotFound(new { message = "Usuario no encontrado." });
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
