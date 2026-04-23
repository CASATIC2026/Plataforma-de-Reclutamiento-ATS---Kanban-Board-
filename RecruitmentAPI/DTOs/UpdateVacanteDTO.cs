namespace RecruitmentAPI.DTOs;

public class UpdateVacanteDTO
{
    public string? Titulo { get; set; }
    public string? Descripcion { get; set; }
    public string? Ubicacion { get; set; }
    public string? TipoContrato { get; set; }
    public decimal? SalarioMin { get; set; }
    public decimal? SalarioMax { get; set; }
    public bool? EstaActiva { get; set; }

    // null = don't touch requisitos. Empty list = clear them. List with items = replace them.
    public List<string>? Requisitos { get; set; }

    // Screening configuration
    public decimal? UmbralPuntaje { get; set; }
    public bool? ScreeningActivo { get; set; }
}