using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data.Configurations;

public class FeatureFlagConfiguration : IEntityTypeConfiguration<FeatureFlag>
{
    public void Configure(EntityTypeBuilder<FeatureFlag> builder)
    {
        builder.ToTable("feature_flags");

        builder.HasKey(f => f.Id);
        builder.Property(f => f.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(f => f.Nombre).IsRequired().HasMaxLength(100);
        builder.Property(f => f.Descripcion).HasMaxLength(300);
        builder.Property(f => f.EstaActivo).HasDefaultValue(false);
        builder.Property(f => f.ModifiedAt).HasDefaultValueSql("NOW()");

        builder.HasIndex(f => f.Nombre).IsUnique();
    }
}
