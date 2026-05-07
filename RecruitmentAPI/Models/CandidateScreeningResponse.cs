namespace RecruitmentAPI.Models;

public class CandidateScreeningResponse
{
    public Guid Id { get; set; }
    public Guid PostulacionId { get; set; }
    public Guid QuestionId { get; set; }
    public string? ResponseText { get; set; }
    public decimal? AutoScore { get; set; }
    public decimal? ReviewerScore { get; set; }
    public Guid? ReviewedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Postulacion Postulacion { get; set; } = null!;
    public ScreeningQuestion Question { get; set; } = null!;
}
