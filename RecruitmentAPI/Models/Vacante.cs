namespace RecruitmentAPI.Models;

public class Vacante
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public string TipoContrato { get; set; } = string.Empty;
    public decimal? SalarioMin { get; set; }
    public decimal? SalarioMax { get; set; }
    public bool EstaActiva { get; set; } = true;
    public decimal UmbralPuntaje { get; set; } = 60;
    public bool ScreeningActivo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property — one vacante has MANY requisitos
    public List<Requisito> Requisitos { get; set; } = new();

    // Navigation property — one vacante has MANY postulaciones
    public List<Postulacion> Postulaciones { get; set; } = new();
}
