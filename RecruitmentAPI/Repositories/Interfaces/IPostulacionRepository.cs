using RecruitmentAPI.Models;

namespace RecruitmentAPI.Repositories.Interfaces;

public interface IPostulacionRepository
{
    Task<List<Postulacion>> GetAllAsync();
    Task<Postulacion?> GetByIdAsync(Guid id);
    Task<List<Postulacion>> GetByVacanteIdAsync(Guid vacanteId);
    Task<Postulacion> CreateAsync(Postulacion postulacion);
    Task<bool> DeleteAsync(Guid id);
}
