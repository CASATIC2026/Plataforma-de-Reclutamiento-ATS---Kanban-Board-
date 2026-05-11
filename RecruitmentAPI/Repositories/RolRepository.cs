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

        // A user should hold exactly one role per ambito (app_tier OR platform_tier).
        // Remove any prior assignments in the same ambito before adding the new one,
        // otherwise roles accumulate and "change role" silently no-ops.
        var existingInAmbito = await _context.UsuarioRoles
            .Include(ur => ur.Rol)
            .Where(ur => ur.UsuarioId == usuarioId && ur.Rol.Ambito == rol.Ambito)
            .ToListAsync();

        if (existingInAmbito.Count == 1 && existingInAmbito[0].RolId == rol.Id)
            return true; // already exactly this role

        _context.UsuarioRoles.RemoveRange(existingInAmbito);

        _context.UsuarioRoles.Add(new UsuarioRol
        {
            UsuarioId = usuarioId,
            RolId = rol.Id,
            EmpresaId = empresaId,
            AsignadoPor = asignadoPorId,
            AsignadoEn = DateTime.UtcNow
        });

        // Keep the legacy Usuario.Rol enum loosely synced so any code that still reads
        // it (controllers using [Authorize(Roles="...")], user list display) stays consistent.
        var usuario = await _context.Usuarios.FindAsync(usuarioId);
        if (usuario != null)
        {
            usuario.Rol = MapToLegacyEnum(rolNombre, usuario.Rol);
        }

        await _context.SaveChangesAsync();
        return true;
    }

    private static RolUsuario MapToLegacyEnum(string rbacNombre, RolUsuario current) => rbacNombre switch
    {
        "Candidate" => RolUsuario.General,
        "Recruiter" => RolUsuario.Manager,
        "Manager"   => RolUsuario.Manager,
        "Admin" or "Owner" or "Developer" or "DevOps" or "DBA" => RolUsuario.Administrador,
        _ => current
    };

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
