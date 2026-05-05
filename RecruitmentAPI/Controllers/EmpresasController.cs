using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/empresas")]
[Authorize(Roles = "Administrador")]
public class EmpresasController : ControllerBase
{
    private readonly IEmpresaRepository _repo;

    public EmpresasController(IEmpresaRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _repo.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var empresa = await _repo.GetByIdAsync(id);
        return empresa == null ? NotFound() : Ok(new EmpresaResponseDTO
        {
            Id = empresa.Id,
            Nombre = empresa.Nombre,
            Dominio = empresa.Dominio,
            Estado = empresa.Estado,
            UsuariosCount = empresa.Usuarios.Count,
            VacantesCount = empresa.Vacantes.Count,
            CreatedAt = empresa.CreatedAt
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmpresaDTO dto)
    {
        var empresa = await _repo.CreateAsync(new Empresa
        {
            Nombre = dto.Nombre.Trim(),
            Dominio = dto.Dominio?.Trim(),
            Estado = "activa"
        });
        return CreatedAtAction(nameof(GetById), new { id = empresa.Id }, new EmpresaResponseDTO
        {
            Id = empresa.Id,
            Nombre = empresa.Nombre,
            Dominio = empresa.Dominio,
            Estado = empresa.Estado,
            CreatedAt = empresa.CreatedAt
        });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateEmpresaDTO dto)
    {
        var result = await _repo.UpdateAsync(id, dto.Nombre.Trim(), dto.Dominio?.Trim());
        if (result == null) return NotFound();
        return Ok(new EmpresaResponseDTO { Id = result.Id, Nombre = result.Nombre, Dominio = result.Dominio, Estado = result.Estado });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Disable(Guid id) =>
        await _repo.DisableAsync(id) ? NoContent() : NotFound();
}
