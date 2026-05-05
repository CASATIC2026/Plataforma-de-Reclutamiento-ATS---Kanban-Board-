using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/platform")]
[Authorize(Roles = "Administrador")]
public class PlatformController : ControllerBase
{
    private readonly AppDbContext _context;

    public PlatformController(AppDbContext context) => _context = context;

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
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
