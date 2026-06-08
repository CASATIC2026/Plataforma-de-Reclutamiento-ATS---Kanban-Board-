using System.Linq.Expressions;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class VacanteService : IVacanteService
{
    private readonly IVacanteRepository _repository;
    private readonly ICurrentUser _current;

    public VacanteService(IVacanteRepository repository, ICurrentUser current)
    {
        _repository = repository;
        _current = current;
    }

    /// <summary>
    /// Build the tenant predicate from the JWT context. Anonymous callers (no UserId)
    /// get a public read of active vacantes — used by the candidate job board.
    /// </summary>
    private Expression<Func<Vacante, bool>>? BuildScopePredicate(Guid? filterCompanyId)
    {
        // Anonymous public list — only active jobs, all companies
        if (_current.UserId == null) return v => v.EstaActiva;

        if (_current.IsPlatformTier)
            return filterCompanyId.HasValue ? (v => v.EmpresaId == filterCompanyId.Value) : null;

        if (_current.CanSeeAllCompanyJobs)
            return v => v.EmpresaId == _current.CompanyId;

        // Has jobs:create → Recruiter scope (own jobs in own company)
        if (_current.HasPermission("jobs:create"))
            return v => v.EmpresaId == _current.CompanyId && v.CreadoPor == _current.UserId;

        // Candidate or any other non-recruiter authenticated user → public board view
        return v => v.EstaActiva;
    }

    private bool IsInScope(Vacante v)
    {
        if (_current.UserId == null) return v.EstaActiva;
        if (_current.IsPlatformTier) return true;
        if (_current.CanSeeAllCompanyJobs) return v.EmpresaId == _current.CompanyId;
        if (_current.HasPermission("jobs:create"))
            return v.EmpresaId == _current.CompanyId && v.CreadoPor == _current.UserId;
        return v.EstaActiva;
    }

    public async Task<List<VacanteResponseDTO>> GetAllAsync(Guid? filterCompanyId = null)
    {
        var predicate = BuildScopePredicate(filterCompanyId);
        var vacantes = await _repository.GetAllAsync(predicate);
        return vacantes.Select(MapToResponseDTO).ToList();
    }

    public async Task<VacanteResponseDTO?> GetByIdAsync(Guid id)
    {
        var vacante = await _repository.GetByIdAsync(id);
        if (vacante == null) return null;
        if (!IsInScope(vacante)) return null; // 404 over 403 to avoid UUID-existence leak
        return MapToResponseDTO(vacante);
    }

    public async Task<VacanteResponseDTO> CreateAsync(CreateVacanteDTO dto, Guid? targetCompanyId = null)
    {
        // Identity is auto-stamped from the JWT. The DTO has no EmpresaId/CreadoPor
        // properties, so a malicious client cannot inject them.
        Guid? empresaId;
        if (_current.IsPlatformTier)
            empresaId = targetCompanyId ?? _current.CompanyId; // platform admin may target a tenant
        else
            empresaId = _current.CompanyId;

        if (empresaId == null)
            throw new InvalidOperationException("Cannot create vacante without a target company. Platform admin must specify ?companyId=.");

        var vacante = new Vacante
        {
            Titulo = dto.Titulo,
            Descripcion = dto.Descripcion,
            Ubicacion = dto.Ubicacion,
            TipoContrato = dto.TipoContrato,
            SalarioMin = dto.SalarioMin,
            SalarioMax = dto.SalarioMax,
            UmbralPuntaje = dto.UmbralPuntaje ?? 60,
            ScreeningActivo = dto.ScreeningActivo ?? true,
            EmpresaId = empresaId,
            CreadoPor = _current.UserId,
            Requisitos = dto.Requisitos.Select(r => new Requisito { Nombre = r }).ToList()
        };

        var created = await _repository.CreateAsync(vacante);
        return MapToResponseDTO(created);
    }

    public async Task<VacanteResponseDTO?> UpdateAsync(Guid id, UpdateVacanteDTO dto)
    {
        var vacante = await _repository.GetByIdAsync(id);
        if (vacante == null) return null;
        if (!IsInScope(vacante)) return null; // 404 on cross-tenant, prevents existence leak

        if (dto.Titulo != null) vacante.Titulo = dto.Titulo;
        if (dto.Descripcion != null) vacante.Descripcion = dto.Descripcion;
        if (dto.Ubicacion != null) vacante.Ubicacion = dto.Ubicacion;
        if (dto.TipoContrato != null) vacante.TipoContrato = dto.TipoContrato;
        if (dto.SalarioMin.HasValue) vacante.SalarioMin = dto.SalarioMin;
        if (dto.SalarioMax.HasValue) vacante.SalarioMax = dto.SalarioMax;
        if (dto.EstaActiva.HasValue) vacante.EstaActiva = dto.EstaActiva.Value;
        if (dto.UmbralPuntaje.HasValue) vacante.UmbralPuntaje = dto.UmbralPuntaje.Value;
        if (dto.ScreeningActivo.HasValue) vacante.ScreeningActivo = dto.ScreeningActivo.Value;

        if (dto.Requisitos != null)
        {
            vacante.Requisitos.Clear();
            vacante.Requisitos = dto.Requisitos.Select(r => new Requisito { Nombre = r }).ToList();
        }

        vacante.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(vacante);
        return MapToResponseDTO(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var vacante = await _repository.GetByIdAsync(id);
        if (vacante == null) return false;
        if (!IsInScope(vacante)) return false; // controller renders 404
        return await _repository.DeleteAsync(id);
    }

    private static VacanteResponseDTO MapToResponseDTO(Vacante vacante)
    {
        return new VacanteResponseDTO
        {
            Id = vacante.Id,
            Titulo = vacante.Titulo,
            Descripcion = vacante.Descripcion,
            Ubicacion = vacante.Ubicacion,
            TipoContrato = vacante.TipoContrato,
            SalarioMin = vacante.SalarioMin,
            SalarioMax = vacante.SalarioMax,
            EstaActiva = vacante.EstaActiva,
            UmbralPuntaje = vacante.UmbralPuntaje,
            ScreeningActivo = vacante.ScreeningActivo,
            CreatedAt = vacante.CreatedAt,
            UpdatedAt = vacante.UpdatedAt,
            Requisitos = vacante.Requisitos.Select(r => r.Nombre).ToList(),
            PostulacionesCount = vacante.Postulaciones.Count,
            EmpresaId = vacante.EmpresaId,
            CreadoPor = vacante.CreadoPor,
        };
    }
}
