using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Repositories.Interfaces;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class ScreeningQuestionService : IScreeningQuestionService
{
    private readonly IScreeningQuestionRepository _repository;
    private readonly IVacanteRepository _vacanteRepository;

    public ScreeningQuestionService(
        IScreeningQuestionRepository repository,
        IVacanteRepository vacanteRepository)
    {
        _repository = repository;
        _vacanteRepository = vacanteRepository;
    }

    public async Task<List<ScreeningQuestionDTO>> GetByVacanteIdAsync(Guid vacanteId)
    {
        var questions = await _repository.GetByVacanteIdAsync(vacanteId);
        return questions.Select(MapToDTO).ToList();
    }

    public async Task<ScreeningQuestionDTO?> GetByIdAsync(Guid id)
    {
        var question = await _repository.GetByIdAsync(id);
        return question == null ? null : MapToDTO(question);
    }

    public async Task<ScreeningQuestionDTO> CreateAsync(CreateScreeningQuestionDTO dto)
    {
        var vacante = await _vacanteRepository.GetByIdAsync(dto.VacanteId);
        if (vacante == null)
            throw new InvalidOperationException($"Vacante with ID {dto.VacanteId} not found");

        var question = new ScreeningQuestion
        {
            VacanteId = dto.VacanteId,
            QuestionText = dto.QuestionText,
            QuestionType = dto.QuestionType,
            Options = dto.Options,
            CorrectAnswer = dto.CorrectAnswer,
            MaxScore = dto.MaxScore,
            Required = dto.Required,
            Orden = dto.Orden,
        };

        var created = await _repository.CreateAsync(question);
        return MapToDTO(created);
    }

    public async Task<ScreeningQuestionDTO?> UpdateAsync(Guid id, CreateScreeningQuestionDTO dto)
    {
        var question = await _repository.GetByIdAsync(id);
        if (question == null) return null;

        question.QuestionText = dto.QuestionText;
        question.QuestionType = dto.QuestionType;
        question.Options = dto.Options;
        question.CorrectAnswer = dto.CorrectAnswer;
        question.MaxScore = dto.MaxScore;
        question.Required = dto.Required;
        question.Orden = dto.Orden;

        var updated = await _repository.UpdateAsync(question);
        return updated == null ? null : MapToDTO(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static ScreeningQuestionDTO MapToDTO(ScreeningQuestion question)
    {
        return new ScreeningQuestionDTO
        {
            Id = question.Id,
            VacanteId = question.VacanteId,
            QuestionText = question.QuestionText,
            QuestionType = question.QuestionType,
            Options = question.Options,
            MaxScore = question.MaxScore,
            Required = question.Required,
            Orden = question.Orden,
        };
    }
}
