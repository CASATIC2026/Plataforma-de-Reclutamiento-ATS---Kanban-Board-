namespace RecruitmentAPI.Models;

public class AuditLog
{
    public Guid Id { get; set; }
    public Guid? UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
    public string Accion { get; set; } = string.Empty;
    public string? Recurso { get; set; }
    public string Resultado { get; set; } = "Allowed"; // Allowed | Denied
    public string? Ip { get; set; }
    public string? Detalles { get; set; } // JSON blob
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
