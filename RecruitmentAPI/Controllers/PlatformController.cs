using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/platform")]
[Authorize]
public class PlatformController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _current;

    public PlatformController(AppDbContext context, ICurrentUser current)
    {
        _context = context;
        _current = current;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        // Cross-tenant overview is platform-admin territory; Manager has platform:access
        // for read-only company info but should not see global counts.
        if (!_current.IsPlatformTier) return Forbid();
        var totalEmpresas = await _context.Empresas.CountAsync(e => e.Estado == "activa");
        var totalUsuarios = await _context.Usuarios.CountAsync();
        var totalVacantes = await _context.Vacantes.CountAsync();
        var totalPostulaciones = await _context.Postulaciones.CountAsync();

        var recentEmpresas = await _context.Empresas
            .OrderByDescending(e => e.CreatedAt)
            .Take(5)
            .Select(e => new EmpresaResponseDTO
            {
                Id = e.Id,
                Nombre = e.Nombre,
                Dominio = e.Dominio,
                Estado = e.Estado,
                UsuariosCount = e.Usuarios.Count,
                VacantesCount = e.Vacantes.Count,
                CreatedAt = e.CreatedAt
            })
            .ToListAsync();

        bool dbOk;
        try { await _context.Database.ExecuteSqlRawAsync("SELECT 1"); dbOk = true; }
        catch { dbOk = false; }

        return Ok(new PlatformOverviewDTO
        {
            TotalEmpresas = totalEmpresas,
            TotalUsuarios = totalUsuarios,
            TotalVacantes = totalVacantes,
            TotalPostulaciones = totalPostulaciones,
            SistemaOk = dbOk,
            RecentEmpresas = recentEmpresas
        });
    }
}
