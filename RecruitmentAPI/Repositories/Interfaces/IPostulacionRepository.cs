using System.Linq.Expressions;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Repositories.Interfaces;

public interface IPostulacionRepository
{
    Task<List<Postulacion>> GetAllAsync(Expression<Func<Postulacion, bool>>? predicate = null);
    Task<Postulacion?> GetByIdAsync(Guid id);
    Task<List<Postulacion>> GetByVacanteIdAsync(Guid vacanteId, Expression<Func<Postulacion, bool>>? predicate = null);
    Task<Postulacion> CreateAsync(Postulacion postulacion);
    Task<Postulacion?> UpdateAsync(Postulacion postulacion);
    Task<bool> DeleteAsync(Guid id);
}
