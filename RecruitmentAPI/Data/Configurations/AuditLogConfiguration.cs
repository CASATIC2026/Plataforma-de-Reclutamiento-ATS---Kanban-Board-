using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_log");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(a => a.Accion).IsRequired().HasMaxLength(200);
        builder.Property(a => a.Recurso).HasMaxLength(200);
        builder.Property(a => a.Resultado).IsRequired().HasMaxLength(20).HasDefaultValue("Allowed");
        builder.Property(a => a.Ip).HasMaxLength(50);
        builder.Property(a => a.Detalles).HasColumnType("text");
        builder.Property(a => a.CreatedAt).HasDefaultValueSql("NOW()");

        builder.HasOne(a => a.Usuario)
            .WithMany()
            .HasForeignKey(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(a => new { a.UsuarioId, a.CreatedAt });
        builder.HasIndex(a => a.CreatedAt);
    }
}
