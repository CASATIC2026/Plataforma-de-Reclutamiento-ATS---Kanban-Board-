namespace RecruitmentAPI.Models;

public class Permiso
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string? Categoria { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();
}
