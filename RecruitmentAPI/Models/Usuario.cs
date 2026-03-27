namespace RecruitmentAPI.Models;

public enum RolUsuario
{
    Estudiante = 0,
    Profesor = 1,
    Administrador = 2,
    Invitado = 3
}

public class Usuario
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Carrera { get; set; }
    public RolUsuario Rol { get; set; } = RolUsuario.Invitado;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
