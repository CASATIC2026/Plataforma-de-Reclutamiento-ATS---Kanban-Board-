namespace RecruitmentAPI.DTOs;

public class VacanteResponseDTO
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public string TipoContrato { get; set; } = string.Empty;
    public decimal? SalarioMin { get; set; }
    public decimal? SalarioMax { get; set; }
    public bool EstaActiva { get; set; }
    public decimal UmbralPuntaje { get; set; }
    public bool ScreeningActivo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Send back requisitos as simple strings — frontend doesn't need GUIDs of each tag
    public List<string> Requisitos { get; set; } = new();

    // Count of applications for this vacancy (for stats dashboard)
    public int PostulacionesCount { get; set; }

    // Multi-tenant context (informational for clients)
    public Guid? EmpresaId { get; set; }
    public Guid? CreadoPor { get; set; }
}