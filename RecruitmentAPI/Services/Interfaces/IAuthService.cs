using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDTO> RegisterAsync(RegisterDTO dto);
    Task<AuthResponseDTO?> LoginAsync(LoginDTO dto);
    Task<List<UsuarioResponseDTO>> GetAllUsersAsync();
    Task<UsuarioResponseDTO?> ChangeRolAsync(Guid userId, string newRol);
    Task<bool> DeleteUserAsync(Guid userId);
}
