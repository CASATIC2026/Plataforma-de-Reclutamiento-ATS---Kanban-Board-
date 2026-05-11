using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostulacionesController : ControllerBase
{
    private readonly IPostulacionService _service;
    private readonly AppDbContext _db;

    public PostulacionesController(IPostulacionService service, AppDbContext db)
    {
        _service = service;
        _db = db;
    }

    private string Permisos() => User.FindAll("permissions").FirstOrDefault()?.Value ?? "";

    [Authorize(Roles = "Administrador,Manager")]
    [HttpGet]
    public async Task<ActionResult<List<PostulacionResponseDTO>>> GetAll()
    {
        var postulaciones = await _service.GetAllAsync();
        return Ok(postulaciones);
    }

    [Authorize(Roles = "Administrador,Manager")]
    [HttpGet("{id}")]
    public async Task<ActionResult<PostulacionResponseDTO>> GetById(Guid id)
    {
        var postulacion = await _service.GetByIdAsync(id);
        if (postulacion == null) return NotFound(new { message = "Postulación no encontrada" });
        return Ok(postulacion);
    }

    [Authorize(Roles = "Administrador,Manager")]
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

    [Authorize(Roles = "Administrador,Manager")]
    [HttpGet("{id}/cv")]
    public async Task<IActionResult> GetCv(Guid id)
    {
        var cvInfo = await _service.GetCvAsync(id);
        if (cvInfo == null) return NotFound(new { message = "CV no encontrado" });

        var (filePath, fileName) = cvInfo.Value;
        if (!System.IO.File.Exists(filePath))
            return NotFound(new { message = "Archivo no encontrado en disco" });

        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var contentType = ext switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            _ => "application/octet-stream"
        };

        Response.Headers.Append("Content-Disposition",
            ext == ".pdf" ? $"inline; filename=\"{fileName}\"" : $"attachment; filename=\"{fileName}\"");

        return PhysicalFile(filePath, contentType);
    }

    [Authorize(Roles = "Administrador,Manager")]
    [HttpPatch("{id}/notas")]
    public async Task<ActionResult<PostulacionResponseDTO>> UpdateNotas(Guid id, [FromBody] UpdateNotasDTO dto)
    {
        var updated = await _service.UpdateNotasAsync(id, dto.Notas);
        if (updated == null) return NotFound(new { message = "Postulación no encontrada" });
        return Ok(updated);
    }

    [Authorize(Roles = "Administrador,Manager")]
    [HttpPatch("{id}/estado")]
    public async Task<ActionResult<PostulacionResponseDTO>> UpdateEstado(Guid id, [FromBody] UpdateEstadoDTO dto)
    {
        if (!Enum.IsDefined(typeof(EstadoPostulacion), dto.Estado))
            return BadRequest(new { message = "Valor de estado inválido. Use 0 (Nuevo), 1 (Entrevista), 2 (PruebaTecnica) o 3 (Oferta)." });

        var updated = await _service.UpdateEstadoAsync(id, dto.Estado);
        if (updated == null) return NotFound(new { message = "Postulación no encontrada" });

        return Ok(updated);
    }

    [Authorize(Roles = "Administrador")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound(new { message = "Postulación no encontrada" });
        return NoContent();
    }

    // ── Email automation actions ──

    [Authorize]
    [HttpPost("{id:guid}/send-email-now")]
    public async Task<IActionResult> SendEmailNow(Guid id)
    {
        if (!Permisos().Contains("applications:review")) return Forbid();
        var p = await _db.Postulaciones.FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return NotFound();
        if (p.EmailStatus != "pending" && p.EmailStatus != "cancelled" && p.EmailStatus != "failed")
            return BadRequest(new { message = "El email ya fue enviado." });

        p.EmailStatus = "pending";
        p.EmailScheduledFor = DateTime.UtcNow;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Email programado para envío inmediato." });
    }

    [Authorize]
    [HttpPost("{id:guid}/cancel-email")]
    public async Task<IActionResult> CancelEmail(Guid id)
    {
        if (!Permisos().Contains("applications:review")) return Forbid();
        var p = await _db.Postulaciones.FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return NotFound();
        if (p.EmailStatus != "pending")
            return BadRequest(new { message = "Solo se pueden cancelar emails pendientes." });

        p.EmailStatus = "cancelled";
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Email cancelado." });
    }

    [Authorize]
    [HttpPost("{id:guid}/restart-timer")]
    public async Task<IActionResult> RestartTimer(Guid id, [FromQuery] int? minutes)
    {
        if (!Permisos().Contains("applications:review")) return Forbid();
        var p = await _db.Postulaciones.FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return NotFound();

        var delay = minutes ?? (int.TryParse(Environment.GetEnvironmentVariable("EMAIL_DELAY_MINUTES"), out var d) ? d : 5);
        p.EmailStatus = "pending";
        p.EmailScheduledFor = DateTime.UtcNow.AddMinutes(delay);
        p.EmailRetryCount = 0;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(new { message = $"Timer reiniciado a {delay} min." });
    }

    [Authorize]
    [HttpGet("{id:guid}/email-log")]
    public async Task<IActionResult> GetEmailLog(Guid id)
    {
        if (!Permisos().Contains("applications:review")) return Forbid();
        var logs = await _db.EmailLogs
            .Where(e => e.PostulacionId == id)
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new
            {
                e.Id,
                emailType = e.EmailType,
                e.Subject,
                e.Status,
                sentAt = e.SentAt,
                attemptCount = e.AttemptCount,
                lastError = e.LastError,
                createdAt = e.CreatedAt,
            })
            .ToListAsync();
        return Ok(logs);
    }
}
