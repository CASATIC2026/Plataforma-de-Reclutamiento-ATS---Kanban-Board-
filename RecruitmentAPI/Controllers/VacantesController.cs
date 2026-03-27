using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VacantesController : ControllerBase
{
    private readonly IVacanteService _service;

    public VacantesController(IVacanteService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<VacanteResponseDTO>>> GetAll()
    {
        var vacantes = await _service.GetAllAsync();
        return Ok(vacantes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VacanteResponseDTO>> GetById(Guid id)
    {
        var vacante = await _service.GetByIdAsync(id);
        if (vacante == null) return NotFound(new { message = "Vacante no encontrada" });
        return Ok(vacante);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<VacanteResponseDTO>> Create([FromBody] CreateVacanteDTO dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<VacanteResponseDTO>> Update(Guid id, [FromBody] UpdateVacanteDTO dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null) return NotFound(new { message = "Vacante no encontrada" });
        return Ok(updated);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound(new { message = "Vacante no encontrada" });
        return NoContent();
    }
}