namespace RecruitmentAPI.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

public class CandidateSkillConfiguration : IEntityTypeConfiguration<CandidateSkill>
{
    public void Configure(EntityTypeBuilder<CandidateSkill> builder)
    {
        builder.ToTable("candidate_skills");

        builder.HasKey(cs => cs.Id);

        builder.Property(cs => cs.Id)
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(cs => cs.PostulacionId)
            .HasColumnName("postulacion_id")
            .IsRequired();

        builder.Property(cs => cs.SkillName)
            .HasColumnName("skill_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(cs => cs.SkillCategory)
            .HasColumnName("skill_category")
            .HasMaxLength(50);

        builder.Property(cs => cs.ProficiencyLevel)
            .HasColumnName("proficiency_level")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(cs => cs.YearsExperience)
            .HasColumnName("years_experience")
            .HasPrecision(4, 1);

        builder.Property(cs => cs.IsVerified)
            .HasColumnName("is_verified")
            .HasDefaultValue(false);

        builder.Property(cs => cs.Source)
            .HasColumnName("source")
            .HasMaxLength(30)
            .HasDefaultValue("self_reported");

        builder.Property(cs => cs.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("now()");

        builder.HasIndex(cs => cs.PostulacionId);
        builder.HasIndex(cs => cs.SkillName);

        builder.HasOne(cs => cs.Postulacion)
            .WithMany(p => p.CandidateSkills)
            .HasForeignKey(cs => cs.PostulacionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
