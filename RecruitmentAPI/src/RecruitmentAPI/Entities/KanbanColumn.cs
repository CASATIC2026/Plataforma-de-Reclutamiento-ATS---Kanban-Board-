using RecruitmentAPI.Enums;

namespace RecruitmentAPI.Entities;

public class KanbanColumn
{
    public int Id { get; set; }
    public int VacancyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; } = 0;
    public KanbanColumnType ColumnType { get; set; } = KanbanColumnType.Normal;
    public string? Color { get; set; } = "#6B7280";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Vacancy Vacancy { get; set; } = null!;
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}