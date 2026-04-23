using RecruitmentAPI.Models;

namespace RecruitmentAPI.Services.Interfaces;

public interface IEmailService
{
    Task SendConfirmacionAsync(Postulacion postulacion, Vacante vacante);
    Task SendResultadoAsync(Postulacion postulacion, Vacante vacante, bool apto);
}
