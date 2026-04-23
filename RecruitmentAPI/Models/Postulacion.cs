namespace RecruitmentAPI.Models;

public enum EstadoPostulacion
{
    Rechazado = -1,
    Nuevo = 0,
    Entrevista = 1,
    PruebaTecnica = 2,
    Oferta = 3
}

public class Postulacion
{
    public Guid Id { get; set; }
    public string NombreCandidato { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string CvFileName { get; set; } = string.Empty;
    public string CvFilePath { get; set; } = string.Empty;
    public EstadoPostulacion Estado { get; set; } = EstadoPostulacion.Nuevo;
    public string? NotasInternas { get; set; }
    public decimal? Puntaje { get; set; }
    public string? PuntajeDetalle { get; set; }
    public bool EmailConfirmacionEnviado { get; set; } = false;
    public bool EmailResultadoEnviado { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to Vacante
    public Guid VacanteId { get; set; }

    // Navigation property
    public Vacante Vacante { get; set; } = null!;
}
