namespace RecruitmentAPI.Models;

public class CandidateSkill
{
    public Guid Id { get; set; }
    public Guid PostulacionId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string? SkillCategory { get; set; }
    public string ProficiencyLevel { get; set; } = string.Empty; // basic, intermediate, advanced, expert
    public decimal? YearsExperience { get; set; }
    public bool IsVerified { get; set; } = false;
    public string Source { get; set; } = "self_reported";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Postulacion Postulacion { get; set; } = null!;
}
