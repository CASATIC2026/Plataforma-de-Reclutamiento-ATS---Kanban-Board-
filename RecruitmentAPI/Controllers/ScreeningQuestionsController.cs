using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/vacantes")]
public class ScreeningQuestionsController : ControllerBase
{
    private readonly IScreeningQuestionService _service;

    public ScreeningQuestionsController(IScreeningQuestionService service)
    {
        _service = service;
    }

    [HttpGet("{vacanteId}/screening-questions")]
    public async Task<ActionResult<List<ScreeningQuestionDTO>>> GetByVacante(Guid vacanteId)
    {
        var questions = await _service.GetByVacanteIdAsync(vacanteId);
        return Ok(questions);
    }

    [Authorize]
    [HttpPost("{vacanteId}/screening-questions")]
    public async Task<ActionResult<ScreeningQuestionDTO>> Create(Guid vacanteId, [FromBody] CreateScreeningQuestionDTO dto)
    {
        if (vacanteId != dto.VacanteId)
            return BadRequest("VacanteId in URL does not match DTO");

        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetByVacante), new { vacanteId }, result);
    }

    [Authorize]
    [HttpPut("{vacanteId}/screening-questions/{id}")]
    public async Task<ActionResult<ScreeningQuestionDTO>> Update(Guid vacanteId, Guid id, [FromBody] CreateScreeningQuestionDTO dto)
    {
        if (vacanteId != dto.VacanteId)
            return BadRequest("VacanteId in URL does not match DTO");

        var result = await _service.UpdateAsync(id, dto);
        if (result == null) return NotFound();

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{vacanteId}/screening-questions/{id}")]
    public async Task<IActionResult> Delete(Guid vacanteId, Guid id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}
