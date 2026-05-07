namespace RecruitmentAPI.DTOs;
using System.ComponentModel.DataAnnotations;

public class CreatePostulacionDTO
{
    [Required, MaxLength(200)]
    public string NombreCandidato { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20), RegularExpression(@"^[\d\s\+\-\(\)]{7,20}$|^$")]
    public string Telefono { get; set; } = string.Empty;

    [Required]
    public Guid VacanteId { get; set; }

    // CV file — optional, sent as multipart/form-data
    public IFormFile? CvFile { get; set; }

    // Structured application data — sent as JSON strings from FormData
    public string? SkillsJson { get; set; } // JSON: [{ skillName, proficiencyLevel, yearsExperience, category }]
    public string? SoftSkillsJson { get; set; } // JSON: ["Communication", "Leadership", ...]

    [MaxLength(500)]
    public string? ImpactStatement { get; set; }

    public string? ScreeningResponsesJson { get; set; } // JSON: [{ questionId, responseText }]
    public string? AvailabilityJson { get; set; } // JSON: [{ dayOfWeek, timeSlot, isAvailable }]

    // Legal/consent fields
    public bool ConsentGdpr { get; set; } = false;
    public bool ConsentMarketing { get; set; } = false;
    public bool AttestedTruth { get; set; } = false;

    [MaxLength(200)]
    public string? AttestedSignature { get; set; }

    // Tracking
    public int? CompletionTimeSeconds { get; set; }
    public string? ApplicationSource { get; set; } = "direct";

    // Optional scoring hints (legacy — kept for backward compatibility)
    [MaxLength(200)]
    public string? Ubicacion { get; set; }

    [MaxLength(200)]
    public string? Carrera { get; set; }
}
