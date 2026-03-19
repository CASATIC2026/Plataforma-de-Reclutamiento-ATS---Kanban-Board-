using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostulacionesController : ControllerBase
{
    private readonly IPostulacionService _service;

    public PostulacionesController(IPostulacionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<PostulacionResponseDTO>>> GetAll()
    {
        var postulaciones = await _service.GetAllAsync();
        return Ok(postulaciones);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostulacionResponseDTO>> GetById(Guid id)
    {
        var postulacion = await _service.GetByIdAsync(id);
        if (postulacion == null) return NotFound(new { message = "Postulación no encontrada" });
        return Ok(postulacion);
    }

    [HttpGet("vacante/{vacanteId}")]
    public async Task<ActionResult<List<PostulacionResponseDTO>>> GetByVacante(Guid vacanteId)
    {
        var postulaciones = await _service.GetByVacanteIdAsync(vacanteId);
        return Ok(postulaciones);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<PostulacionResponseDTO>> Create([FromForm] CreatePostulacionDTO dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPatch("{id}/estado")]
    public async Task<ActionResult<PostulacionResponseDTO>> UpdateEstado(Guid id, [FromBody] UpdateEstadoDTO dto)
    {
        if (!Enum.IsDefined(typeof(EstadoPostulacion), dto.Estado))
            return BadRequest(new { message = "Valor de estado inválido. Use 0 (Nuevo), 1 (Entrevista), 2 (PruebaTecnica) o 3 (Oferta)." });

        var updated = await _service.UpdateEstadoAsync(id, dto.Estado);
        if (updated == null) return NotFound(new { message = "Postulación no encontrada" });

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound(new { message = "Postulación no encontrada" });
        return NoContent();
    }
<<<<<<< HEAD

    [HttpPatch("{id:guid}/estado")]
public async Task<IActionResult> UpdateEstado(Guid id, [FromBody] UpdatePostulacionEstadoDTO dto)
{
    try
    {
        var result = await _service.UpdateEstadoAsync(id, dto);
        if (result is null) return NotFound();
        return Ok(result);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}
=======
>>>>>>> 0145ebc5970147f9474b6bd257190a89db667477
}
