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

    public async Task<Postulacion?> UpdateAsync(Postulacion postulacion)
    {
        _context.Postulaciones.Update(postulacion);
        await _context.SaveChangesAsync();
        return await GetByIdAsync(postulacion.Id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var postulacion = await _context.Postulaciones.FindAsync(id);
        if (postulacion == null) return false;

        _context.Postulaciones.Remove(postulacion);
        await _context.SaveChangesAsync();
        return true;
    }
<<<<<<< HEAD

    public async Task<Postulacion?> UpdateEstadoAsync(Guid id, string nuevoEstado)
{
    var postulacion = await _context.Postulaciones.FindAsync(id);
    if (postulacion is null) return null;

    postulacion.Estado = nuevoEstado;
    await _context.SaveChangesAsync();
    return postulacion;
}
=======
>>>>>>> 0145ebc5970147f9474b6bd257190a89db667477
}
