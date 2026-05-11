namespace RecruitmentAPI.Services.Interfaces;

/// <summary>
/// Resolved per request from the signed JWT. Services rely on this instead of
/// reading claims directly so they remain testable and controllers stay thin.
/// All values come from claims the JwtBearer middleware has already verified —
/// they are never accepted from request bodies, headers, or query strings.
/// </summary>
public interface ICurrentUser
{
    Guid? UserId { get; }
    Guid? CompanyId { get; }

    /// <summary>True when the user can operate across tenants (Admin, Owner).</summary>
    bool IsPlatformTier { get; }

    /// <summary>True when the user can see every job inside their own company (Manager, Admin, Owner).</summary>
    bool CanSeeAllCompanyJobs { get; }

    bool HasPermission(string permission);

    /// <summary>
    /// True if a resource belonging to (<paramref name="empresaId"/>, <paramref name="creadoPor"/>)
    /// is visible to the current user. Anonymous → false.
    /// </summary>
    bool CanAccessResource(Guid? empresaId, Guid? creadoPor);
}
