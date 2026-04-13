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

        // Relationship: one vacante → many requisitos
        builder.HasMany(v => v.Requisitos)
            .WithOne(r => r.Vacante)
            .HasForeignKey(r => r.VacanteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}