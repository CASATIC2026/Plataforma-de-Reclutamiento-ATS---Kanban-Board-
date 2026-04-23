using System.ComponentModel.DataAnnotations;

namespace RecruitmentAPI.DTOs;

public class ChangeRolDTO
{
    [Required]
    public string Rol { get; set; } = string.Empty;
}
