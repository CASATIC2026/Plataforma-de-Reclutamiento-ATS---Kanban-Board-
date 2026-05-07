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

    // Structured application data
    public string? ImpactStatement { get; set; }
    public string? SoftSkills { get; set; } // JSON array
    public string? ApplicationSource { get; set; } = "direct";
    public int? CompletionTimeSeconds { get; set; }

    // Legal/consent fields
    public bool ConsentGdpr { get; set; } = false;
    public bool ConsentMarketing { get; set; } = false;
    public bool AttestedTruth { get; set; } = false;
    public string? AttestedSignature { get; set; }

    // Foreign key to Vacante
    public Guid VacanteId { get; set; }

    // Navigation properties
    public Vacante Vacante { get; set; } = null!;

    // Optional link to authenticated user who applied
    public Guid? UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    // Structured application relationships
    public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
    public ICollection<CandidateAvailability> Availabilities { get; set; } = new List<CandidateAvailability>();
    public ICollection<CandidateScreeningResponse> ScreeningResponses { get; set; } = new List<CandidateScreeningResponse>();
}
