using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data.Configurations;

public class VacanteConfiguration : IEntityTypeConfiguration<Vacante>
{
    public void Configure(EntityTypeBuilder<Vacante> builder)
    {
        builder.ToTable("vacantes");

        builder.HasKey(v => v.Id);

        builder.Property(v => v.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(v => v.Titulo)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(v => v.Descripcion)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(v => v.Ubicacion)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(v => v.TipoContrato)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(v => v.SalarioMin)
            .HasColumnType("decimal(12,2)");

        builder.Property(v => v.SalarioMax)
            .HasColumnType("decimal(12,2)");

        builder.Property(v => v.EstaActiva)
            .HasDefaultValue(true);

        builder.Property(v => v.UmbralPuntaje)
            .HasColumnName("umbral_puntaje")
            .HasColumnType("decimal(5,2)")
            .HasDefaultValue(60m);

        builder.Property(v => v.ScreeningActivo)
            .HasColumnName("screening_activo")
            .HasDefaultValue(true);

        builder.Property(v => v.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(v => v.UpdatedAt)
            .HasDefaultValueSql("NOW()");

        builder.HasOne(v => v.Empresa)
            .WithMany(e => e.Vacantes)
            .HasForeignKey(v => v.EmpresaId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(v => v.CreadoPorUsuario)
            .WithMany()
            .HasForeignKey(v => v.CreadoPor)
            .OnDelete(DeleteBehavior.SetNull);

        // Tenant scope index — accelerates the recruiter filter (empresa + creator)
        builder.HasIndex(v => new { v.EmpresaId, v.CreadoPor })
            .HasDatabaseName("ix_vacantes_empresa_creado_por");

        // Relationship: one vacante → many requisitos
        builder.HasMany(v => v.Requisitos)
            .WithOne(r => r.Vacante)
            .HasForeignKey(r => r.VacanteId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relationship: one vacante → many screening questions
        builder.HasMany(v => v.ScreeningQuestions)
            .WithOne(sq => sq.Vacante)
            .HasForeignKey(sq => sq.VacanteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}