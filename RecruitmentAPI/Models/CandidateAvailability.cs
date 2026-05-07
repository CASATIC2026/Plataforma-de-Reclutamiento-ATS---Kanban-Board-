namespace RecruitmentAPI.Models;

public class CandidateAvailability
{
    public Guid Id { get; set; }
    public Guid PostulacionId { get; set; }
    public string DayOfWeek { get; set; } = string.Empty; // monday, tuesday, etc.
    public string TimeSlot { get; set; } = string.Empty; // morning, afternoon, evening
    public bool IsAvailable { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Postulacion Postulacion { get; set; } = null!;
}
