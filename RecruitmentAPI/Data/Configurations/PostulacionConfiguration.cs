using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data.Configurations;

public class PostulacionConfiguration : IEntityTypeConfiguration<Postulacion>
{
    public void Configure(EntityTypeBuilder<Postulacion> builder)
    {
        builder.ToTable("postulaciones");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(p => p.NombreCandidato)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Email)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Telefono)
            .HasMaxLength(50);

        builder.Property(p => p.CvFileName)
            .HasMaxLength(300);

        builder.Property(p => p.CvFilePath)
            .HasMaxLength(500);

        builder.Property(p => p.Estado)
            .HasConversion<int>()
            .HasDefaultValue(EstadoPostulacion.Nuevo);

        builder.Property(p => p.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(p => p.UpdatedAt)
            .HasDefaultValueSql("NOW()");

        // Relationship: one vacante → many postulaciones
        builder.HasOne(p => p.Vacante)
            .WithMany(v => v.Postulaciones)
            .HasForeignKey(p => p.VacanteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
