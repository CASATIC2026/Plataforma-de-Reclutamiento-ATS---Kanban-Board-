using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data.Configurations;

public class RolConfiguration : IEntityTypeConfiguration<Rol>
{
    public void Configure(EntityTypeBuilder<Rol> builder)
    {
        builder.ToTable("roles");

        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(r => r.Nombre).IsRequired().HasMaxLength(50);
        builder.Property(r => r.Ambito).IsRequired().HasMaxLength(20).HasDefaultValue("app_tier");
        builder.Property(r => r.EsInmutable).HasDefaultValue(false);
        builder.Property(r => r.CreatedAt).HasDefaultValueSql("NOW()");

        builder.HasIndex(r => r.Nombre).IsUnique();
    }
}
