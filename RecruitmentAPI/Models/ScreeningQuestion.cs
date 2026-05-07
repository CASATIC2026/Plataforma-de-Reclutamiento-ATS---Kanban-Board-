namespace RecruitmentAPI.Models;

public class ScreeningQuestion
{
    public Guid Id { get; set; }
    public Guid VacanteId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string QuestionType { get; set; } = "text"; // text, multiple_choice, boolean, scale_1_5
    public string? Options { get; set; } // JSON array for multiple_choice options
    public string? CorrectAnswer { get; set; }
    public int MaxScore { get; set; } = 10;
    public bool Required { get; set; } = true;
    public int Orden { get; set; } = 0; // Sort order
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Vacante Vacante { get; set; } = null!;
}
