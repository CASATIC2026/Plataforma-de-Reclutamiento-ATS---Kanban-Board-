namespace RecruitmentAPI.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

public class CandidateAvailabilityConfiguration : IEntityTypeConfiguration<CandidateAvailability>
{
    public void Configure(EntityTypeBuilder<CandidateAvailability> builder)
    {
        builder.ToTable("candidate_availability");

        builder.HasKey(ca => ca.Id);

        builder.Property(ca => ca.Id)
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(ca => ca.PostulacionId)
            .HasColumnName("postulacion_id")
            .IsRequired();

        builder.Property(ca => ca.DayOfWeek)
            .HasColumnName("day_of_week")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(ca => ca.TimeSlot)
            .HasColumnName("time_slot")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(ca => ca.IsAvailable)
            .HasColumnName("is_available")
            .HasDefaultValue(false);

        builder.Property(ca => ca.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("now()");

        builder.HasIndex(ca => new { ca.PostulacionId, ca.DayOfWeek, ca.TimeSlot })
            .IsUnique();

        builder.HasOne(ca => ca.Postulacion)
            .WithMany(p => p.Availabilities)
            .HasForeignKey(ca => ca.PostulacionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
