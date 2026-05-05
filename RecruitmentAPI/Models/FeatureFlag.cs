namespace RecruitmentAPI.Models;

public class FeatureFlag
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool EstaActivo { get; set; } = false;
    public Guid? ModificadoPor { get; set; }
    public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;
}
