using RecruitmentAPI.Models;

namespace RecruitmentAPI.Repositories.Interfaces;

public interface IScreeningQuestionRepository
{
    Task<List<ScreeningQuestion>> GetByVacanteIdAsync(Guid vacanteId);
    Task<ScreeningQuestion?> GetByIdAsync(Guid id);
    Task<ScreeningQuestion> CreateAsync(ScreeningQuestion question);
    Task<ScreeningQuestion?> UpdateAsync(ScreeningQuestion question);
    Task<bool> DeleteAsync(Guid id);
}
