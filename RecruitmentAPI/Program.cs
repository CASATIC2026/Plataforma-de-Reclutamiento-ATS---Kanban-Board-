using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecruitmentAPI.Data;
using RecruitmentAPI.Middleware;
using RecruitmentAPI.Models;
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

builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
});

// --- SERVICES REGISTRATION ---

// Database — read connection string from environment variable for security
var dbConnection = Environment.GetEnvironmentVariable("DB_CONNECTION")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dbConnection));

// Per-request JWT context — read by services for tenant scoping
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

// Repository layer
builder.Services.AddScoped<IVacanteRepository, VacanteRepository>();
builder.Services.AddScoped<IPostulacionRepository, PostulacionRepository>();
builder.Services.AddScoped<IEmpresaRepository, EmpresaRepository>();
builder.Services.AddScoped<IRolRepository, RolRepository>();
builder.Services.AddScoped<IScreeningQuestionRepository, ScreeningQuestionRepository>();

// Service layer
builder.Services.AddScoped<IVacanteService, VacanteService>();
builder.Services.AddScoped<IPostulacionService, PostulacionService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IFeatureFlagService, FeatureFlagService>();
builder.Services.AddScoped<IDeploymentService, DeploymentService>();
builder.Services.AddScoped<IScreeningQuestionService, ScreeningQuestionService>();

// Screening and Email services
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
builder.Services.AddTransient<IScoringService, ScoringService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHostedService<EmailDispatcherService>();

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

builder.Services.AddHttpClient();

// Controllers with request size limits (6 MB max for file uploads)
builder.Services.AddControllers();
builder.Services.Configure<FormOptions>(o => o.MultipartBodyLengthLimit = 6_000_000);

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS — read allowed origin from environment variable
var allowedOrigins = (Environment.GetEnvironmentVariable("ALLOWED_ORIGIN") ?? "http://localhost:5173")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
builder.Services.AddCors(options =>
    options.AddPolicy("Default", policy =>
        policy.WithOrigins(allowedOrigins)
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
app.UseMiddleware<CloudflareAccessMiddleware>();
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
            adminUser = new Usuario
            {
                Nombre = "Admin",
                Apellido = "TalentBridge",
                Email = "admin@talentbridge.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(seedPassword),
                Rol = RolUsuario.Administrador
            };
            db.Usuarios.Add(adminUser);
            db.SaveChanges();
            Console.WriteLine(">> Admin seed user created: admin@talentbridge.com");
        }
        else
        {
            adminUser.Rol = RolUsuario.Administrador;
            adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(seedPassword);
            db.SaveChanges();
            Console.WriteLine(">> Admin seed user reset: admin@talentbridge.com");
        }
    }

    // ── RBAC SEED ── runs once if no roles exist
    if (!db.Roles.Any())
    {
        Console.WriteLine(">> Seeding RBAC data...");

        // 1. Default company
        var empresa = new Empresa { Nombre = "Talentify SV Demo", Dominio = "talentifysv.com", Estado = "activa" };
        db.Empresas.Add(empresa);
        db.SaveChanges();

        // 2. Assign existing admin user to default company
        var admin = db.Usuarios.FirstOrDefault(u => u.Rol == RolUsuario.Administrador);
        if (admin != null) { admin.EmpresaId = empresa.Id; db.SaveChanges(); }

        // 3. Seed all 35 permissions
        var permissionDefs = new (string Nombre, string Descripcion, string Categoria)[]
        {
            ("jobs:read",                 "Ver vacantes",                       "jobs"),
            ("jobs:create",               "Crear vacantes",                     "jobs"),
            ("jobs:update",               "Editar vacantes",                    "jobs"),
            ("jobs:delete",               "Eliminar vacantes",                  "jobs"),
            ("jobs:approve",              "Aprobar vacantes",                   "jobs"),
            ("jobs:publish",              "Publicar vacantes",                  "jobs"),
            ("jobs:read_all",             "Ver todas las vacantes",             "jobs"),
            ("applications:create",       "Crear postulaciones",                "applications"),
            ("applications:read_own",     "Ver mis postulaciones",              "applications"),
            ("applications:read",         "Ver postulaciones de la empresa",    "applications"),
            ("applications:read_all",     "Ver todas las postulaciones",        "applications"),
            ("applications:update_status","Cambiar estado de postulaciones",    "applications"),
            ("applications:add_note",     "Agregar notas internas",             "applications"),
            ("profile:update_own",        "Editar mi perfil",                   "profile"),
            ("users:read",                "Ver usuarios",                       "users"),
            ("users:update",              "Editar usuarios",                    "users"),
            ("users:disable",             "Deshabilitar usuarios",              "users"),
            ("users:assign_role",         "Asignar roles a usuarios",           "users"),
            ("companies:create",          "Crear empresas",                     "companies"),
            ("companies:read",            "Ver empresas",                       "companies"),
            ("companies:update",          "Editar empresas",                    "companies"),
            ("companies:transfer",        "Transferir empresas",                "companies"),
            ("reports:read",              "Ver analíticas",                     "reports"),
            ("roles:read",                "Ver roles",                          "roles"),
            ("roles:create",              "Crear roles",                        "roles"),
            ("roles:update",              "Editar roles",                       "roles"),
            ("roles:assign_admin",        "Asignar rol Admin",                  "roles"),
            ("audit:read",                "Ver auditoría",                      "audit"),
            ("audit:export",              "Exportar auditoría",                 "audit"),
            ("platform:access",           "Acceder al panel de plataforma",     "platform"),
            ("platform:configure",        "Configurar plataforma",              "platform"),
            ("billing:read",              "Ver facturación",                    "platform"),
            ("deployment:trigger",        "Disparar despliegues",               "ops"),
            ("deployment:read_logs",      "Ver logs de despliegue",             "ops"),
            ("deployment:rollback",       "Hacer rollback",                     "ops"),
            ("infra:read_metrics",        "Ver métricas de infraestructura",    "ops"),
            ("infra:configure",           "Configurar infraestructura",         "ops"),
            ("pipeline:trigger",          "Disparar pipelines CI/CD",           "ops"),
            ("logs:read",                 "Ver logs del sistema",               "ops"),
            ("features:toggle",           "Activar/desactivar feature flags",   "ops"),
            ("db:read_logs",              "Ver logs de base de datos",          "ops"),
        };

        var permisos = permissionDefs.Select(p => new Permiso
        {
            Nombre = p.Nombre, Descripcion = p.Descripcion, Categoria = p.Categoria
        }).ToList();
        db.Permisos.AddRange(permisos);
        db.SaveChanges();

        var permMap = db.Permisos.ToDictionary(p => p.Nombre, p => p.Id);

        // 4. Seed 8 roles with their permissions
        var roleDefinitions = new Dictionary<string, (string Ambito, bool EsInmutable, string[] Perms)>
        {
            ["Candidate"] = ("app_tier", false, new[] {
                "jobs:read","applications:create","applications:read_own","profile:update_own"
            }),
            ["Recruiter"] = ("app_tier", false, new[] {
                "jobs:read","jobs:create","jobs:update","jobs:delete",
                "applications:create","applications:read_own","applications:read",
                "applications:update_status","applications:add_note","profile:update_own"
            }),
            ["Manager"] = ("app_tier", false, new[] {
                "jobs:read","jobs:create","jobs:update","jobs:delete","jobs:approve","jobs:publish","jobs:read_all",
                "applications:create","applications:read_own","applications:read","applications:read_all",
                "applications:update_status","applications:add_note","profile:update_own",
                "reports:read","users:read","companies:read","platform:access"
            }),
            ["Admin"] = ("platform_tier", false, new[] {
                "jobs:read_all","applications:read_all",
                "users:read","users:update","users:disable","users:assign_role",
                "companies:create","companies:read","companies:update",
                "audit:read","roles:read","platform:access"
            }),
            ["Owner"] = ("platform_tier", true, new[] {
                "jobs:read","jobs:create","jobs:update","jobs:delete","jobs:approve","jobs:publish","jobs:read_all",
                "applications:create","applications:read_own","applications:read","applications:read_all",
                "applications:update_status","applications:add_note","profile:update_own",
                "users:read","users:update","users:disable","users:assign_role",
                "companies:create","companies:read","companies:update","companies:transfer",
                "reports:read","roles:read","roles:create","roles:update","roles:assign_admin",
                "audit:read","audit:export",
                "platform:access","platform:configure","billing:read",
                "deployment:trigger","deployment:read_logs","deployment:rollback",
                "infra:read_metrics","infra:configure","pipeline:trigger",
                "logs:read","features:toggle","db:read_logs"
            }),
            ["Developer"] = ("platform_tier", false, new[] {
                "deployment:trigger","deployment:read_logs","logs:read","features:toggle"
            }),
            ["DevOps"] = ("platform_tier", false, new[] {
                "deployment:trigger","deployment:rollback","infra:read_metrics","infra:configure","pipeline:trigger"
            }),
            ["DBA"] = ("platform_tier", false, new[] {
                "audit:read","db:read_logs"
            }),
        };

        foreach (var (nombre, (ambito, esInmutable, perms)) in roleDefinitions)
        {
            var rol = new Rol { Nombre = nombre, Ambito = ambito, EsInmutable = esInmutable };
            db.Roles.Add(rol);
            db.SaveChanges();

            foreach (var perm in perms)
            {
                if (permMap.TryGetValue(perm, out var permId))
                    db.RolPermisos.Add(new RolPermiso { RolId = rol.Id, PermisoId = permId });
            }
            db.SaveChanges();
        }

        // 5. Assign Owner role to the admin user
        var ownerRol = db.Roles.FirstOrDefault(r => r.Nombre == "Owner");
        var adminUsuario = db.Usuarios.FirstOrDefault(u => u.Rol == RolUsuario.Administrador);
        if (ownerRol != null && adminUsuario != null)
        {
            db.UsuarioRoles.Add(new UsuarioRol
            {
                UsuarioId = adminUsuario.Id,
                RolId = ownerRol.Id,
                EmpresaId = empresa.Id,
                AsignadoEn = DateTime.UtcNow
            });
            db.SaveChanges();
        }

        // 6. Seed feature flags
        db.FeatureFlags.AddRange(new[]
        {
            new FeatureFlag { Nombre = "screening_automatico",  Descripcion = "Screening automático al recibir postulación", EstaActivo = true },
            new FeatureFlag { Nombre = "email_notificaciones",  Descripcion = "Enviar emails de confirmación y resultado",   EstaActivo = false },
            new FeatureFlag { Nombre = "registro_publico",      Descripcion = "Permitir registro público de candidatos",     EstaActivo = true },
            new FeatureFlag { Nombre = "modo_mantenimiento",    Descripcion = "Modo mantenimiento (bloquea acceso público)", EstaActivo = false },
        });
        db.SaveChanges();

        // 7. Seed initial deployment log
        db.DeploymentLogs.Add(new DeploymentLog
        {
            Version = "1.0.0",
            DisparadoPor = adminUsuario?.Id,
            Estado = "Success",
            DuracionSegundos = 45,
            Notas = "Initial deployment — Talentify SV v1.0.0"
        });
        db.SaveChanges();

        Console.WriteLine(">> RBAC seed complete: 8 roles, 41 permissions, 4 feature flags");
    }
}
catch (Exception ex)
{
    Console.WriteLine($">> Seed warning: {ex.Message}");
}

// Idempotent test-tenant seed — gated on SEED_TEST_PASSWORD env var so it
// only runs when the operator explicitly opts in. Creates two empresas and
// one Manager + two Recruiters per company so the scope filter is observable.
try
{
    var testPwd = Environment.GetEnvironmentVariable("SEED_TEST_PASSWORD");
    if (!string.IsNullOrEmpty(testPwd))
    {
        using var scopeT = app.Services.CreateScope();
        var dbT = scopeT.ServiceProvider.GetRequiredService<AppDbContext>();

        var recruiterRol = dbT.Roles.FirstOrDefault(r => r.Nombre == "Recruiter");
        var managerRol   = dbT.Roles.FirstOrDefault(r => r.Nombre == "Manager");

        if (recruiterRol != null && managerRol != null)
        {
            var tenants = new (string Empresa, string Dominio, string MgrEmail, string[] RecrEmails)[]
            {
                ("TechNova SV", "technova.sv", "mgr@technova.sv", new[] { "recr1@technova.sv", "recr2@technova.sv" }),
                ("InnoSoft SV", "innosoft.sv", "mgr@innosoft.sv", new[] { "recr1@innosoft.sv", "recr2@innosoft.sv" }),
            };

            foreach (var t in tenants)
            {
                var empresa = dbT.Empresas.FirstOrDefault(e => e.Nombre == t.Empresa)
                    ?? dbT.Empresas.Add(new Empresa { Nombre = t.Empresa, Dominio = t.Dominio, Estado = "activa" }).Entity;
                dbT.SaveChanges();

                void EnsureUser(string email, string rolNombre, RolUsuario legacy, Guid rolId)
                {
                    var u = dbT.Usuarios.FirstOrDefault(x => x.Email == email);
                    if (u == null)
                    {
                        u = new Usuario
                        {
                            Nombre = email.Split('@')[0],
                            Apellido = t.Empresa.Split(' ')[0],
                            Email = email,
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword(testPwd),
                            Rol = legacy,
                            EmpresaId = empresa.Id,
                        };
                        dbT.Usuarios.Add(u);
                        dbT.SaveChanges();
                    }
                    else if (u.EmpresaId != empresa.Id)
                    {
                        u.EmpresaId = empresa.Id;
                        u.Rol = legacy;
                        dbT.SaveChanges();
                    }

                    // Ensure exactly the expected RBAC role assignment in app_tier
                    var stale = dbT.UsuarioRoles
                        .Include(ur => ur.Rol)
                        .Where(ur => ur.UsuarioId == u.Id && ur.Rol.Ambito == "app_tier")
                        .ToList();
                    foreach (var s in stale) if (s.RolId != rolId) dbT.UsuarioRoles.Remove(s);
                    if (!stale.Any(s => s.RolId == rolId))
                    {
                        dbT.UsuarioRoles.Add(new UsuarioRol
                        {
                            UsuarioId = u.Id,
                            RolId = rolId,
                            EmpresaId = empresa.Id,
                            AsignadoEn = DateTime.UtcNow
                        });
                    }
                    dbT.SaveChanges();
                }

                EnsureUser(t.MgrEmail, "Manager", RolUsuario.Manager, managerRol.Id);
                foreach (var e in t.RecrEmails)
                    EnsureUser(e, "Recruiter", RolUsuario.Manager, recruiterRol.Id);
            }
            Console.WriteLine(">> Test tenants seed complete: 2 empresas, 6 users");
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($">> Test tenants seed warning: {ex.Message}");
}

// Idempotent permission back-fill — runs on every startup, safe to repeat
try
{
    using var scope2 = app.Services.CreateScope();
        var db2 = scope2.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db2.Permisos.Any(p => p.Nombre == "applications:review"))
    {
        var reviewPerm = new Permiso
        {
            Nombre = "applications:review",
            Descripcion = "Revisar candidatos antes de enviar emails automatizados",
            Categoria = "applications"
        };
        db2.Permisos.Add(reviewPerm);
        db2.SaveChanges();

        var targetNombres = new[] { "Recruiter", "Manager", "Admin", "Owner" };
        var targetRoles = db2.Roles
            .Include(r => r.RolPermisos)
            .Where(r => targetNombres.Contains(r.Nombre))
            .ToList();

        foreach (var rol in targetRoles)
        {
            if (!rol.RolPermisos.Any(rp => rp.PermisoId == reviewPerm.Id))
                db2.RolPermisos.Add(new RolPermiso { RolId = rol.Id, PermisoId = reviewPerm.Id });
        }
        db2.SaveChanges();
        Console.WriteLine(">> Back-fill: added 'applications:review' permission and linked to roles.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($">> Back-fill warning: {ex.Message}");
}

app.Run();
