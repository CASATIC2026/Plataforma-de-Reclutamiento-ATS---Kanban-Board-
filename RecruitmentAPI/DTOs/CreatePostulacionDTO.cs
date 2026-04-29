namespace RecruitmentAPI.DTOs;
using System.ComponentModel.DataAnnotations;

public class CreatePostulacionDTO
{
    [Required, MaxLength(200)]
    public string NombreCandidato { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20), RegularExpression(@"^[\d\s\+\-\(\)]{7,20}$|^$")]
    public string Telefono { get; set; } = string.Empty;

    [Required]
    public Guid VacanteId { get; set; }

    // CV file — optional, sent as multipart/form-data
    public IFormFile? CvFile { get; set; }

    // Optional scoring hints
    [MaxLength(200)]
    public string? Ubicacion { get; set; }

    [MaxLength(200)]
    public string? Carrera { get; set; }
}
