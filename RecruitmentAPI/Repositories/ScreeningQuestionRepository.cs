using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;

namespace RecruitmentAPI.Repositories;

public class ScreeningQuestionRepository : IScreeningQuestionRepository
{
    private readonly AppDbContext _context;

    public ScreeningQuestionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ScreeningQuestion>> GetByVacanteIdAsync(Guid vacanteId)
    {
        return await _context.ScreeningQuestions
            .Where(sq => sq.VacanteId == vacanteId)
            .OrderBy(sq => sq.Orden)
            .ToListAsync();
    }

    public async Task<ScreeningQuestion?> GetByIdAsync(Guid id)
    {
        return await _context.ScreeningQuestions.FirstOrDefaultAsync(sq => sq.Id == id);
    }

    public async Task<ScreeningQuestion> CreateAsync(ScreeningQuestion question)
    {
        _context.ScreeningQuestions.Add(question);
        await _context.SaveChangesAsync();
        return question;
    }

    public async Task<ScreeningQuestion?> UpdateAsync(ScreeningQuestion question)
    {
        _context.ScreeningQuestions.Update(question);
        await _context.SaveChangesAsync();
        return question;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var question = await GetByIdAsync(id);
        if (question == null) return false;

        _context.ScreeningQuestions.Remove(question);
        await _context.SaveChangesAsync();
        return true;
    }
}
