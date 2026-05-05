using RecruitmentAPI.DTOs;

namespace RecruitmentAPI.Services.Interfaces;

public interface IAuditService
{
    Task LogAsync(Guid? usuarioId, string accion, string? recurso, string resultado, string? ip = null, string? detalles = null);
    Task<List<AuditLogResponseDTO>> GetLogsAsync(DateTime? from, DateTime? to, Guid? usuarioId, string? resultado, int page = 1, int pageSize = 50);
}
