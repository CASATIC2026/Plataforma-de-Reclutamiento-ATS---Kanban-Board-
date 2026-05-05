using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class DeploymentService : IDeploymentService
{
    private readonly AppDbContext _context;

    public DeploymentService(AppDbContext context) => _context = context;

    public async Task<List<DeploymentLogResponseDTO>> GetHistoryAsync()
    {
        return await _context.DeploymentLogs
            .Include(d => d.DisparadoPorUsuario)
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new DeploymentLogResponseDTO
            {
                Id = d.Id,
                Version = d.Version,
                DisparadoPorEmail = d.DisparadoPorUsuario != null ? d.DisparadoPorUsuario.Email : null,
                Estado = d.Estado,
                DuracionSegundos = d.DuracionSegundos,
                Notas = d.Notas,
                CreatedAt = d.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<DeploymentLogResponseDTO> TriggerAsync(Guid? usuarioId)
    {
        var lastVersion = await _context.DeploymentLogs
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => d.Version)
            .FirstOrDefaultAsync() ?? "1.0.0";

        var parts = lastVersion.Split('.');
        var patch = int.TryParse(parts.LastOrDefault(), out var p) ? p + 1 : 1;
        var newVersion = parts.Length >= 3
            ? $"{parts[0]}.{parts[1]}.{patch}"
            : $"1.0.{patch}";

        var log = new DeploymentLog
        {
            Version = newVersion,
            DisparadoPor = usuarioId,
            Estado = "Running",
            CreatedAt = DateTime.UtcNow
        };

        _context.DeploymentLogs.Add(log);
        await _context.SaveChangesAsync();

        // Simulate completion after a brief moment
        log.Estado = "Success";
        log.DuracionSegundos = new Random().Next(20, 120);
        await _context.SaveChangesAsync();

        return new DeploymentLogResponseDTO
        {
            Id = log.Id,
            Version = log.Version,
            Estado = log.Estado,
            DuracionSegundos = log.DuracionSegundos,
            CreatedAt = log.CreatedAt
        };
    }

    public async Task<DeploymentLogResponseDTO?> RollbackAsync(Guid deploymentId, Guid? usuarioId)
    {
        var original = await _context.DeploymentLogs.FindAsync(deploymentId);
        if (original == null) return null;

        var rollbackLog = new DeploymentLog
        {
            Version = original.Version,
            DisparadoPor = usuarioId,
            Estado = "RolledBack",
            Notas = $"Rollback de versión {original.Version}",
            DuracionSegundos = new Random().Next(10, 60),
            CreatedAt = DateTime.UtcNow
        };

        _context.DeploymentLogs.Add(rollbackLog);
        await _context.SaveChangesAsync();

        return new DeploymentLogResponseDTO
        {
            Id = rollbackLog.Id,
            Version = rollbackLog.Version,
            Estado = rollbackLog.Estado,
            Notas = rollbackLog.Notas,
            DuracionSegundos = rollbackLog.DuracionSegundos,
            CreatedAt = rollbackLog.CreatedAt
        };
    }
}
