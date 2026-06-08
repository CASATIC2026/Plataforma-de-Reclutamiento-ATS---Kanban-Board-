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
    private readonly ICurrentUser _current;

    public VacantesController(IVacanteService service, ICurrentUser current)
    {
        _service = service;
        _current = current;
    }

    // GET is intentionally anonymous so the public job board still works for unauthenticated visitors.
    // The service inspects the JWT (via ICurrentUser) and applies the correct scope:
    //   - anonymous / candidate → active jobs across all companies
    //   - recruiter → own jobs in own company
    //   - manager → all jobs in own company
    //   - platform admin → all jobs (optionally filtered by ?companyId=)
    [HttpGet]
    public async Task<ActionResult<List<VacanteResponseDTO>>> GetAll([FromQuery] Guid? companyId)
    {
        var vacantes = await _service.GetAllAsync(companyId);
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
    public async Task<ActionResult<VacanteResponseDTO>> Create([FromBody] CreateVacanteDTO dto, [FromQuery] Guid? companyId)
    {
        if (!_current.HasPermission("jobs:create")) return Forbid();
        try
        {
            var created = await _service.CreateAsync(dto, companyId);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<VacanteResponseDTO>> Update(Guid id, [FromBody] UpdateVacanteDTO dto)
    {
        if (!_current.HasPermission("jobs:update")) return Forbid();
        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null) return NotFound(new { message = "Vacante no encontrada" });
        return Ok(updated);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        if (!_current.HasPermission("jobs:delete")) return Forbid();
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound(new { message = "Vacante no encontrada" });
        return NoContent();
    }
}
