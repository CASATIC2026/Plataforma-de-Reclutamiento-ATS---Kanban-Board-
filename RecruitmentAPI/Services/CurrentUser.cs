using System.Security.Claims;
using System.Text.Json;
using RecruitmentAPI.Services.Interfaces;

namespace RecruitmentAPI.Services;

public class CurrentUser : ICurrentUser
{
    private readonly Lazy<HashSet<string>> _permissions;

    public CurrentUser(IHttpContextAccessor http)
    {
        var principal = http.HttpContext?.User;

        UserId = Guid.TryParse(principal?.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : null;

        var rawCompany = principal?.FindFirstValue("company_id");
        CompanyId = Guid.TryParse(rawCompany, out var cid) ? cid : null;

        // Permissions are JSON-serialized in a single claim. Lazy-parse so an
        // unauthenticated request (no claim) never pays the cost.
        _permissions = new Lazy<HashSet<string>>(() =>
        {
            var raw = principal?.FindFirstValue("permissions");
            if (string.IsNullOrEmpty(raw)) return new HashSet<string>();
            try
            {
                var arr = JsonSerializer.Deserialize<string[]>(raw) ?? Array.Empty<string>();
                return new HashSet<string>(arr, StringComparer.OrdinalIgnoreCase);
            }
            catch
            {
                return new HashSet<string>();
            }
        });
    }

    public Guid? UserId { get; }
    public Guid? CompanyId { get; }

    // Platform tier ≈ "can administer the platform across tenants".
    // Manager has companies:read for read-only company info but lacks users:assign_role,
    // which is the discriminator between app-tier Manager and platform-tier Admin/Owner.
    public bool IsPlatformTier => HasPermission("users:assign_role");

    // Manager and platform tier roles see every job in scope; Recruiter is restricted to their own.
    public bool CanSeeAllCompanyJobs => HasPermission("jobs:read_all") || HasPermission("applications:read_all");

    public bool HasPermission(string permission) => _permissions.Value.Contains(permission);

    public bool CanAccessResource(Guid? empresaId, Guid? creadoPor)
    {
        if (UserId == null) return false;
        if (IsPlatformTier) return true;
        if (CanSeeAllCompanyJobs) return empresaId == CompanyId;
        if (HasPermission("jobs:create") || HasPermission("applications:read")) // recruiter scope
            return empresaId == CompanyId && creadoPor == UserId;
        return false;
    }
}
