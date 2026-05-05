using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _context;

    public AnalyticsService(AppDbContext context) => _context = context;

    public async Task<AnalyticsPipelineDTO> GetPipelineFunnelAsync(Guid? empresaId = null)
    {
        var query = _context.Postulaciones.AsQueryable();
        if (empresaId.HasValue)
            query = query.Where(p => p.Vacante.EmpresaId == empresaId);

        var total = await query.CountAsync();
        var counts = await query
            .GroupBy(p => p.Estado)
            .Select(g => new { Estado = g.Key, Count = g.Count() })
            .ToListAsync();

        var stages = new[]
        {
            EstadoPostulacion.Nuevo,
            EstadoPostulacion.Entrevista,
            EstadoPostulacion.PruebaTecnica,
            EstadoPostulacion.Oferta
        };

        var stageNames = new Dictionary<EstadoPostulacion, string>
        {
            [EstadoPostulacion.Nuevo] = "Aplicaciones",
            [EstadoPostulacion.Entrevista] = "Entrevista",
            [EstadoPostulacion.PruebaTecnica] = "Prueba Técnica",
            [EstadoPostulacion.Oferta] = "Oferta"
        };

        var result = stages.Select(stage =>
        {
            var count = counts.FirstOrDefault(c => c.Estado == stage)?.Count ?? 0;
            return new PipelineStageDTO
            {
                Nombre = stageNames[stage],
                Count = count,
                Porcentaje = total > 0 ? Math.Round((double)count / total * 100, 1) : 0
            };
        }).ToList();

        return new AnalyticsPipelineDTO { Stages = result };
    }

    public async Task<AnalyticsTimeToHireDTO> GetTimeToHireAsync(Guid? empresaId = null)
    {
        var query = _context.Postulaciones
            .Include(p => p.Vacante)
            .Where(p => p.Estado == EstadoPostulacion.Oferta);

        if (empresaId.HasValue)
            query = query.Where(p => p.Vacante.EmpresaId == empresaId);

        var hired = await query.ToListAsync();

        var byUbicacion = hired
            .GroupBy(p => p.Vacante.Ubicacion)
            .Select(g => new TimeToHireItemDTO
            {
                Ubicacion = g.Key,
                PromedioDias = g.Average(p => (p.UpdatedAt - p.CreatedAt).TotalDays),
                TotalContratados = g.Count()
            })
            .OrderByDescending(x => x.TotalContratados)
            .ToList();

        var promedioGlobal = hired.Count > 0
            ? hired.Average(p => (p.UpdatedAt - p.CreatedAt).TotalDays)
            : 0;

        return new AnalyticsTimeToHireDTO
        {
            Items = byUbicacion,
            PromedioGlobal = Math.Round(promedioGlobal, 1)
        };
    }

    public async Task<AnalyticsSourceDTO> GetSourceStatsAsync(Guid? empresaId = null)
    {
        var query = _context.Vacantes
            .Include(v => v.Postulaciones)
            .Where(v => v.EstaActiva);

        if (empresaId.HasValue)
            query = query.Where(v => v.EmpresaId == empresaId);

        var vacantes = await query.ToListAsync();

        var items = vacantes
            .OrderByDescending(v => v.Postulaciones.Count)
            .Take(20)
            .Select(v =>
            {
                var total = v.Postulaciones.Count;
                var hired = v.Postulaciones.Count(p => p.Estado == EstadoPostulacion.Oferta);
                return new SourceStatsItemDTO
                {
                    VacanteId = v.Id,
                    VacanteTitulo = v.Titulo,
                    Ubicacion = v.Ubicacion,
                    TotalPostulaciones = total,
                    Contratados = hired,
                    TasaConversion = total > 0 ? Math.Round((double)hired / total * 100, 1) : 0
                };
            })
            .ToList();

        return new AnalyticsSourceDTO { Items = items };
    }

    public async Task<AnalyticsTeamDTO> GetTeamActivityAsync(Guid? empresaId = null)
    {
        var query = _context.Vacantes
            .Include(v => v.Postulaciones)
            .Include(v => v.CreadoPorUsuario)
            .Where(v => v.CreadoPor != null);

        if (empresaId.HasValue)
            query = query.Where(v => v.EmpresaId == empresaId);

        var vacantes = await query.ToListAsync();

        var items = vacantes
            .GroupBy(v => v.CreadoPor!.Value)
            .Select(g =>
            {
                var recruiter = g.First().CreadoPorUsuario!;
                return new TeamActivityItemDTO
                {
                    UsuarioId = recruiter.Id,
                    RecruiterNombre = $"{recruiter.Nombre} {recruiter.Apellido}",
                    RecruiterEmail = recruiter.Email,
                    VacantesPublicadas = g.Count(),
                    PostulacionesRecibidas = g.Sum(v => v.Postulaciones.Count),
                    Contratados = g.Sum(v => v.Postulaciones.Count(p => p.Estado == EstadoPostulacion.Oferta))
                };
            })
            .OrderByDescending(x => x.PostulacionesRecibidas)
            .ToList();

        return new AnalyticsTeamDTO { Items = items };
    }
}
