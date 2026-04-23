namespace RecruitmentAPI.Models;

public class Requisito
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to Vacante
    public Guid VacanteId { get; set; }

    // Navigation property — this requisito belongs to ONE vacante
    public Vacante Vacante { get; set; } = null!;
}