using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class VacanteService : IVacanteService
{
    private readonly IVacanteRepository _repository;

    public VacanteService(IVacanteRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<VacanteResponseDTO>> GetAllAsync()
    {
        var vacantes = await _repository.GetAllAsync();
        return vacantes.Select(MapToResponseDTO).ToList();
    }

    public async Task<VacanteResponseDTO?> GetByIdAsync(Guid id)
    {
        var vacante = await _repository.GetByIdAsync(id);
        if (vacante == null) return null;
        return MapToResponseDTO(vacante);
    }

    public async Task<VacanteResponseDTO> CreateAsync(CreateVacanteDTO dto)
    {
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
            Requisitos = dto.Requisitos.Select(r => new Requisito
            {
                Nombre = r
            }).ToList()
        };

        var created = await _repository.CreateAsync(vacante);
        return MapToResponseDTO(created);
    }

    public async Task<VacanteResponseDTO?> UpdateAsync(Guid id, UpdateVacanteDTO dto)
    {
        var vacante = await _repository.GetByIdAsync(id);
        if (vacante == null) return null;

        // Only update fields that were actually sent (not null)
        if (dto.Titulo != null) vacante.Titulo = dto.Titulo;
        if (dto.Descripcion != null) vacante.Descripcion = dto.Descripcion;
        if (dto.Ubicacion != null) vacante.Ubicacion = dto.Ubicacion;
        if (dto.TipoContrato != null) vacante.TipoContrato = dto.TipoContrato;
        if (dto.SalarioMin.HasValue) vacante.SalarioMin = dto.SalarioMin;
        if (dto.SalarioMax.HasValue) vacante.SalarioMax = dto.SalarioMax;
        if (dto.EstaActiva.HasValue) vacante.EstaActiva = dto.EstaActiva.Value;
        if (dto.UmbralPuntaje.HasValue) vacante.UmbralPuntaje = dto.UmbralPuntaje.Value;
        if (dto.ScreeningActivo.HasValue) vacante.ScreeningActivo = dto.ScreeningActivo.Value;

        // Handle requisitos replacement
        if (dto.Requisitos != null)
        {
            vacante.Requisitos.Clear();
            vacante.Requisitos = dto.Requisitos.Select(r => new Requisito
            {
                Nombre = r
            }).ToList();
        }

        vacante.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(vacante);
        return MapToResponseDTO(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    // --- Private mapping helper ---
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
            PostulacionesCount = vacante.Postulaciones.Count
        };
    }
}