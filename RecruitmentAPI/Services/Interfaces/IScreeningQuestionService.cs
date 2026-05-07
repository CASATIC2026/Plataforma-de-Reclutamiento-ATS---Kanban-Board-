using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IScreeningQuestionService
{
    Task<List<ScreeningQuestionDTO>> GetByVacanteIdAsync(Guid vacanteId);
    Task<ScreeningQuestionDTO?> GetByIdAsync(Guid id);
    Task<ScreeningQuestionDTO> CreateAsync(CreateScreeningQuestionDTO dto);
    Task<ScreeningQuestionDTO?> UpdateAsync(Guid id, CreateScreeningQuestionDTO dto);
    Task<bool> DeleteAsync(Guid id);
}
