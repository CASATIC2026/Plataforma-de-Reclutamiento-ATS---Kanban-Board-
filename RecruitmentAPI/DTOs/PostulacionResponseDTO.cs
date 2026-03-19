using RecruitmentAPI.Models;

namespace RecruitmentAPI.DTOs;

public class PostulacionResponseDTO
{
    public Guid Id { get; set; }
    public string NombreCandidato { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string CvFileName { get; set; } = string.Empty;
    public Guid VacanteId { get; set; }
    public string VacanteTitulo { get; set; } = string.Empty;
    public EstadoPostulacion Estado { get; set; }
    public string? NotasInternas { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
