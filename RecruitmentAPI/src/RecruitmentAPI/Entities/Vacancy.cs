using RecruitmentAPI.Enums;

namespace RecruitmentAPI.Entities;

public class Vacancy
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Location { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public ContractType ContractType { get; set; } = ContractType.FullTime;
    public VacancyStatus Status { get; set; } = VacancyStatus.Draft;
    public DateTime? PublishedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public int CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User CreatedBy { get; set; } = null!;
    public ICollection<VacancyRequirement> Requirements { get; set; } = new List<VacancyRequirement>();
    public ICollection<KanbanColumn> KanbanColumns { get; set; } = new List<KanbanColumn>();
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}