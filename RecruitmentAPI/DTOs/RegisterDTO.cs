using System.ComponentModel.DataAnnotations;

namespace RecruitmentAPI.DTOs;

public class RegisterDTO
{
    [Required, MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Apellido { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Carrera { get; set; }

    [Required]
    public string Rol { get; set; } = "General";
}
