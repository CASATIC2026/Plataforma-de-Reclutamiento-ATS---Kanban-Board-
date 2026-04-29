namespace RecruitmentAPI.DTOs;
using System.ComponentModel.DataAnnotations;

public class CreateVacanteDTO
{
    [Required, MaxLength(200)]
    public string Titulo { get; set; } = string.Empty;

    [Required, MaxLength(5000)]
    public string Descripcion { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Ubicacion { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string TipoContrato { get; set; } = string.Empty;

    [Range(0, 999999)]
    public decimal? SalarioMin { get; set; }

    [Range(0, 999999)]
    public decimal? SalarioMax { get; set; }

    // The recruiter sends requirements as a simple list of strings
    [MaxLength(10)]
    public List<string> Requisitos { get; set; } = new();

    // Screening configuration
    [Range(0, 100)]
    public decimal? UmbralPuntaje { get; set; }

    public bool? ScreeningActivo { get; set; }
}