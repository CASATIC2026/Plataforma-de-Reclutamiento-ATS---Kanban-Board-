using RecruitmentAPI.Models;

namespace RecruitmentAPI.Repositories.Interfaces;

public interface IPostulacionRepository
{
    Task<List<Postulacion>> GetAllAsync();
    Task<Postulacion?> GetByIdAsync(Guid id);
    Task<List<Postulacion>> GetByVacanteIdAsync(Guid vacanteId);
    Task<Postulacion> CreateAsync(Postulacion postulacion);
    Task<Postulacion?> UpdateAsync(Postulacion postulacion);
    Task<bool> DeleteAsync(Guid id);
<<<<<<< HEAD
    Task<Postulacion?> UpdateEstadoAsync(Guid id, string nuevoEstado);
=======
>>>>>>> 0145ebc5970147f9474b6bd257190a89db667477
}
