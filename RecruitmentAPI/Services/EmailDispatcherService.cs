using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

/// <summary>
/// Background polling worker that flushes due scheduled emails every 15 seconds.
/// Reads pending postulaciones with EmailScheduledFor <= now, attempts to send via
/// the existing IEmailService, records an EmailLog, and updates email_status.
/// </summary>
public class EmailDispatcherService : BackgroundService
{
    private static readonly TimeSpan PollInterval = TimeSpan.FromSeconds(15);
    private const int MaxRetries = 3;
    private static readonly TimeSpan RetryBackoff = TimeSpan.FromMinutes(2);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<EmailDispatcherService> _logger;

    public EmailDispatcherService(IServiceScopeFactory scopeFactory, ILogger<EmailDispatcherService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("EmailDispatcherService started (poll every {Seconds}s)", PollInterval.TotalSeconds);
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await DispatchDueAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmailDispatcher tick failed");
            }
            try { await Task.Delay(PollInterval, stoppingToken); } catch (TaskCanceledException) { break; }
        }
    }

    private async Task DispatchDueAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var emailSvc = scope.ServiceProvider.GetRequiredService<IEmailService>();

        var now = DateTime.UtcNow;
        var due = await db.Postulaciones
            .Include(p => p.Vacante)
            .Where(p => p.EmailStatus == "pending" && p.EmailScheduledFor != null && p.EmailScheduledFor <= now)
            .Take(50)
            .ToListAsync(ct);

        if (due.Count == 0) return;
        _logger.LogInformation("Dispatching {Count} due emails", due.Count);

        foreach (var p in due)
        {
            // Claim row by flipping to "sending" so a parallel tick doesn't pick it up
            p.EmailStatus = "sending";
            p.UpdatedAt = DateTime.UtcNow;
        }
        await db.SaveChangesAsync(ct);

        foreach (var p in due)
        {
            var emailType = p.EmailTypeToSend ?? "confirmacion_recepcion";
            string subject;
            string? error = null;
            try
            {
                if (p.Vacante == null) throw new InvalidOperationException("Vacante missing for postulacion " + p.Id);

                if (emailType == "rechazo_screening")
                {
                    subject = $"Actualización sobre tu postulación a {p.Vacante.Titulo}";
                    await emailSvc.SendResultadoAsync(p, p.Vacante, apto: false);
                }
                else
                {
                    subject = $"Recibimos tu postulación — {p.Vacante.Titulo}";
                    await emailSvc.SendConfirmacionAsync(p, p.Vacante);
                }

                p.EmailStatus = "sent";
                p.EmailSentAt = DateTime.UtcNow;
                p.EmailLastError = null;
                if (emailType == "confirmacion_recepcion") p.EmailConfirmacionEnviado = true;
                else if (emailType == "rechazo_screening") p.EmailResultadoEnviado = true;

                db.EmailLogs.Add(new EmailLog
                {
                    PostulacionId = p.Id,
                    EmailType = emailType,
                    Subject = subject,
                    Status = "sent",
                    SentAt = p.EmailSentAt,
                    AttemptCount = p.EmailRetryCount + 1,
                });
            }
            catch (Exception ex)
            {
                error = ex.Message;
                p.EmailRetryCount++;
                p.EmailLastError = error;

                if (p.EmailRetryCount >= MaxRetries)
                {
                    p.EmailStatus = "failed";
                    db.EmailLogs.Add(new EmailLog
                    {
                        PostulacionId = p.Id,
                        EmailType = emailType,
                        Subject = $"[FAILED] {emailType}",
                        Status = "failed",
                        AttemptCount = p.EmailRetryCount,
                        LastError = error,
                    });
                    _logger.LogError("Email permanently failed for {Id} after {Retries} retries: {Error}", p.Id, p.EmailRetryCount, error);
                }
                else
                {
                    // Schedule retry with exponential-ish backoff
                    p.EmailStatus = "pending";
                    p.EmailScheduledFor = DateTime.UtcNow.Add(RetryBackoff * p.EmailRetryCount);
                    _logger.LogWarning("Email retry {N}/{Max} scheduled for {Id}: {Error}", p.EmailRetryCount, MaxRetries, p.Id, error);
                }
            }
            finally
            {
                p.UpdatedAt = DateTime.UtcNow;
            }
        }

        await db.SaveChangesAsync(ct);
    }
}
