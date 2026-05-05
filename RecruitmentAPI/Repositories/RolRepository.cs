using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;

namespace RecruitmentAPI.Repositories;

public class RolRepository : IRolRepository
{
    private readonly AppDbContext _context;

    public RolRepository(AppDbContext context) => _context = context;

    public async Task<List<RolResponseDTO>> GetAllWithPermisosAsync()
    {
        return await _context.Roles
            .Include(r => r.RolPermisos).ThenInclude(rp => rp.Permiso)
            .OrderBy(r => r.Ambito).ThenBy(r => r.Nombre)
            .Select(r => new RolResponseDTO
            {
                Id = r.Id,
                Nombre = r.Nombre,
                Ambito = r.Ambito,
                EsInmutable = r.EsInmutable,
                Permisos = r.RolPermisos.Select(rp => rp.Permiso.Nombre).ToArray(),
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<Rol?> GetByNombreAsync(string nombre)
    {
        return await _context.Roles
            .Include(r => r.RolPermisos).ThenInclude(rp => rp.Permiso)
            .FirstOrDefaultAsync(r => r.Nombre == nombre);
    }

    public async Task<Rol> CreateAsync(Rol rol, string[] permisoNombres)
    {
        _context.Roles.Add(rol);
        await _context.SaveChangesAsync();

        await LinkPermisosAsync(rol.Id, permisoNombres);
        return rol;
    }

    public async Task<bool> UpdatePermisosAsync(Guid rolId, string[] permisoNombres)
    {
        var rol = await _context.Roles.Include(r => r.RolPermisos).FirstOrDefaultAsync(r => r.Id == rolId);
        if (rol == null || rol.EsInmutable) return false;

        // Clear existing
        _context.RolPermisos.RemoveRange(rol.RolPermisos);
        await _context.SaveChangesAsync();

        await LinkPermisosAsync(rolId, permisoNombres);
        return true;
    }

    public async Task<bool> AssignRolToUsuarioAsync(Guid usuarioId, string rolNombre, Guid? empresaId, Guid? asignadoPorId)
    {
        var rol = await _context.Roles.FirstOrDefaultAsync(r => r.Nombre == rolNombre);
        if (rol == null) return false;

        var existing = await _context.UsuarioRoles
            .FirstOrDefaultAsync(ur => ur.UsuarioId == usuarioId && ur.RolId == rol.Id && ur.EmpresaId == empresaId);

        if (existing != null) return true; // already assigned

        _context.UsuarioRoles.Add(new UsuarioRol
        {
            UsuarioId = usuarioId,
            RolId = rol.Id,
            EmpresaId = empresaId,
            AsignadoPor = asignadoPorId,
            AsignadoEn = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<string>> GetPermisosForUsuarioAsync(Guid usuarioId)
    {
        return await _context.UsuarioRoles
            .Where(ur => ur.UsuarioId == usuarioId)
            .Include(ur => ur.Rol).ThenInclude(r => r.RolPermisos).ThenInclude(rp => rp.Permiso)
            .SelectMany(ur => ur.Rol.RolPermisos.Select(rp => rp.Permiso.Nombre))
            .Distinct()
            .ToListAsync();
    }

    private async Task LinkPermisosAsync(Guid rolId, string[] permisoNombres)
    {
        var permisos = await _context.Permisos
            .Where(p => permisoNombres.Contains(p.Nombre))
            .ToListAsync();

        foreach (var permiso in permisos)
        {
            _context.RolPermisos.Add(new RolPermiso { RolId = rolId, PermisoId = permiso.Id });
        }
        await _context.SaveChangesAsync();
    }
}
