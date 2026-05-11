using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data.Configurations;

public class EmailLogConfiguration : IEntityTypeConfiguration<EmailLog>
{
    public void Configure(EntityTypeBuilder<EmailLog> builder)
    {
        builder.ToTable("email_logs");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.PostulacionId)
            .HasColumnName("postulacion_id")
            .IsRequired();

        builder.Property(e => e.EmailType)
            .HasColumnName("email_type")
            .HasMaxLength(40)
            .IsRequired();

        builder.Property(e => e.Subject)
            .HasColumnName("subject")
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.SentAt)
            .HasColumnName("sent_at");

        builder.Property(e => e.AttemptCount)
            .HasColumnName("attempt_count")
            .HasDefaultValue(1);

        builder.Property(e => e.LastError)
            .HasColumnName("last_error")
            .HasColumnType("text");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("NOW()");

        builder.HasIndex(e => e.PostulacionId)
            .HasDatabaseName("ix_email_logs_postulacion_id");
    }
}
