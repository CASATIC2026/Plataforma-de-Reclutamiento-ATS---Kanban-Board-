namespace RecruitmentAPI.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

public class CandidateScreeningResponseConfiguration : IEntityTypeConfiguration<CandidateScreeningResponse>
{
    public void Configure(EntityTypeBuilder<CandidateScreeningResponse> builder)
    {
        builder.ToTable("candidate_screening_responses");

        builder.HasKey(csr => csr.Id);

        builder.Property(csr => csr.Id)
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(csr => csr.PostulacionId)
            .HasColumnName("postulacion_id")
            .IsRequired();

        builder.Property(csr => csr.QuestionId)
            .HasColumnName("question_id")
            .IsRequired();

        builder.Property(csr => csr.ResponseText)
            .HasColumnName("response_text")
            .HasColumnType("text");

        builder.Property(csr => csr.AutoScore)
            .HasColumnName("auto_score")
            .HasPrecision(5, 2);

        builder.Property(csr => csr.ReviewerScore)
            .HasColumnName("reviewer_score")
            .HasPrecision(5, 2);

        builder.Property(csr => csr.ReviewedBy)
            .HasColumnName("reviewed_by");

        builder.Property(csr => csr.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("now()");

        builder.HasIndex(csr => new { csr.PostulacionId, csr.QuestionId })
            .IsUnique();

        builder.HasOne(csr => csr.Postulacion)
            .WithMany(p => p.ScreeningResponses)
            .HasForeignKey(csr => csr.PostulacionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(csr => csr.Question)
            .WithMany()
            .HasForeignKey(csr => csr.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
