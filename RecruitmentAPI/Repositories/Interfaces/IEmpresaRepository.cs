using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Repositories.Interfaces;

public interface IEmpresaRepository
{
    Task<List<EmpresaResponseDTO>> GetAllAsync();
    Task<Empresa?> GetByIdAsync(Guid id);
    Task<Empresa> CreateAsync(Empresa empresa);
    Task<Empresa?> UpdateAsync(Guid id, string nombre, string? dominio);
    Task<bool> DisableAsync(Guid id);
}
