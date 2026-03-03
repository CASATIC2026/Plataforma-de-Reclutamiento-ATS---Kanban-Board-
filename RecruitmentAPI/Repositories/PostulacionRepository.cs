using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;

namespace RecruitmentAPI.Repositories;

public class PostulacionRepository : IPostulacionRepository
{
    private readonly AppDbContext _context;

    public PostulacionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Postulacion>> GetAllAsync()
    {
        return await _context.Postulaciones
            .Include(p => p.Vacante)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Postulacion?> GetByIdAsync(Guid id)
    {
        return await _context.Postulaciones
            .Include(p => p.Vacante)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Postulacion>> GetByVacanteIdAsync(Guid vacanteId)
    {
        return await _context.Postulaciones
            .Include(p => p.Vacante)
            .Where(p => p.VacanteId == vacanteId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Postulacion> CreateAsync(Postulacion postulacion)
    {
        _context.Postulaciones.Add(postulacion);
        await _context.SaveChangesAsync();
        return postulacion;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var postulacion = await _context.Postulaciones.FindAsync(id);
        if (postulacion == null) return false;

        _context.Postulaciones.Remove(postulacion);
        await _context.SaveChangesAsync();
        return true;
    }
}
