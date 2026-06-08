using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class ScoringService : IScoringService
{
    // Skills weighted by self-reported proficiency. An "Experto" match is worth more
    // than a "Básico" match for the same requisito.
    private static readonly Dictionary<string, decimal> ProficiencyWeight =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["Experto"]    = 1.00m,
            ["Avanzado"]   = 0.85m,
            ["Intermedio"] = 0.65m,
            ["Básico"]     = 0.40m,
            ["Basico"]     = 0.40m,
        };

    public ScoringResult Score(Postulacion postulacion, Vacante vacante, ScoringInput input)
    {
        var detalle = new Dictionary<string, decimal>();

        decimal signal1 = ScoreRequisitos(vacante, input.Skills);
        detalle["requisitos"] = Math.Round(signal1, 2);

        decimal signal2 = ScoreUbicacion(vacante, input.Ubicacion);
        detalle["ubicacion"] = Math.Round(signal2, 2);

        decimal signal3 = ScoreCompleteness(postulacion, input);
        detalle["completeness"] = Math.Round(signal3, 2);

        return new ScoringResult(Math.Round(signal1 + signal2 + signal3, 2), detalle);
    }

    // Signal 1 — Skills match (60 pts max). Uses proficiency-weighted matching:
    // the candidate's strongest skill that overlaps each requisito determines that
    // requisito's contribution. A perfect match across all requisitos at Experto
    // level scores the full 60.
    private static decimal ScoreRequisitos(Vacante vacante, IReadOnlyList<CandidateSkillInput> skills)
    {
        if (vacante.Requisitos == null || vacante.Requisitos.Count == 0)
            return 60m; // vacante isn't gated by skills — give full credit

        if (skills.Count == 0)
            return 30m; // neutral 50% when candidate provided no skills

        var normalized = skills
            .Where(s => !string.IsNullOrWhiteSpace(s.SkillName))
            .Select(s => (Name: s.SkillName.Trim().ToLowerInvariant(),
                          Weight: ProficiencyWeight.TryGetValue(s.ProficiencyLevel ?? "", out var w) ? w : 0.65m))
            .ToList();

        if (normalized.Count == 0) return 30m;

        decimal totalWeight = 0m;
        foreach (var req in vacante.Requisitos)
        {
            var reqLower = req.Nombre.Trim().ToLowerInvariant();
            decimal bestMatch = 0m;
            foreach (var s in normalized)
            {
                if (reqLower.Contains(s.Name) || s.Name.Contains(reqLower))
                    bestMatch = Math.Max(bestMatch, s.Weight);
            }
            totalWeight += bestMatch;
        }

        var score = (totalWeight / vacante.Requisitos.Count) * 60m;
        return Math.Min(score, 60m);
    }

    // Signal 2 — Location match (25 pts max). Remote vacantes treat location as
    // irrelevant (full credit); otherwise we use the partial-match rule.
    private static decimal ScoreUbicacion(Vacante vacante, string? ubicacion)
    {
        if (vacante.TipoContrato?.IndexOf("Remoto", StringComparison.OrdinalIgnoreCase) >= 0)
            return 25m;

        if (string.IsNullOrWhiteSpace(ubicacion))
            return 12.5m;

        var candidate = ubicacion.Trim().ToLowerInvariant();
        var vacanteUb = vacante.Ubicacion.Trim().ToLowerInvariant();

        if (candidate.Equals(vacanteUb)) return 25m;
        if (vacanteUb.Contains(candidate) || candidate.Contains(vacanteUb)) return 25m;
        return 0m;
    }

    // Signal 3 — Completeness (15 pts max). Spreads the budget across the richer
    // application fields the structured modal now collects.
    private static decimal ScoreCompleteness(Postulacion p, ScoringInput input)
    {
        decimal score = 0m;
        if (!string.IsNullOrWhiteSpace(p.Telefono))           score += 3m;
        if (!string.IsNullOrWhiteSpace(p.CvFileName))         score += 3m;
        if (!string.IsNullOrWhiteSpace(p.NombreCandidato) && p.NombreCandidato.Length > 5) score += 2m;
        if (input.Skills.Count >= 2)                          score += 3m;
        if (input.SoftSkillsCount >= 1)                       score += 2m;
        if (input.ImpactStatementLength >= 30)                score += 2m;
        return Math.Min(score, 15m);
    }
}
