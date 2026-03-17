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
    public string Estado { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
