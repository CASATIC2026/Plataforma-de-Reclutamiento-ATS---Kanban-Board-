namespace RecruitmentAPI.Models;

public class DeploymentLog
{
    public Guid Id { get; set; }
    public string Version { get; set; } = string.Empty;
    public Guid? DisparadoPor { get; set; }
    public Usuario? DisparadoPorUsuario { get; set; }
    public string Estado { get; set; } = "Running"; // Success | Failed | Running | RolledBack
    public int? DuracionSegundos { get; set; }
    public string? Notas { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
