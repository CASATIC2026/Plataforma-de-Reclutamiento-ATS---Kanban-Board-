using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO dto)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
            throw new InvalidOperationException("Ya existe una cuenta con este correo electrónico.");

        // Accept either an RBAC role name ("Candidate"/"Recruiter"/"Manager") or a
        // legacy enum value. Public registration is restricted to app-tier roles —
        // platform-tier roles (Admin/Owner/etc.) must be assigned by a platform admin.
        var requested = (dto.Rol ?? "Candidate").Trim();
        var allowedPublic = new[] { "Candidate", "Recruiter", "Manager" };
        var rbacRolName = allowedPublic.Contains(requested) ? requested : "Candidate";

        var legacyRol = rbacRolName switch
        {
            "Recruiter" or "Manager" => RolUsuario.Manager,
            _ => RolUsuario.General
        };

        var usuario = new Usuario
        {
            Nombre = dto.Nombre.Trim(),
            Apellido = dto.Apellido.Trim(),
            Email = dto.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Carrera = dto.Carrera?.Trim(),
            Rol = legacyRol
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        // Create the matching RBAC assignment so JWT permissions come from the new
        // system on first login (no legacy fallback for newly-registered users).
        var rbacRol = await _context.Roles.FirstOrDefaultAsync(r => r.Nombre == rbacRolName);
        if (rbacRol != null)
        {
            _context.UsuarioRoles.Add(new UsuarioRol
            {
                UsuarioId = usuario.Id,
                RolId = rbacRol.Id,
                EmpresaId = null,
                AsignadoEn = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        var permissions = await LoadPermissionsAsync(usuario);

        return new AuthResponseDTO
        {
            Token = GenerateJwtToken(usuario, permissions),
            Nombre = usuario.Nombre,
            Apellido = usuario.Apellido,
            Email = usuario.Email,
            Rol = usuario.Rol.ToString(), // legacy enum string — keeps isAdmin/isAdminOrManager checks working
            Permissions = permissions,
            CompanyId = usuario.EmpresaId?.ToString()
        };
    }

    public async Task<AuthResponseDTO?> LoginAsync(LoginDTO dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email.Trim().ToLower());

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
            return null;

        var permissions = await LoadPermissionsAsync(usuario);

        return new AuthResponseDTO
        {
            Token = GenerateJwtToken(usuario, permissions),
            Nombre = usuario.Nombre,
            Apellido = usuario.Apellido,
            Email = usuario.Email,
            Rol = usuario.Rol.ToString(),
            Permissions = permissions,
            CompanyId = usuario.EmpresaId?.ToString()
        };
    }

    public async Task<List<UsuarioResponseDTO>> GetAllUsersAsync()
    {
        // Report the user's current RBAC role (most recently assigned) so the admin
        // listing reflects what AssignRol actually changed. Fall back to the legacy
        // enum string only when no RBAC assignment exists.
        return await _context.Usuarios
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UsuarioResponseDTO
            {
                Id = u.Id,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Email = u.Email,
                Rol = _context.UsuarioRoles
                        .Where(ur => ur.UsuarioId == u.Id)
                        .OrderByDescending(ur => ur.AsignadoEn)
                        .Select(ur => ur.Rol.Nombre)
                        .FirstOrDefault() ?? u.Rol.ToString(),
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<UsuarioResponseDTO?> ChangeRolAsync(Guid userId, string newRol)
    {
        if (!Enum.TryParse<RolUsuario>(newRol, ignoreCase: true, out var rol))
            return null;

        var usuario = await _context.Usuarios.FindAsync(userId);
        if (usuario == null) return null;

        if (usuario.Rol == RolUsuario.Administrador && rol != RolUsuario.Administrador)
        {
            var adminCount = await _context.Usuarios.CountAsync(u => u.Rol == RolUsuario.Administrador);
            if (adminCount <= 1)
                throw new InvalidOperationException("No se puede cambiar el rol del último administrador.");
        }

        usuario.Rol = rol;
        await _context.SaveChangesAsync();

        return new UsuarioResponseDTO
        {
            Id = usuario.Id,
            Nombre = usuario.Nombre,
            Apellido = usuario.Apellido,
            Email = usuario.Email,
            Rol = usuario.Rol.ToString(),
            CreatedAt = usuario.CreatedAt
        };
    }

    public async Task<bool> DeleteUserAsync(Guid userId)
    {
        var usuario = await _context.Usuarios.FindAsync(userId);
        if (usuario == null) return false;

        if (usuario.Rol == RolUsuario.Administrador)
        {
            var adminCount = await _context.Usuarios.CountAsync(u => u.Rol == RolUsuario.Administrador);
            if (adminCount <= 1)
                throw new InvalidOperationException("No se puede eliminar al último administrador.");
        }

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();
        return true;
    }

    // Load permissions from new RBAC tables; fall back to legacy role-based mapping
    private async Task<string[]> LoadPermissionsAsync(Usuario usuario)
    {
        var dbPerms = await _context.UsuarioRoles
            .Where(ur => ur.UsuarioId == usuario.Id)
            .Include(ur => ur.Rol).ThenInclude(r => r.RolPermisos).ThenInclude(rp => rp.Permiso)
            .SelectMany(ur => ur.Rol.RolPermisos.Select(rp => rp.Permiso.Nombre))
            .Distinct()
            .ToListAsync();

        if (dbPerms.Count > 0)
            return dbPerms.ToArray();

        // Legacy fallback derived from the enum role
        return GetLegacyPermissions(usuario.Rol);
    }

    private static string[] GetLegacyPermissions(RolUsuario rol) => rol switch
    {
        RolUsuario.Administrador => new[]
        {
            "jobs:read", "jobs:create", "jobs:update", "jobs:delete", "jobs:approve", "jobs:publish", "jobs:read_all",
            "applications:create", "applications:read_own", "applications:read", "applications:read_all",
            "applications:update_status", "applications:add_note", "profile:update_own",
            "users:read", "users:update", "users:disable", "users:assign_role",
            "companies:create", "companies:read", "companies:update", "companies:transfer",
            "reports:read", "roles:read", "roles:create", "roles:update", "roles:assign_admin",
            "audit:read", "audit:export",
            "platform:access", "platform:configure", "billing:read",
            "deployment:trigger", "deployment:read_logs", "deployment:rollback",
            "infra:read_metrics", "infra:configure", "pipeline:trigger",
            "logs:read", "features:toggle", "db:read_logs"
        },
        RolUsuario.Manager => new[]
        {
            "jobs:read", "jobs:create", "jobs:update", "jobs:delete", "jobs:approve", "jobs:publish", "jobs:read_all",
            "applications:create", "applications:read_own", "applications:read", "applications:read_all",
            "applications:update_status", "applications:add_note", "profile:update_own",
            "reports:read", "users:read", "companies:read", "platform:access"
        },
        _ => new[]
        {
            "jobs:read", "applications:create", "applications:read_own", "profile:update_own"
        }
    };

    private string GenerateJwtToken(Usuario usuario, string[] permissions)
    {
        var jwtKey = _config["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key configuration is missing");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new(ClaimTypes.Email, usuario.Email),
            new(ClaimTypes.Name, $"{usuario.Nombre} {usuario.Apellido}"),
            new(ClaimTypes.Role, usuario.Rol.ToString()),
            new("permissions", JsonSerializer.Serialize(permissions)),
            new("company_id", usuario.EmpresaId?.ToString() ?? "")
        };

        var expireMinutes = int.Parse(_config["Jwt:ExpireMinutes"] ?? "480");

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expireMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
