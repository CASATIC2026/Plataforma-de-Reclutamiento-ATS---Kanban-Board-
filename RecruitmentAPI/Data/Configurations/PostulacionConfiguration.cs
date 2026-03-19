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

<<<<<<< HEAD
        builder.Property(p => p.UpdatedAt)
            .HasDefaultValueSql("NOW()");

=======
<<<<<<< HEAD
        
        builder.Property(p => p.Estado)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("Nuevo");

=======
>>>>>>> 0145ebc5970147f9474b6bd257190a89db667477
>>>>>>> 4db2853345a21fdb3ae6ce6d64588c52dee8d11f
        // Relationship: one vacante → many postulaciones
        builder.HasOne(p => p.Vacante)
            .WithMany(v => v.Postulaciones)
            .HasForeignKey(p => p.VacanteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
