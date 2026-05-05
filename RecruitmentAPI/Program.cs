using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecruitmentAPI.Data;
using RecruitmentAPI.Repositories;
using RecruitmentAPI.Repositories.Interfaces;
using RecruitmentAPI.Services;
using RecruitmentAPI.Services.Interfaces;

// Load .env file if it exists (for development)
var envFilePath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(envFilePath))
{
    foreach (var line in File.ReadAllLines(envFilePath))
    {
        if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#")) continue;
        var parts = line.Split('=', 2);
        if (parts.Length == 2)
            Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
    }
}

var builder = WebApplication.CreateBuilder(args);

// --- SERVICES REGISTRATION ---

// Database — read connection string from environment variable for security
var dbConnection = Environment.GetEnvironmentVariable("DB_CONNECTION")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dbConnection));

// Repository layer
builder.Services.AddScoped<IVacanteRepository, VacanteRepository>();
builder.Services.AddScoped<IPostulacionRepository, PostulacionRepository>();

// Service layer
builder.Services.AddScoped<IVacanteService, VacanteService>();
builder.Services.AddScoped<IPostulacionService, PostulacionService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Screening and Email services
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
builder.Services.AddTransient<IScoringService, ScoringService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// JWT Authentication — read key from environment variable for security
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
    ?? builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT_KEY environment variable or Jwt:Key config is required");

// Inject resolved key back into IConfiguration so services (e.g. AuthService) can read it via _config["Jwt:Key"]
builder.Configuration["Jwt:Key"] = jwtKey;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Administrador"));

    options.AddPolicy("AdminOrManager", policy =>
        policy.RequireRole("Administrador", "Manager"));
});

// Controllers with request size limits (6 MB max for file uploads)
builder.Services.AddControllers();
builder.Services.Configure<FormOptions>(o => o.MultipartBodyLengthLimit = 6_000_000);

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS — read allowed origin from environment variable
var allowedOrigin = Environment.GetEnvironmentVariable("ALLOWED_ORIGIN") ?? "http://localhost:5173";
builder.Services.AddCors(options =>
    options.AddPolicy("Default", policy =>
        policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()));

// Kestrel limits
builder.WebHost.ConfigureKestrel(k =>
    k.Limits.MaxRequestBodySize = 6_000_000); // 6 MB

var app = builder.Build();

// --- MIDDLEWARE PIPELINE ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Default");

// Security headers middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    await next();
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Seed default admin user
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // Ensure all migrations are applied

    // Migrate any old Invitado (3) users to General (0)
    var invitados = db.Usuarios.Where(u => (int)u.Rol == 3).ToList();
    foreach (var u in invitados) u.Rol = RecruitmentAPI.Models.RolUsuario.General;
    if (invitados.Any()) { db.SaveChanges(); Console.WriteLine($">> Migrated {invitados.Count} Invitado users to General"); }

    // Only seed admin user if SEED_ADMIN_PASSWORD is provided (security: don't hardcode default passwords)
    var seedPassword = Environment.GetEnvironmentVariable("SEED_ADMIN_PASSWORD");
    if (!string.IsNullOrEmpty(seedPassword))
    {
        var adminUser = db.Usuarios.FirstOrDefault(u => u.Email == "admin@talentbridge.com");
        if (adminUser == null)
        {
            db.Usuarios.Add(new RecruitmentAPI.Models.Usuario
            {
                Nombre = "Admin",
                Apellido = "TalentBridge",
                Email = "admin@talentbridge.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(seedPassword),
                Rol = RecruitmentAPI.Models.RolUsuario.Administrador
            });
            db.SaveChanges();
            Console.WriteLine(">> Admin seed user created: admin@talentbridge.com");
        }
        else
        {
            adminUser.Rol = RecruitmentAPI.Models.RolUsuario.Administrador;
            adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(seedPassword);
            db.SaveChanges();
            Console.WriteLine(">> Admin seed user reset: admin@talentbridge.com");
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($">> Seed warning: {ex.Message}");
}

app.Run();
