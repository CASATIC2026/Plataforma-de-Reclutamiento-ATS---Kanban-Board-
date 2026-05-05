namespace RecruitmentAPI.DTOs;

public class EmpresaResponseDTO
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Dominio { get; set; }
    public string Estado { get; set; } = string.Empty;
    public int UsuariosCount { get; set; }
    public int VacantesCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateEmpresaDTO
{
    public string Nombre { get; set; } = string.Empty;
    public string? Dominio { get; set; }
}
