using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyScopeIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_vacantes_EmpresaId",
                table: "vacantes");

            migrationBuilder.CreateIndex(
                name: "ix_vacantes_empresa_creado_por",
                table: "vacantes",
                columns: new[] { "EmpresaId", "CreadoPor" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_vacantes_empresa_creado_por",
                table: "vacantes");

            migrationBuilder.CreateIndex(
                name: "IX_vacantes_EmpresaId",
                table: "vacantes",
                column: "EmpresaId");
        }
    }
}
