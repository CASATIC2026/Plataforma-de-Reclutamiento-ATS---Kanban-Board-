using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecruitmentAPI.Data;
using RecruitmentAPI.Repositories;
using RecruitmentAPI.Repositories.Interfaces;
using RecruitmentAPI.Services;
using RecruitmentAPI.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// --- SERVICES REGISTRATION ---

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]!;
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

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- MIDDLEWARE PIPELINE ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
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

    var adminUser = db.Usuarios.FirstOrDefault(u => u.Email == "admin@talentbridge.com");
    if (adminUser == null)
    {
        db.Usuarios.Add(new RecruitmentAPI.Models.Usuario
        {
            Nombre = "Admin",
            Apellido = "TalentBridge",
            Email = "admin@talentbridge.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Rol = RecruitmentAPI.Models.RolUsuario.Administrador
        });
        db.SaveChanges();
        Console.WriteLine(">> Admin seed user created: admin@talentbridge.com / Admin123!");
    }
    else
    {
        adminUser.Rol = RecruitmentAPI.Models.RolUsuario.Administrador;
        adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!");
        db.SaveChanges();
        Console.WriteLine(">> Admin seed user reset: admin@talentbridge.com / Admin123!");
    }
}
catch (Exception ex)
{
    Console.WriteLine($">> Seed warning: {ex.Message}");
}

app.Run();
