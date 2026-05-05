using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data.Configurations;

public class UsuarioRolConfiguration : IEntityTypeConfiguration<UsuarioRol>
{
    public void Configure(EntityTypeBuilder<UsuarioRol> builder)
    {
        builder.ToTable("usuario_roles");

        builder.HasKey(ur => ur.Id);
        builder.Property(ur => ur.Id).HasDefaultValueSql("gen_random_uuid()");

        builder.Property(ur => ur.AsignadoEn).HasDefaultValueSql("NOW()");

        builder.HasOne(ur => ur.Usuario)
            .WithMany(u => u.UsuarioRoles)
            .HasForeignKey(ur => ur.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ur => ur.Rol)
            .WithMany(r => r.UsuarioRoles)
            .HasForeignKey(ur => ur.RolId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ur => ur.Empresa)
            .WithMany(e => e.UsuarioRoles)
            .HasForeignKey(ur => ur.EmpresaId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(ur => new { ur.UsuarioId, ur.EmpresaId });
    }
}
