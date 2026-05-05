namespace RecruitmentAPI.Models;

public class Empresa
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Dominio { get; set; }
    public string Estado { get; set; } = "activa";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    public ICollection<Vacante> Vacantes { get; set; } = new List<Vacante>();
    public ICollection<UsuarioRol> UsuarioRoles { get; set; } = new List<UsuarioRol>();
}
