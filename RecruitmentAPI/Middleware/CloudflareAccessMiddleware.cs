using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace RecruitmentAPI.Middleware;

/// <summary>
/// Enforces Cloudflare Access JWT validation on platform-tier API routes.
/// Only active when CF_ACCESS_TEAM_NAME and CF_ACCESS_AUD are set in env.
/// Safe to leave unconfigured for local / LAN development.
/// </summary>
public class CloudflareAccessMiddleware
{
    private static readonly string[] ProtectedPrefixes =
    [
        "/api/usuarios",
        "/api/audit",
        "/api/roles",
        "/api/feature-flags",
        "/api/ops",
        "/api/platform",
    ];

    private readonly RequestDelegate _next;
    private readonly string? _teamName;
    private readonly string? _aud;
    private readonly IHttpClientFactory _http;

    // Simple in-process key cache — refreshed every 6 hours
    private IList<JsonWebKey>? _cachedKeys;
    private DateTime _keysFetchedAt = DateTime.MinValue;
    private static readonly SemaphoreSlim _keyLock = new(1, 1);

    public CloudflareAccessMiddleware(RequestDelegate next, IConfiguration config, IHttpClientFactory http)
    {
        _next = next;
        _http = http;
        _teamName = Environment.GetEnvironmentVariable("CF_ACCESS_TEAM_NAME")
            ?? config["CF_ACCESS_TEAM_NAME"];
        _aud = Environment.GetEnvironmentVariable("CF_ACCESS_AUD")
            ?? config["CF_ACCESS_AUD"];
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Bypass entirely when not configured (local / LAN dev)
        if (string.IsNullOrEmpty(_teamName) || string.IsNullOrEmpty(_aud))
        {
            await _next(context);
            return;
        }

        var path = context.Request.Path.Value ?? string.Empty;
        var isProtected = ProtectedPrefixes.Any(p =>
            path.StartsWith(p, StringComparison.OrdinalIgnoreCase));

        if (!isProtected)
        {
            await _next(context);
            return;
        }

        var cfJwt = context.Request.Headers["Cf-Access-Jwt-Assertion"].FirstOrDefault();
        if (string.IsNullOrEmpty(cfJwt))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsJsonAsync(new
            {
                message = "Cloudflare Access verification required."
            });
            return;
        }

        if (!await ValidateAsync(cfJwt))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsJsonAsync(new
            {
                message = "Invalid or expired Cloudflare Access token."
            });
            return;
        }

        await _next(context);
    }

    private async Task<bool> ValidateAsync(string jwt)
    {
        try
        {
            var keys = await GetKeysAsync();
            if (keys == null) return false;

            var handler = new JwtSecurityTokenHandler();
            handler.ValidateToken(jwt, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = $"https://{_teamName}.cloudflareaccess.com",
                ValidateAudience = true,
                ValidAudience = _aud,
                ValidateLifetime = true,
                IssuerSigningKeys = keys,
                ValidateIssuerSigningKey = true,
            }, out _);

            return true;
        }
        catch
        {
            return false;
        }
    }

    private async Task<IList<JsonWebKey>?> GetKeysAsync()
    {
        if (_cachedKeys != null && (DateTime.UtcNow - _keysFetchedAt).TotalHours < 6)
            return _cachedKeys;

        await _keyLock.WaitAsync();
        try
        {
            // Re-check after acquiring lock
            if (_cachedKeys != null && (DateTime.UtcNow - _keysFetchedAt).TotalHours < 6)
                return _cachedKeys;

            var client = _http.CreateClient();
            var url = $"https://{_teamName}.cloudflareaccess.com/cdn-cgi/access/certs";
            var json = await client.GetStringAsync(url);
            var jwks = new JsonWebKeySet(json);
            _cachedKeys = jwks.Keys;
            _keysFetchedAt = DateTime.UtcNow;
            return _cachedKeys;
        }
        catch
        {
            return null;
        }
        finally
        {
            _keyLock.Release();
        }
    }
}
