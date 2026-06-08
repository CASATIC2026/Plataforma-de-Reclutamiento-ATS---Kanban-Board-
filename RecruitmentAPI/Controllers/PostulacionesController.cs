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
    private readonly ICurrentUser _current;

    public PostulacionesController(IPostulacionService service, AppDbContext db, ICurrentUser current)
    {
        _service = service;
        _db = db;
        _current = current;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<PostulacionResponseDTO>>> GetAll()
    {
        if (!_current.HasPermission("applications:read") && !_current.HasPermission("applications:read_all")) return Forbid();
        var postulaciones = await _service.GetAllAsync();
        return Ok(postulaciones);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<PostulacionResponseDTO>> GetById(Guid id)
    {
        if (!_current.HasPermission("applications:read") && !_current.HasPermission("applications:read_all")) return Forbid();
        var postulacion = await _service.GetByIdAsync(id);
        if (postulacion == null) return NotFound(new { message = "Postulación no encontrada" });
        return Ok(postulacion);
    }

    [Authorize]
    [HttpGet("vacante/{vacanteId}")]
    public async Task<ActionResult<List<PostulacionResponseDTO>>> GetByVacante(Guid vacanteId)
    {
        if (!_current.HasPermission("applications:read") && !_current.HasPermission("applications:read_all")) return Forbid();
        var postulaciones = await _service.GetByVacanteIdAsync(vacanteId);
        return Ok(postulaciones);
    }

    // Public anonymous endpoint — candidate applies to a vacante. No tenant scope needed
    // because the vacante itself carries the company context.
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<PostulacionResponseDTO>> Create([FromForm] CreatePostulacionDTO dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [Authorize]
    [HttpGet("{id}/cv")]
    public async Task<IActionResult> GetCv(Guid id)
    {
        if (!_current.HasPermission("applications:read") && !_current.HasPermission("applications:read_all")) return Forbid();
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

    [Authorize]
    [HttpPatch("{id}/notas")]
    public async Task<ActionResult<PostulacionResponseDTO>> UpdateNotas(Guid id, [FromBody] UpdateNotasDTO dto)
    {
        if (!_current.HasPermission("applications:add_note")) return Forbid();
        var updated = await _service.UpdateNotasAsync(id, dto.Notas);
        if (updated == null) return NotFound(new { message = "Postulación no encontrada" });
        return Ok(updated);
    }

    [Authorize]
    [HttpPatch("{id}/estado")]
    public async Task<ActionResult<PostulacionResponseDTO>> UpdateEstado(Guid id, [FromBody] UpdateEstadoDTO dto)
    {
        if (!_current.HasPermission("applications:update_status")) return Forbid();
        if (!Enum.IsDefined(typeof(EstadoPostulacion), dto.Estado))
            return BadRequest(new { message = "Valor de estado inválido. Use 0 (Nuevo), 1 (Entrevista), 2 (PruebaTecnica) o 3 (Oferta)." });

        var updated = await _service.UpdateEstadoAsync(id, dto.Estado);
        if (updated == null) return NotFound(new { message = "Postulación no encontrada" });

        return Ok(updated);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        if (!_current.HasPermission("applications:add_note")) return Forbid(); // reuse closest perm
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound(new { message = "Postulación no encontrada" });
        return NoContent();
    }

    // ── Email automation actions ──

    /// <summary>Loads the postulacion + parent Vacante and verifies the caller is in scope.
    /// Returns null when out-of-scope so the caller can produce a 404 (not 403).</summary>
    private async Task<Postulacion?> LoadInScopeAsync(Guid id)
    {
        var p = await _db.Postulaciones.Include(x => x.Vacante).FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return null;
        if (!_current.CanAccessResource(p.Vacante?.EmpresaId, p.Vacante?.CreadoPor)) return null;
        return p;
    }

    [Authorize]
    [HttpPost("{id:guid}/send-email-now")]
    public async Task<IActionResult> SendEmailNow(Guid id)
    {
        if (!_current.HasPermission("applications:review")) return Forbid();
        var p = await LoadInScopeAsync(id);
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
        if (!_current.HasPermission("applications:review")) return Forbid();
        var p = await LoadInScopeAsync(id);
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
        if (!_current.HasPermission("applications:review")) return Forbid();
        var p = await LoadInScopeAsync(id);
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
        if (!_current.HasPermission("applications:review")) return Forbid();
        var p = await LoadInScopeAsync(id);
        if (p == null) return NotFound();

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
