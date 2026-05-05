namespace RecruitmentAPI.DTOs;

public class DeploymentLogResponseDTO
{
    public Guid Id { get; set; }
    public string Version { get; set; } = string.Empty;
    public string? DisparadoPorEmail { get; set; }
    public string Estado { get; set; } = string.Empty;
    public int? DuracionSegundos { get; set; }
    public string? Notas { get; set; }
    public DateTime CreatedAt { get; set; }
}
