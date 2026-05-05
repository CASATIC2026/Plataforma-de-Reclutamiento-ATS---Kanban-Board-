namespace RecruitmentAPI.DTOs;

public class FeatureFlagResponseDTO
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool EstaActivo { get; set; }
    public string? ModificadoPorEmail { get; set; }
    public DateTime ModifiedAt { get; set; }
}
