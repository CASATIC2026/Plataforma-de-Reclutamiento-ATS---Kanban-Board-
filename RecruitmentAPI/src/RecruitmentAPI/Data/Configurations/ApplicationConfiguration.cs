using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Entities;

namespace RecruitmentAPI.Data.Configurations;

public class ApplicationConfiguration : IEntityTypeConfiguration<Application>
{
    public void Configure(EntityTypeBuilder<Application> builder)
    {
        builder.ToTable("Applications");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.CvFileName).HasMaxLength(255).IsRequired();
        builder.Property(a => a.CvFilePath).HasMaxLength(500).IsRequired();
        builder.Property(a => a.CvTextContent).HasColumnType("TEXT");
        builder.Property(a => a.CoverLetter).HasColumnType("TEXT");

        // Unique: one candidate per vacancy
        builder.HasIndex(a => new { a.VacancyId, a.CandidateId }).IsUnique();

        // Composite index for Kanban ordering
        builder.HasIndex(a => new { a.VacancyId, a.KanbanColumnId, a.SortOrderInColumn });

        // Relationships
        builder.HasOne(a => a.Vacancy)
               .WithMany(v => v.Applications)
               .HasForeignKey(a => a.VacancyId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Candidate)
               .WithMany(c => c.Applications)
               .HasForeignKey(a => a.CandidateId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.KanbanColumn)
               .WithMany(kc => kc.Applications)
               .HasForeignKey(a => a.KanbanColumnId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}