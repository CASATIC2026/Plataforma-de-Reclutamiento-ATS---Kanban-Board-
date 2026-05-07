using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Vacante> Vacantes => Set<Vacante>();
    public DbSet<Requisito> Requisitos => Set<Requisito>();
    public DbSet<Postulacion> Postulaciones => Set<Postulacion>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();

    // RBAC tables
    public DbSet<Empresa> Empresas => Set<Empresa>();
    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<Permiso> Permisos => Set<Permiso>();
    public DbSet<RolPermiso> RolPermisos => Set<RolPermiso>();
    public DbSet<UsuarioRol> UsuarioRoles => Set<UsuarioRol>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<FeatureFlag> FeatureFlags => Set<FeatureFlag>();
    public DbSet<DeploymentLog> DeploymentLogs => Set<DeploymentLog>();

    // Structured application data tables
    public DbSet<CandidateSkill> CandidateSkills => Set<CandidateSkill>();
    public DbSet<ScreeningQuestion> ScreeningQuestions => Set<ScreeningQuestion>();
    public DbSet<CandidateAvailability> CandidateAvailabilities => Set<CandidateAvailability>();
    public DbSet<CandidateScreeningResponse> CandidateScreeningResponses => Set<CandidateScreeningResponse>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // This scans the assembly for ALL IEntityTypeConfiguration classes
        // and applies them automatically
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}