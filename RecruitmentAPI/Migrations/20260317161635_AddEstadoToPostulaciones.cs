using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddEstadoToPostulaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "postulaciones",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Nuevo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Estado",
                table: "postulaciones");
        }
    }
}
