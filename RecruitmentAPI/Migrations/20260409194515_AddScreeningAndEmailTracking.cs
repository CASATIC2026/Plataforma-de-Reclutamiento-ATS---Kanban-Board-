using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddScreeningAndEmailTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "screening_activo",
                table: "vacantes",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<decimal>(
                name: "umbral_puntaje",
                table: "vacantes",
                type: "numeric(5,2)",
                nullable: false,
                defaultValue: 60m);

            migrationBuilder.AddColumn<bool>(
                name: "email_confirmacion_enviado",
                table: "postulaciones",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "email_resultado_enviado",
                table: "postulaciones",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "puntaje",
                table: "postulaciones",
                type: "numeric(5,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "puntaje_detalle",
                table: "postulaciones",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "screening_activo",
                table: "vacantes");

            migrationBuilder.DropColumn(
                name: "umbral_puntaje",
                table: "vacantes");

            migrationBuilder.DropColumn(
                name: "email_confirmacion_enviado",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "email_resultado_enviado",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "puntaje",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "puntaje_detalle",
                table: "postulaciones");
        }
    }
}
