using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/roles")]
[Authorize(Roles = "Administrador")]
public class RolesController : ControllerBase
{
    private readonly IRolRepository _repo;

    public RolesController(IRolRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _repo.GetAllWithPermisosAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRolDTO dto)
    {
        var existing = await _repo.GetByNombreAsync(dto.Nombre);
        if (existing != null)
            return Conflict(new { message = "Ya existe un rol con ese nombre." });

        var rol = await _repo.CreateAsync(new Rol
        {
            Nombre = dto.Nombre.Trim(),
            Ambito = dto.Ambito
        }, dto.Permisos);

        return CreatedAtAction(nameof(GetAll), new RolResponseDTO
        {
            Id = rol.Id,
            Nombre = rol.Nombre,
            Ambito = rol.Ambito,
            EsInmutable = rol.EsInmutable,
            Permisos = dto.Permisos
        });
    }

    [HttpPatch("{id:guid}/permisos")]
    public async Task<IActionResult> UpdatePermisos(Guid id, [FromBody] UpdateRolPermisosDTO dto)
    {
        var updated = await _repo.UpdatePermisosAsync(id, dto.Permisos);
        if (!updated) return BadRequest(new { message = "No se pudo actualizar. El rol es inmutable o no existe." });
        return Ok(new { message = "Permisos actualizados." });
    }

    [HttpPost("assign")]
    public async Task<IActionResult> Assign([FromBody] AssignRolDTO dto)
    {
        var currentUserId = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : (Guid?)null;
        var ok = await _repo.AssignRolToUsuarioAsync(dto.UsuarioId, dto.RolNombre, dto.EmpresaId, currentUserId);
        if (!ok) return BadRequest(new { message = "Rol no encontrado o ya asignado." });
        return Ok(new { message = "Rol asignado exitosamente." });
    }
}
