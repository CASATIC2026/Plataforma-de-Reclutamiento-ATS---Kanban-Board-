namespace RecruitmentAPI.Models;

public enum EstadoPostulacion
{
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
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
<<<<<<< HEAD
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
=======
    public string Estado { get; set; } = "Nuevo";
>>>>>>> 4db2853345a21fdb3ae6ce6d64588c52dee8d11f

    // Foreign key to Vacante
    public Guid VacanteId { get; set; }

    // Navigation property
    public Vacante Vacante { get; set; } = null!;
}