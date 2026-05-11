using System.Linq.Expressions;
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

    public async Task<List<Postulacion>> GetAllAsync(Expression<Func<Postulacion, bool>>? predicate = null)
    {
        var query = _context.Postulaciones
            .Include(p => p.Vacante)
            .AsQueryable();
        if (predicate != null) query = query.Where(predicate);
        return await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
    }

    public async Task<Postulacion?> GetByIdAsync(Guid id)
    {
        return await _context.Postulaciones
            .Include(p => p.Vacante)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Postulacion>> GetByVacanteIdAsync(Guid vacanteId, Expression<Func<Postulacion, bool>>? predicate = null)
    {
        var query = _context.Postulaciones
            .Include(p => p.Vacante)
            .Where(p => p.VacanteId == vacanteId);
        if (predicate != null) query = query.Where(predicate);
        return await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
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
}
