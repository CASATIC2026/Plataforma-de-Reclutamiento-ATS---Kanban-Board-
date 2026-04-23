using RecruitmentAPI.Models;

namespace RecruitmentAPI.Services.Interfaces;

public interface IScoringService
{
    ScoringResult Score(Postulacion postulacion, Vacante vacante, string? carrera, string? ubicacion);
}

public record ScoringResult(decimal Puntaje, Dictionary<string, decimal> Detalle);
