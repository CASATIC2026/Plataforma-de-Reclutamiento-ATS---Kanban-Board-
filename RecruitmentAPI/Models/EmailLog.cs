namespace RecruitmentAPI.Models;

public class EmailLog
{
    public Guid Id { get; set; }
    public Guid PostulacionId { get; set; }
    public string EmailType { get; set; } = string.Empty;     // confirmacion_recepcion | rechazo_screening
    public string Subject { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;        // sent | failed | cancelled
    public DateTime? SentAt { get; set; }
    public int AttemptCount { get; set; } = 1;
    public string? LastError { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Postulacion Postulacion { get; set; } = null!;
}
