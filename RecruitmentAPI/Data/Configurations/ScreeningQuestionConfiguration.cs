namespace RecruitmentAPI.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

public class ScreeningQuestionConfiguration : IEntityTypeConfiguration<ScreeningQuestion>
{
    public void Configure(EntityTypeBuilder<ScreeningQuestion> builder)
    {
        builder.ToTable("screening_questions");

        builder.HasKey(sq => sq.Id);

        builder.Property(sq => sq.Id)
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(sq => sq.VacanteId)
            .HasColumnName("vacante_id")
            .IsRequired();

        builder.Property(sq => sq.QuestionText)
            .HasColumnName("question_text")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(sq => sq.QuestionType)
            .HasColumnName("question_type")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(sq => sq.Options)
            .HasColumnName("options")
            .HasColumnType("jsonb");

        builder.Property(sq => sq.CorrectAnswer)
            .HasColumnName("correct_answer")
            .HasColumnType("text");

        builder.Property(sq => sq.MaxScore)
            .HasColumnName("max_score")
            .HasDefaultValue(10);

        builder.Property(sq => sq.Required)
            .HasColumnName("required")
            .HasDefaultValue(true);

        builder.Property(sq => sq.Orden)
            .HasColumnName("orden")
            .HasDefaultValue(0);

        builder.Property(sq => sq.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("now()");

        builder.HasIndex(sq => sq.VacanteId);

        builder.HasOne(sq => sq.Vacante)
            .WithMany(v => v.ScreeningQuestions)
            .HasForeignKey(sq => sq.VacanteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
