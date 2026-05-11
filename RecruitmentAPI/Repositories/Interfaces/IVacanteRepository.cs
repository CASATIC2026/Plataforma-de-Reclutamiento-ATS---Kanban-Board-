using System.Linq.Expressions;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Repositories.Interfaces;

public interface IVacanteRepository
{
    Task<List<Vacante>> GetAllAsync(Expression<Func<Vacante, bool>>? predicate = null);
    Task<Vacante?> GetByIdAsync(Guid id);
    Task<Vacante> CreateAsync(Vacante vacante);
    Task<Vacante> UpdateAsync(Vacante vacante);
    Task<bool> DeleteAsync(Guid id);
}
