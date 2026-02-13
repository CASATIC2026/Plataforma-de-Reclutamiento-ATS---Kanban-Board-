namespace RecruitmentAPI.Entities;

public class ApplicationStatusHistory
{
    public int Id { get; set; }
    public int ApplicationId { get; set; }
    public int? FromColumnId { get; set; }
    public int ToColumnId { get; set; }
    public int? MovedByUserId { get; set; }
    public string? Notes { get; set; }
    public DateTime MovedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Application Application { get; set; } = null!;
    public KanbanColumn? FromColumn { get; set; }
    public KanbanColumn ToColumn { get; set; } = null!;
    public User? MovedByUser { get; set; }
}