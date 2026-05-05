using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data.Configurations;

public class DeploymentLogConfiguration : IEntityTypeConfiguration<DeploymentLog>
{
    public void Configure(EntityTypeBuilder<DeploymentLog> builder)
    {
        builder.ToTable("deployment_logs");

        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(d => d.Version).IsRequired().HasMaxLength(50);
        builder.Property(d => d.Estado).IsRequired().HasMaxLength(30).HasDefaultValue("Running");
        builder.Property(d => d.Notas).HasColumnType("text");
        builder.Property(d => d.CreatedAt).HasDefaultValueSql("NOW()");

        builder.HasOne(d => d.DisparadoPorUsuario)
            .WithMany()
            .HasForeignKey(d => d.DisparadoPor)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(d => d.CreatedAt);
    }
}
