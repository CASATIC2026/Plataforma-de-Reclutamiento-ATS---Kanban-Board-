using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailAutomation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "email_last_error",
                table: "postulaciones",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "email_retry_count",
                table: "postulaciones",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "email_scheduled_for",
                table: "postulaciones",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "email_sent_at",
                table: "postulaciones",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "email_status",
                table: "postulaciones",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "email_type_to_send",
                table: "postulaciones",
                type: "character varying(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "email_logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    postulacion_id = table.Column<Guid>(type: "uuid", nullable: false),
                    email_type = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    subject = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    attempt_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    last_error = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_email_logs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_email_logs_postulaciones_postulacion_id",
                        column: x => x.postulacion_id,
                        principalTable: "postulaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_postulaciones_email_dispatch",
                table: "postulaciones",
                columns: new[] { "email_status", "email_scheduled_for" });

            migrationBuilder.CreateIndex(
                name: "ix_email_logs_postulacion_id",
                table: "email_logs",
                column: "postulacion_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "email_logs");

            migrationBuilder.DropIndex(
                name: "ix_postulaciones_email_dispatch",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "email_last_error",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "email_retry_count",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "email_scheduled_for",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "email_sent_at",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "email_status",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "email_type_to_send",
                table: "postulaciones");
        }
    }
}
