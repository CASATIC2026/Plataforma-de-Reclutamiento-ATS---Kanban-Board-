namespace RecruitmentAPI.DTOs;

public class RejectReviewDTO
{
    public string? Reason { get; set; }
}

public class BulkRejectDTO
{
    public List<Guid> Ids { get; set; } = new();
    public string? Reason { get; set; }
}
