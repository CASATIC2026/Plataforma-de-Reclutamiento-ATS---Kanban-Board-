namespace RecruitmentAPI.Entities;

public class VacancyRequirement
{
    public int Id { get; set; }
    public int VacancyId { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsRequired { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    // Navigation
    public Vacancy Vacancy { get; set; } = null!;
}