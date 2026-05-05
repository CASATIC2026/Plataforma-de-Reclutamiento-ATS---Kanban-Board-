using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;

namespace RecruitmentAPI.Repositories;

public class EmpresaRepository : IEmpresaRepository
{
    private readonly AppDbContext _context;

    public EmpresaRepository(AppDbContext context) => _context = context;

    public async Task<List<EmpresaResponseDTO>> GetAllAsync()
    {
        return await _context.Empresas
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EmpresaResponseDTO
            {
                Id = e.Id,
                Nombre = e.Nombre,
                Dominio = e.Dominio,
                Estado = e.Estado,
                UsuariosCount = e.Usuarios.Count,
                VacantesCount = e.Vacantes.Count,
                CreatedAt = e.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<Empresa?> GetByIdAsync(Guid id)
    {
        return await _context.Empresas
            .Include(e => e.Usuarios)
            .Include(e => e.Vacantes)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Empresa> CreateAsync(Empresa empresa)
    {
        _context.Empresas.Add(empresa);
        await _context.SaveChangesAsync();
        return empresa;
    }

    public async Task<Empresa?> UpdateAsync(Guid id, string nombre, string? dominio)
    {
        var empresa = await _context.Empresas.FindAsync(id);
        if (empresa == null) return null;

        empresa.Nombre = nombre;
        empresa.Dominio = dominio;
        await _context.SaveChangesAsync();
        return empresa;
    }

    public async Task<bool> DisableAsync(Guid id)
    {
        var empresa = await _context.Empresas.FindAsync(id);
        if (empresa == null) return false;

        empresa.Estado = "inactiva";
        await _context.SaveChangesAsync();
        return true;
    }
}
