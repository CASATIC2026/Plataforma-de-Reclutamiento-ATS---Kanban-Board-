using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class AuditService : IAuditService
{
    private readonly AppDbContext _context;

    public AuditService(AppDbContext context) => _context = context;

    public async Task LogAsync(Guid? usuarioId, string accion, string? recurso, string resultado, string? ip = null, string? detalles = null)
    {
        try
        {
            _context.AuditLogs.Add(new AuditLog
            {
                UsuarioId = usuarioId,
                Accion = accion,
                Recurso = recurso,
                Resultado = resultado,
                Ip = ip,
                Detalles = detalles,
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AUDIT] Failed to write log: {ex.Message}");
        }
    }

    public async Task<List<AuditLogResponseDTO>> GetLogsAsync(DateTime? from, DateTime? to, Guid? usuarioId, string? resultado, int page = 1, int pageSize = 50)
    {
        var query = _context.AuditLogs
            .Include(a => a.Usuario)
            .AsQueryable();

        if (from.HasValue)
            query = query.Where(a => a.CreatedAt >= from.Value);
        if (to.HasValue)
            query = query.Where(a => a.CreatedAt <= to.Value);
        if (usuarioId.HasValue)
            query = query.Where(a => a.UsuarioId == usuarioId);
        if (!string.IsNullOrEmpty(resultado))
            query = query.Where(a => a.Resultado == resultado);

        return await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AuditLogResponseDTO
            {
                Id = a.Id,
                UsuarioEmail = a.Usuario != null ? a.Usuario.Email : null,
                Accion = a.Accion,
                Recurso = a.Recurso,
                Resultado = a.Resultado,
                Ip = a.Ip,
                Detalles = a.Detalles,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }
}
