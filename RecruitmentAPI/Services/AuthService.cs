using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
        // Check if email already exists
        if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
            throw new InvalidOperationException("Ya existe una cuenta con este correo electrónico.");

        // Parse role — public registration is always General
        if (!Enum.TryParse<RolUsuario>(dto.Rol, ignoreCase: true, out var rol))
            rol = RolUsuario.General;
        if (rol != RolUsuario.General)
            rol = RolUsuario.General;

        var usuario = new Usuario
        {
            Nombre = dto.Nombre.Trim(),
            Apellido = dto.Apellido.Trim(),
            Email = dto.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Carrera = dto.Carrera?.Trim(),
            Rol = rol
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return new AuthResponseDTO
        {
            Token = GenerateJwtToken(usuario),
            Nombre = usuario.Nombre,
            Apellido = usuario.Apellido,
            Email = usuario.Email,
            Rol = usuario.Rol.ToString()
        };
    }

    public async Task<AuthResponseDTO?> LoginAsync(LoginDTO dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email.Trim().ToLower());

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
            return null;

        return new AuthResponseDTO
        {
            Token = GenerateJwtToken(usuario),
            Nombre = usuario.Nombre,
            Apellido = usuario.Apellido,
            Email = usuario.Email,
            Rol = usuario.Rol.ToString()
        };
    }

    public async Task<List<UsuarioResponseDTO>> GetAllUsersAsync()
    {
        return await _context.Usuarios
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UsuarioResponseDTO
            {
                Id = u.Id,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Email = u.Email,
                Rol = u.Rol.ToString(),
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

        // Prevent demoting the last Administrador
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

        // Prevent deleting the last Administrador
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

    private string GenerateJwtToken(Usuario usuario)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Name, $"{usuario.Nombre} {usuario.Apellido}"),
            new Claim(ClaimTypes.Role, usuario.Rol.ToString())
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
