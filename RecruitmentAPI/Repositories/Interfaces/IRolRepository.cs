using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Repositories.Interfaces;

public interface IRolRepository
{
    Task<List<RolResponseDTO>> GetAllWithPermisosAsync();
    Task<Rol?> GetByNombreAsync(string nombre);
    Task<Rol> CreateAsync(Rol rol, string[] permisoNombres);
    Task<bool> UpdatePermisosAsync(Guid rolId, string[] permisoNombres);
    Task<bool> AssignRolToUsuarioAsync(Guid usuarioId, string rolNombre, Guid? empresaId, Guid? asignadoPorId);
    Task<List<string>> GetPermisosForUsuarioAsync(Guid usuarioId);
}
