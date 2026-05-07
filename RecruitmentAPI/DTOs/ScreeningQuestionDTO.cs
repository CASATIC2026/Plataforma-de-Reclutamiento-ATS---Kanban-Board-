namespace RecruitmentAPI.DTOs;

public class ScreeningQuestionDTO
{
    public Guid Id { get; set; }
    public Guid VacanteId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string QuestionType { get; set; } = "text"; // text, multiple_choice, boolean, scale_1_5
    public string? Options { get; set; } // JSON array
    public int MaxScore { get; set; }
    public bool Required { get; set; }
    public int Orden { get; set; }
}
