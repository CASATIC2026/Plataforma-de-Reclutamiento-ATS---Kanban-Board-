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
<<<<<<< HEAD
    public EstadoPostulacion Estado { get; set; }
=======
<<<<<<< HEAD
    public string Estado { get; set; } = string.Empty;
=======
>>>>>>> 0145ebc5970147f9474b6bd257190a89db667477
>>>>>>> 4db2853345a21fdb3ae6ce6d64588c52dee8d11f
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
