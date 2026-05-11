using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
    {
        _emailSettings = emailSettings.Value;
        _logger = logger;
    }

    // Exceptions propagate. The dispatcher catches them to mark email_status="failed"
    // and schedule retries. Swallowing here would cause the dispatcher to mark every
    // failed SMTP attempt as "sent".
    public async Task SendConfirmacionAsync(Postulacion postulacion, Vacante vacante)
    {
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromAddress));
        emailMessage.To.Add(new MailboxAddress(postulacion.NombreCandidato, postulacion.Email));
        emailMessage.Subject = $"Recibimos tu postulación — {vacante.Titulo}";

        var bodyBuilder = new BodyBuilder { HtmlBody = GetConfirmacionHtml(postulacion, vacante) };
        emailMessage.Body = bodyBuilder.ToMessageBody();

        await SendEmailAsync(emailMessage);
        _logger.LogInformation($"Confirmation email sent to {postulacion.Email} for {vacante.Titulo}");
    }

    public async Task SendResultadoAsync(Postulacion postulacion, Vacante vacante, bool apto)
    {
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromAddress));
        emailMessage.To.Add(new MailboxAddress(postulacion.NombreCandidato, postulacion.Email));

        var bodyBuilder = new BodyBuilder();
        if (apto)
        {
            emailMessage.Subject = $"¡Felicitaciones! Tu postulación a {vacante.Titulo} ha sido aceptada";
            bodyBuilder.HtmlBody = GetResultadoAptoHtml(postulacion, vacante);
        }
        else
        {
            emailMessage.Subject = $"Actualización sobre tu postulación a {vacante.Titulo}";
            bodyBuilder.HtmlBody = GetResultadoRechazadoHtml(postulacion, vacante);
        }
        emailMessage.Body = bodyBuilder.ToMessageBody();

        await SendEmailAsync(emailMessage);
        _logger.LogInformation($"Result email ({(apto ? "approved" : "rejected")}) sent to {postulacion.Email} for {vacante.Titulo}");
    }

    private async Task SendEmailAsync(MimeMessage emailMessage)
    {
        // Fail fast on placeholder/empty credentials so the dispatcher records a clear
        // failure instead of attempting SMTP auth with garbage and producing a 535 error.
        if (string.IsNullOrWhiteSpace(_emailSettings.Username)
            || string.IsNullOrWhiteSpace(_emailSettings.Password)
            || _emailSettings.Username.StartsWith("YOUR_", StringComparison.OrdinalIgnoreCase)
            || _emailSettings.Password.StartsWith("YOUR_", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "SMTP credentials are not configured. Set Email__Username and Email__Password in the backend .env file.");
        }

        try
        {
            _logger.LogInformation($"[EMAIL DEBUG] Attempting connection to {_emailSettings.SmtpHost}:{_emailSettings.SmtpPort}");

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                _logger.LogInformation($"[EMAIL DEBUG] Connected successfully");

                await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                _logger.LogInformation($"[EMAIL DEBUG] Authenticated as: {_emailSettings.Username}");

                await client.SendAsync(emailMessage);
                _logger.LogInformation($"[EMAIL DEBUG] Email sent to: {string.Join(",", emailMessage.To)}");

                await client.DisconnectAsync(true);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"[EMAIL DEBUG] SMTP Error ({ex.GetType().Name}): {ex.Message}");
            if (ex.InnerException != null)
                _logger.LogError($"[EMAIL DEBUG] Inner Exception: {ex.InnerException.Message}");
            throw; // Re-throw for caller to handle
        }
    }

    private string GetConfirmacionHtml(Postulacion postulacion, Vacante vacante)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #131931, #3525cd); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
        .header h1 {{ margin: 0; font-size: 24px; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
        .job-title {{ background: white; padding: 20px; border-left: 4px solid #CD7B4F; margin: 20px 0; border-radius: 4px; }}
        .job-title h2 {{ margin: 0 0 10px 0; color: #131931; }}
        .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
        .button {{ display: inline-block; background: #319E85; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>¡Hola, {postulacion.NombreCandidato}!</h1>
        </div>
        <div class='content'>
            <p>Gracias por tu interés en Talentify SV. Hemos recibido tu postulación exitosamente.</p>

            <div class='job-title'>
                <h2>{vacante.Titulo}</h2>
                <p><strong>Ubicación:</strong> {vacante.Ubicacion}</p>
                <p><strong>Tipo de Contrato:</strong> {vacante.TipoContrato}</p>
            </div>

            <p>Nuestro equipo de reclutamiento revisará tu perfil y te contactaremos pronto si tu postulación avanza a la siguiente etapa del proceso de selección.</p>

            <p>Mientras tanto, puedes seguir explorando más oportunidades en nuestra plataforma.</p>

            <div style='text-align: center;'>
                <a href='https://talentifysv.com' class='button'>Ver más vacantes</a>
            </div>

            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>

            <p>Saludos cordiales,<br>
            El equipo de Talentify SV</p>

            <div class='footer'>
                <p>Este es un mensaje automático. Por favor no respondas a este correo.</p>
                <p>&copy; 2026 Talentify SV. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
</body>
</html>
";
    }

    private string GetResultadoAptoHtml(Postulacion postulacion, Vacante vacante)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #319E85, #2a8b73); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
        .header h1 {{ margin: 0; font-size: 24px; }}
        .content {{ background: #f0fef9; padding: 30px; border-radius: 0 0 8px 8px; border: 2px solid #319E85; }}
        .success-badge {{ text-align: center; margin: 20px 0; }}
        .success-badge span {{ background: #319E85; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; }}
        .job-title {{ background: white; padding: 20px; border-left: 4px solid #319E85; margin: 20px 0; border-radius: 4px; }}
        .job-title h2 {{ margin: 0 0 10px 0; color: #131931; }}
        .next-steps {{ background: white; padding: 20px; border-radius: 4px; margin: 20px 0; }}
        .next-steps h3 {{ color: #131931; margin-top: 0; }}
        .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
        .button {{ display: inline-block; background: #319E85; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>¡Excelente noticia!</h1>
        </div>
        <div class='content'>
            <div class='success-badge'>
                <span>✓ POSTULACIÓN ACEPTADA</span>
            </div>

            <p>Hola {postulacion.NombreCandidato},</p>
            <p>Nos complace informarte que tu postulación ha sido aceptada y avanza a la siguiente etapa del proceso de selección.</p>

            <div class='job-title'>
                <h2>{vacante.Titulo}</h2>
                <p><strong>Ubicación:</strong> {vacante.Ubicacion}</p>
                <p><strong>Tipo de Contrato:</strong> {vacante.TipoContrato}</p>
            </div>

            <div class='next-steps'>
                <h3>Próximos Pasos</h3>
                <p>Nuestro equipo de reclutamiento se pondrá en contacto contigo pronto para coordinar la siguiente etapa de la entrevista.</p>
                <p>Por favor, asegúrate de que tu información de contacto es correcta y que estés disponible para futuras comunicaciones.</p>
            </div>

            <p>Si tienes alguna pregunta en el interim, no dudes en contactarnos.</p>

            <p>Saludos cordiales,<br>
            El equipo de Talentify SV</p>

            <div class='footer'>
                <p>Este es un mensaje automático. Por favor no respondas a este correo.</p>
                <p>&copy; 2026 Talentify SV. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
</body>
</html>
";
    }

    private string GetResultadoRechazadoHtml(Postulacion postulacion, Vacante vacante)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #131931, #3525cd); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
        .header h1 {{ margin: 0; font-size: 24px; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
        .job-title {{ background: white; padding: 20px; border-left: 4px solid #CD7B4F; margin: 20px 0; border-radius: 4px; }}
        .job-title h2 {{ margin: 0 0 10px 0; color: #131931; }}
        .feedback {{ background: white; padding: 20px; border-radius: 4px; margin: 20px 0; }}
        .feedback h3 {{ color: #131931; margin-top: 0; }}
        .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
        .button {{ display: inline-block; background: #3525cd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Actualización sobre tu postulación</h1>
        </div>
        <div class='content'>
            <p>Hola {postulacion.NombreCandidato},</p>
            <p>Agradecemos sinceramente tu interés en unirte a nuestro equipo. Sin embargo, en esta ocasión, hemos decidido continuar con otros candidatos que se alineaban más específicamente con los requerimientos de la posición.</p>

            <div class='job-title'>
                <h2>{vacante.Titulo}</h2>
                <p><strong>Ubicación:</strong> {vacante.Ubicacion}</p>
                <p><strong>Tipo de Contrato:</strong> {vacante.TipoContrato}</p>
            </div>

            <div class='feedback'>
                <h3>Te Animamos a:</h3>
                <ul>
                    <li>Seguir explorando otras oportunidades en nuestra plataforma que se alineen mejor con tu perfil.</li>
                    <li>Mejorar tus habilidades y experiencia en las áreas clave para futuras postulaciones.</li>
                    <li>Mantenerte atento a nuestras futuras vacantes, donde podrías ser un candidato ideal.</li>
                </ul>
            </div>

            <p>No desistas en tu búsqueda. El equipo de Talentify SV te desea lo mejor en tu carrera profesional.</p>

            <div style='text-align: center;'>
                <a href='https://talentifysv.com' class='button'>Explorar más vacantes</a>
            </div>

            <p>Saludos cordiales,<br>
            El equipo de Talentify SV</p>

            <div class='footer'>
                <p>Este es un mensaje automático. Por favor no respondas a este correo.</p>
                <p>&copy; 2026 Talentify SV. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
</body>
</html>
";
    }
}
