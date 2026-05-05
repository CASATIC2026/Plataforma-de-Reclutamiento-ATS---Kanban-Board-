namespace RecruitmentAPI.Models;

public enum RolUsuario
{
    General = 0,
    Manager = 1,
    Administrador = 2
}

public class Usuario
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Carrera { get; set; }
    public RolUsuario Rol { get; set; } = RolUsuario.General;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // RBAC
    public Guid? EmpresaId { get; set; }
    public Empresa? Empresa { get; set; }
    public ICollection<UsuarioRol> UsuarioRoles { get; set; } = new List<UsuarioRol>();
}
