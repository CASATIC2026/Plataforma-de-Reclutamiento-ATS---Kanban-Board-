using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data.Configurations;

public class RequisitoConfiguration : IEntityTypeConfiguration<Requisito>
{
    public void Configure(EntityTypeBuilder<Requisito> builder)
    {
        builder.ToTable("requisitos");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(r => r.Nombre)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(r => r.CreatedAt)
            .HasDefaultValueSql("NOW()");
    }
}