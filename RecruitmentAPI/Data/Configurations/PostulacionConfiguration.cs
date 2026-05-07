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

        builder.Property(p => p.Puntaje)
            .HasColumnName("puntaje")
            .HasColumnType("decimal(5,2)");

        builder.Property(p => p.PuntajeDetalle)
            .HasColumnName("puntaje_detalle")
            .HasColumnType("text");

        builder.Property(p => p.EmailConfirmacionEnviado)
            .HasColumnName("email_confirmacion_enviado")
            .HasDefaultValue(false);

        builder.Property(p => p.EmailResultadoEnviado)
            .HasColumnName("email_resultado_enviado")
            .HasDefaultValue(false);

        builder.Property(p => p.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(p => p.UpdatedAt)
            .HasDefaultValueSql("NOW()");

        // Structured application data columns
        builder.Property(p => p.ImpactStatement)
            .HasColumnName("impact_statement")
            .HasColumnType("text");

        builder.Property(p => p.SoftSkills)
            .HasColumnName("soft_skills")
            .HasColumnType("jsonb");

        builder.Property(p => p.ApplicationSource)
            .HasColumnName("application_source")
            .HasMaxLength(50)
            .HasDefaultValue("direct");

        builder.Property(p => p.CompletionTimeSeconds)
            .HasColumnName("completion_time_seconds");

        // Legal/consent columns
        builder.Property(p => p.ConsentGdpr)
            .HasColumnName("consent_gdpr")
            .HasDefaultValue(false);

        builder.Property(p => p.ConsentMarketing)
            .HasColumnName("consent_marketing")
            .HasDefaultValue(false);

        builder.Property(p => p.AttestedTruth)
            .HasColumnName("attested_truth")
            .HasDefaultValue(false);

        builder.Property(p => p.AttestedSignature)
            .HasColumnName("attested_signature")
            .HasMaxLength(200);

        // Relationship: one vacante → many postulaciones
        builder.HasOne(p => p.Vacante)
            .WithMany(v => v.Postulaciones)
            .HasForeignKey(p => p.VacanteId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Usuario)
            .WithMany()
            .HasForeignKey(p => p.UsuarioId)
            .OnDelete(DeleteBehavior.SetNull);

        // Relationships for structured application data
        builder.HasMany(p => p.CandidateSkills)
            .WithOne(cs => cs.Postulacion)
            .HasForeignKey(cs => cs.PostulacionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Availabilities)
            .WithOne(ca => ca.Postulacion)
            .HasForeignKey(ca => ca.PostulacionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.ScreeningResponses)
            .WithOne(csr => csr.Postulacion)
            .HasForeignKey(csr => csr.PostulacionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
