using RecruitmentAPI.Enums;

namespace RecruitmentAPI.Entities;

public class EmailNotification
{
    public int Id { get; set; }
    public int ApplicationId { get; set; }
    public string RecipientEmail { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public EmailType EmailType { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime? SentAt { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Application Application { get; set; } = null!;
}