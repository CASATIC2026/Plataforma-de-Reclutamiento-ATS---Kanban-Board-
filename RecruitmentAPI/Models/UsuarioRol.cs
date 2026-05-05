namespace RecruitmentAPI.Models;

public class UsuarioRol
{
    public Guid Id { get; set; }

    public Guid UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public Guid RolId { get; set; }
    public Rol Rol { get; set; } = null!;

    public Guid? EmpresaId { get; set; }
    public Empresa? Empresa { get; set; }

    public Guid? AsignadoPor { get; set; }
    public DateTime AsignadoEn { get; set; } = DateTime.UtcNow;
}
