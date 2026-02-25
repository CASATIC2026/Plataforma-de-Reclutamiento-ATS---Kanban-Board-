using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;

namespace RecruitmentAPI.Repositories;

public class VacanteRepository : IVacanteRepository
{
    private readonly AppDbContext _context;

    public VacanteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Vacante>> GetAllAsync()
    {
        return await _context.Vacantes
            .Include(v => v.Requisitos)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();
    }

    public async Task<Vacante?> GetByIdAsync(Guid id)
    {
        return await _context.Vacantes
            .Include(v => v.Requisitos)
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<Vacante> CreateAsync(Vacante vacante)
    {
        _context.Vacantes.Add(vacante);
        await _context.SaveChangesAsync();
        return vacante;
    }

    public async Task<Vacante> UpdateAsync(Vacante vacante)
    {
        _context.Vacantes.Update(vacante);
        await _context.SaveChangesAsync();
        return vacante;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var vacante = await _context.Vacantes.FindAsync(id);
        if (vacante == null) return false;

        _context.Vacantes.Remove(vacante);
        await _context.SaveChangesAsync();
        return true;
    }
}