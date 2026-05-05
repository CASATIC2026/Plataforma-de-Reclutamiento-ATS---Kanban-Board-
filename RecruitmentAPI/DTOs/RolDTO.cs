namespace RecruitmentAPI.DTOs;

public class RolResponseDTO
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Ambito { get; set; } = string.Empty;
    public bool EsInmutable { get; set; }
    public string[] Permisos { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}

public class CreateRolDTO
{
    public string Nombre { get; set; } = string.Empty;
    public string Ambito { get; set; } = "app_tier";
    public string[] Permisos { get; set; } = [];
}

public class UpdateRolPermisosDTO
{
    public string[] Permisos { get; set; } = [];
}

public class AssignRolDTO
{
    public Guid UsuarioId { get; set; }
    public string RolNombre { get; set; } = string.Empty;
    public Guid? EmpresaId { get; set; }
}
