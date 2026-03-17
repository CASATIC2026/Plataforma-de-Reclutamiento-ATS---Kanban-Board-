namespace RecruitmentAPI.Models;

public class Postulacion
{
    public Guid Id { get; set; }
    public string NombreCandidato { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string CvFileName { get; set; } = string.Empty;
    public string CvFilePath { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Estado { get; set; } = "Nuevo";

    // Foreign key to Vacante
    public Guid VacanteId { get; set; }

    // Navigation property
    public Vacante Vacante { get; set; } = null!;
}