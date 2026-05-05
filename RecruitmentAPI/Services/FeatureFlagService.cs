using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class FeatureFlagService : IFeatureFlagService
{
    private readonly AppDbContext _context;

    public FeatureFlagService(AppDbContext context) => _context = context;

    public async Task<List<FeatureFlagResponseDTO>> GetAllAsync()
    {
        return await _context.FeatureFlags
            .OrderBy(f => f.Nombre)
            .Select(f => new FeatureFlagResponseDTO
            {
                Id = f.Id,
                Nombre = f.Nombre,
                Descripcion = f.Descripcion,
                EstaActivo = f.EstaActivo,
                ModificadoPorEmail = f.ModificadoPor.HasValue
                    ? _context.Usuarios
                        .Where(u => u.Id == f.ModificadoPor)
                        .Select(u => u.Email)
                        .FirstOrDefault()
                    : null,
                ModifiedAt = f.ModifiedAt
            })
            .ToListAsync();
    }

    public async Task<FeatureFlagResponseDTO?> ToggleAsync(Guid id, Guid? usuarioId)
    {
        var flag = await _context.FeatureFlags.FindAsync(id);
        if (flag == null) return null;

        flag.EstaActivo = !flag.EstaActivo;
        flag.ModificadoPor = usuarioId;
        flag.ModifiedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return new FeatureFlagResponseDTO
        {
            Id = flag.Id,
            Nombre = flag.Nombre,
            Descripcion = flag.Descripcion,
            EstaActivo = flag.EstaActivo,
            ModifiedAt = flag.ModifiedAt
        };
    }
}
