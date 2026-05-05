using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/candidato")]
[Authorize]
public class CandidatoController : ControllerBase
{
    private readonly AppDbContext _context;

    public CandidatoController(AppDbContext context) => _context = context;

    /// <summary>Returns the current user's own applications, matched by email or usuario_id.</summary>
    [HttpGet("postulaciones")]
    public async Task<IActionResult> GetMisPostulaciones()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        var userId = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : (Guid?)null;

        if (string.IsNullOrEmpty(email) && !userId.HasValue)
            return Unauthorized();

        var postulaciones = await _context.Postulaciones
            .Include(p => p.Vacante)
            .Where(p =>
                (email != null && p.Email.ToLower() == email.ToLower()) ||
                (userId.HasValue && p.UsuarioId == userId))
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostulacionResponseDTO
            {
                Id = p.Id,
                NombreCandidato = p.NombreCandidato,
                Email = p.Email,
                Telefono = p.Telefono,
                CvFileName = p.CvFileName,
                Estado = p.Estado,
                NotasInternas = null, // candidates never see internal notes
                Puntaje = p.Puntaje,
                PuntajeDetalle = null,
                VacanteId = p.VacanteId,
                VacanteTitulo = p.Vacante.Titulo,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToListAsync();

        return Ok(postulaciones);
    }
}
