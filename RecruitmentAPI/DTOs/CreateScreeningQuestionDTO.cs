namespace RecruitmentAPI.DTOs;
using System.ComponentModel.DataAnnotations;

public class CreateScreeningQuestionDTO
{
    [Required]
    public Guid VacanteId { get; set; }

    [Required]
    public string QuestionText { get; set; } = string.Empty;

    [Required]
    public string QuestionType { get; set; } = "text"; // text, multiple_choice, boolean, scale_1_5

    public string? Options { get; set; } // JSON array for multiple_choice

    public string? CorrectAnswer { get; set; }

    public int MaxScore { get; set; } = 10;

    public bool Required { get; set; } = true;

    public int Orden { get; set; } = 0;
}
