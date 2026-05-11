using RecruitmentAPI.Models;

namespace RecruitmentAPI.Services.Interfaces;

/// <summary>
/// Inputs the scoring algorithm needs that don't live on the Postulacion row directly.
/// Built by the caller (PostulacionService) from the apply-form DTO before scoring runs.
/// </summary>
public record ScoringInput(
    IReadOnlyList<CandidateSkillInput> Skills,
    string? Ubicacion,
    int SoftSkillsCount,
    int ImpactStatementLength
);

public record CandidateSkillInput(string SkillName, string? ProficiencyLevel);

public interface IScoringService
{
    ScoringResult Score(Postulacion postulacion, Vacante vacante, ScoringInput input);
}

public record ScoringResult(decimal Puntaje, Dictionary<string, decimal> Detalle);
