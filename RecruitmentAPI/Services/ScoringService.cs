using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class ScoringService : IScoringService
{
    public ScoringResult Score(Postulacion postulacion, Vacante vacante, string? carrera, string? ubicacion)
    {
        var detalle = new Dictionary<string, decimal>();

        // Signal 1 — Requisitos match (weight 60%)
        decimal signal1 = ScoreRequisitos(vacante, carrera);
        detalle["requisitos"] = signal1;

        // Signal 2 — Ubicacion match (weight 25%)
        decimal signal2 = ScoreUbicacion(vacante, ubicacion);
        detalle["ubicacion"] = signal2;

        // Signal 3 — Completeness (weight 15%)
        decimal signal3 = ScoreCompleteness(postulacion);
        detalle["completeness"] = signal3;

        // Total puntaje (range 0–100)
        decimal puntaje = signal1 + signal2 + signal3;

        return new ScoringResult(puntaje, detalle);
    }

    private decimal ScoreRequisitos(Vacante vacante, string? carrera)
    {
        // Weight: 60%
        // If carrera is null/empty → neutral: 30 points (half credit)
        // If vacancy has no requisitos: full 60 points (vacante is not filtered by skill)
        // Otherwise: (matched count / total requisitos) * 60
        // Carrera can be comma-separated skills: "React, TypeScript, Git"

        if (string.IsNullOrWhiteSpace(carrera))
            return 30m; // Neutral 50% of 60

        if (vacante.Requisitos == null || vacante.Requisitos.Count == 0)
            return 60m; // Full credit if no requisitos

        // Split carrera by comma and trim whitespace
        var skills = carrera.Split(',')
            .Select(s => s.Trim().ToLower())
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList();

        if (skills.Count == 0)
            return 30m; // Neutral if no valid skills provided

        // Count matched requisitos
        var matchedCount = vacante.Requisitos.Count(r =>
        {
            var reqLower = r.Nombre.ToLower();
            return skills.Any(skill =>
                reqLower.Contains(skill) ||
                skill.Contains(reqLower)
            );
        });

        decimal score = ((decimal)matchedCount / vacante.Requisitos.Count) * 60m;
        return Math.Min(score, 60m);
    }

    private decimal ScoreUbicacion(Vacante vacante, string? ubicacion)
    {
        // Weight: 25%
        // If candidate ubicacion is null/empty: 12.5 (neutral 50%)
        // If matches vacancy.Ubicacion (exact or partial): 25
        // Partial match: "San Salvador" matches "San Salvador, El Salvador"

        if (string.IsNullOrWhiteSpace(ubicacion))
            return 12.5m; // Neutral 50% of 25

        var candidateUbicacion = ubicacion.Trim().ToLower();
        var vacanteUbicacion = vacante.Ubicacion.Trim().ToLower();

        // Exact match
        if (candidateUbicacion.Equals(vacanteUbicacion))
            return 25m;

        // Partial match: one location is contained in the other
        // "San Salvador" matches "San Salvador, El Salvador"
        if (vacanteUbicacion.Contains(candidateUbicacion) || candidateUbicacion.Contains(vacanteUbicacion))
            return 25m;

        return 0m;
    }

    private decimal ScoreCompleteness(Postulacion postulacion)
    {
        // Weight: 15%
        // phone provided: 5 pts
        // CV attached (always true — cvFileName not empty): 5 pts
        // name length > 5: 5 pts
        // total = sum of above

        decimal score = 0m;

        if (!string.IsNullOrWhiteSpace(postulacion.Telefono))
            score += 5m;

        if (!string.IsNullOrWhiteSpace(postulacion.CvFileName))
            score += 5m;

        if (!string.IsNullOrWhiteSpace(postulacion.NombreCandidato) && postulacion.NombreCandidato.Length > 5)
            score += 5m;

        return Math.Min(score, 15m);
    }
}
