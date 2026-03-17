namespace RecruitmentAPI.DTOs;

public class CreatePostulacionDTO
{
    public string NombreCandidato { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public Guid VacanteId { get; set; }

    // CV file — optional, sent as multipart/form-data
    public IFormFile? CvFile { get; set; }
}
