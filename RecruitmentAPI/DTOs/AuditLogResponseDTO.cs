namespace RecruitmentAPI.DTOs;

public class AuditLogResponseDTO
{
    public Guid Id { get; set; }
    public string? UsuarioEmail { get; set; }
    public string Accion { get; set; } = string.Empty;
    public string? Recurso { get; set; }
    public string Resultado { get; set; } = string.Empty;
    public string? Ip { get; set; }
    public string? Detalles { get; set; }
    public DateTime CreatedAt { get; set; }
}
