using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/review")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ICurrentUser _current;

    public ReviewController(AppDbContext db, ICurrentUser current) { _db = db; _current = current; }

    private bool CanReview() => _current.HasPermission("applications:review");

    /// <summary>Filter the review queue to applications whose parent Vacante belongs to
    /// the caller's tenant scope (and creator scope for recruiters).</summary>
    private IQueryable<Postulacion> ApplyScope(IQueryable<Postulacion> query)
    {
        if (_current.IsPlatformTier) return query;
        if (_current.CanSeeAllCompanyJobs)
            return query.Where(p => p.Vacante.EmpresaId == _current.CompanyId);
        return query.Where(p => p.Vacante.EmpresaId == _current.CompanyId && p.Vacante.CreadoPor == _current.UserId);
    }

    [HttpGet("pending")]
    public async Task<IActionResult> Pending(
        [FromQuery] Guid? vacanteId,
        [FromQuery] decimal? scoreMin,
        [FromQuery] decimal? scoreMax,
        [FromQuery] int? hoursLeftMin,
        [FromQuery] int? hoursLeftMax)
    {
        if (!CanReview()) return Forbid();

        var query = ApplyScope(_db.Postulaciones
            .Include(p => p.Vacante)
            .Where(p => p.EmailStatus == "pending"));

        if (vacanteId.HasValue) query = query.Where(p => p.VacanteId == vacanteId.Value);
        if (scoreMin.HasValue)  query = query.Where(p => p.Puntaje >= scoreMin.Value);
        if (scoreMax.HasValue)  query = query.Where(p => p.Puntaje <= scoreMax.Value);

        var rows = await query.OrderBy(p => p.EmailScheduledFor).ToListAsync();

        // Optional hours-left post-filter (kept in-memory for simplicity)
        var now = DateTime.UtcNow;
        IEnumerable<Postulacion> filtered = rows;
        if (hoursLeftMin.HasValue)
            filtered = filtered.Where(p => p.EmailScheduledFor.HasValue && (p.EmailScheduledFor.Value - now).TotalHours >= hoursLeftMin.Value);
        if (hoursLeftMax.HasValue)
            filtered = filtered.Where(p => p.EmailScheduledFor.HasValue && (p.EmailScheduledFor.Value - now).TotalHours <= hoursLeftMax.Value);

        return Ok(filtered.Select(Map).ToList());
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats()
    {
        if (!CanReview()) return Forbid();
        var pending = await ApplyScope(_db.Postulaciones.Include(p => p.Vacante).Where(p => p.EmailStatus == "pending")).CountAsync();
        return Ok(new { pendingCount = pending });
    }

    [HttpPost("{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        if (!CanReview()) return Forbid();
        var p = await _db.Postulaciones.Include(x => x.Vacante).FirstOrDefaultAsync(x => x.Id == id);
        if (p == null || !_current.CanAccessResource(p.Vacante?.EmpresaId, p.Vacante?.CreadoPor)) return NotFound();

        // Approve = let candidate through. Reset to Nuevo if it was auto-rejected,
        // switch the email to confirmation, and dispatch immediately.
        if (p.Estado == EstadoPostulacion.Rechazado) p.Estado = EstadoPostulacion.Nuevo;
        p.EmailTypeToSend = "confirmacion_recepcion";
        p.EmailStatus = "pending";
        p.EmailScheduledFor = DateTime.UtcNow;
        p.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Aprobado. Email programado para envío inmediato." });
    }

    [HttpPost("{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] RejectReviewDTO? body)
    {
        if (!CanReview()) return Forbid();
        var p = await _db.Postulaciones.Include(x => x.Vacante).FirstOrDefaultAsync(x => x.Id == id);
        if (p == null || !_current.CanAccessResource(p.Vacante?.EmpresaId, p.Vacante?.CreadoPor)) return NotFound();

        p.Estado = EstadoPostulacion.Rechazado;
        p.EmailTypeToSend = "rechazo_screening";
        p.EmailStatus = "pending";
        p.EmailScheduledFor = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(body?.Reason))
            p.NotasInternas = string.IsNullOrEmpty(p.NotasInternas) ? body!.Reason : $"{p.NotasInternas}\n---\n{body!.Reason}";
        p.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Rechazado. Email programado para envío inmediato." });
    }

    [HttpPost("bulk-approve")]
    public async Task<IActionResult> BulkApprove([FromBody] List<Guid> ids)
    {
        if (!CanReview()) return Forbid();
        if (ids == null || ids.Count == 0) return BadRequest(new { message = "Lista vacía." });

        var rows = await ApplyScope(_db.Postulaciones.Include(p => p.Vacante).Where(p => ids.Contains(p.Id))).ToListAsync();
        var now = DateTime.UtcNow;
        foreach (var p in rows)
        {
            if (p.Estado == EstadoPostulacion.Rechazado) p.Estado = EstadoPostulacion.Nuevo;
            p.EmailTypeToSend = "confirmacion_recepcion";
            p.EmailStatus = "pending";
            p.EmailScheduledFor = now;
            p.UpdatedAt = now;
        }
        await _db.SaveChangesAsync();
        return Ok(new { approved = rows.Count });
    }

    [HttpPost("bulk-reject")]
    public async Task<IActionResult> BulkReject([FromBody] BulkRejectDTO body)
    {
        if (!CanReview()) return Forbid();
        if (body?.Ids == null || body.Ids.Count == 0) return BadRequest(new { message = "Lista vacía." });

        var rows = await ApplyScope(_db.Postulaciones.Include(p => p.Vacante).Where(p => body.Ids.Contains(p.Id))).ToListAsync();
        var now = DateTime.UtcNow;
        foreach (var p in rows)
        {
            p.Estado = EstadoPostulacion.Rechazado;
            p.EmailTypeToSend = "rechazo_screening";
            p.EmailStatus = "pending";
            p.EmailScheduledFor = now;
            if (!string.IsNullOrWhiteSpace(body.Reason))
                p.NotasInternas = string.IsNullOrEmpty(p.NotasInternas) ? body.Reason : $"{p.NotasInternas}\n---\n{body.Reason}";
            p.UpdatedAt = now;
        }
        await _db.SaveChangesAsync();
        return Ok(new { rejected = rows.Count });
    }

    private static PostulacionResponseDTO Map(Postulacion p) => new()
    {
        Id = p.Id,
        NombreCandidato = p.NombreCandidato,
        Email = p.Email,
        Telefono = p.Telefono,
        CvFileName = p.CvFileName,
        VacanteId = p.VacanteId,
        VacanteTitulo = p.Vacante?.Titulo ?? string.Empty,
        Estado = p.Estado,
        NotasInternas = p.NotasInternas,
        Puntaje = p.Puntaje,
        PuntajeDetalle = p.PuntajeDetalle,
        CreatedAt = p.CreatedAt,
        UpdatedAt = p.UpdatedAt,
        EmailStatus = p.EmailStatus,
        EmailScheduledFor = p.EmailScheduledFor,
        EmailSentAt = p.EmailSentAt,
        EmailTypeToSend = p.EmailTypeToSend,
        EmailRetryCount = p.EmailRetryCount,
    };
}
