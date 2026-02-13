namespace RecruitmentAPI.Entities;

public class Application
{
    public int Id { get; set; }
    public int VacancyId { get; set; }
    public int CandidateId { get; set; }
    public int KanbanColumnId { get; set; }
    public int SortOrderInColumn { get; set; } = 0;
    public string CvFileName { get; set; } = string.Empty;
    public string CvFilePath { get; set; } = string.Empty;
    public string? CvTextContent { get; set; }
    public string? CoverLetter { get; set; }
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Vacancy Vacancy { get; set; } = null!;
    public Candidate Candidate { get; set; } = null!;
    public KanbanColumn KanbanColumn { get; set; } = null!;
    public ICollection<ApplicationStatusHistory> StatusHistory { get; set; } = new List<ApplicationStatusHistory>();
    public ICollection<EmailNotification> EmailNotifications { get; set; } = new List<EmailNotification>();
}