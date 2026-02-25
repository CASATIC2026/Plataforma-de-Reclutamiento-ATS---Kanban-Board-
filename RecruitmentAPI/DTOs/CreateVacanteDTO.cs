namespace RecruitmentAPI.DTOs;

public class CreateVacanteDTO
{
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public string TipoContrato { get; set; } = string.Empty;
    public decimal? SalarioMin { get; set; }
    public decimal? SalarioMax { get; set; }

    // The recruiter sends requirements as a simple list of strings
    public List<string> Requisitos { get; set; } = new();
}