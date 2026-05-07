using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddStructuredApplicationData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_empresas_Dominio",
                table: "empresas");

            migrationBuilder.AddColumn<string>(
                name: "application_source",
                table: "postulaciones",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                defaultValue: "direct");

            migrationBuilder.AddColumn<string>(
                name: "attested_signature",
                table: "postulaciones",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "attested_truth",
                table: "postulaciones",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "completion_time_seconds",
                table: "postulaciones",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "consent_gdpr",
                table: "postulaciones",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "consent_marketing",
                table: "postulaciones",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "impact_statement",
                table: "postulaciones",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "soft_skills",
                table: "postulaciones",
                type: "jsonb",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "candidate_availability",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    postulacion_id = table.Column<Guid>(type: "uuid", nullable: false),
                    day_of_week = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    time_slot = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    is_available = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_candidate_availability", x => x.Id);
                    table.ForeignKey(
                        name: "FK_candidate_availability_postulaciones_postulacion_id",
                        column: x => x.postulacion_id,
                        principalTable: "postulaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "candidate_skills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    postulacion_id = table.Column<Guid>(type: "uuid", nullable: false),
                    skill_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    skill_category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    proficiency_level = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    years_experience = table.Column<decimal>(type: "numeric(4,1)", precision: 4, scale: 1, nullable: true),
                    is_verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    source = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false, defaultValue: "self_reported"),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_candidate_skills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_candidate_skills_postulaciones_postulacion_id",
                        column: x => x.postulacion_id,
                        principalTable: "postulaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "screening_questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    vacante_id = table.Column<Guid>(type: "uuid", nullable: false),
                    question_text = table.Column<string>(type: "text", nullable: false),
                    question_type = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    options = table.Column<string>(type: "jsonb", nullable: true),
                    correct_answer = table.Column<string>(type: "text", nullable: true),
                    max_score = table.Column<int>(type: "integer", nullable: false, defaultValue: 10),
                    required = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    orden = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_screening_questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_screening_questions_vacantes_vacante_id",
                        column: x => x.vacante_id,
                        principalTable: "vacantes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "candidate_screening_responses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    postulacion_id = table.Column<Guid>(type: "uuid", nullable: false),
                    question_id = table.Column<Guid>(type: "uuid", nullable: false),
                    response_text = table.Column<string>(type: "text", nullable: true),
                    auto_score = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    reviewer_score = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    reviewed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_candidate_screening_responses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_candidate_screening_responses_postulaciones_postulacion_id",
                        column: x => x.postulacion_id,
                        principalTable: "postulaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_candidate_screening_responses_screening_questions_question_~",
                        column: x => x.question_id,
                        principalTable: "screening_questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_empresas_Dominio",
                table: "empresas",
                column: "Dominio",
                unique: true,
                filter: "\"Dominio\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_candidate_availability_postulacion_id_day_of_week_time_slot",
                table: "candidate_availability",
                columns: new[] { "postulacion_id", "day_of_week", "time_slot" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_candidate_screening_responses_postulacion_id_question_id",
                table: "candidate_screening_responses",
                columns: new[] { "postulacion_id", "question_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_candidate_screening_responses_question_id",
                table: "candidate_screening_responses",
                column: "question_id");

            migrationBuilder.CreateIndex(
                name: "IX_candidate_skills_postulacion_id",
                table: "candidate_skills",
                column: "postulacion_id");

            migrationBuilder.CreateIndex(
                name: "IX_candidate_skills_skill_name",
                table: "candidate_skills",
                column: "skill_name");

            migrationBuilder.CreateIndex(
                name: "IX_screening_questions_vacante_id",
                table: "screening_questions",
                column: "vacante_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "candidate_availability");

            migrationBuilder.DropTable(
                name: "candidate_screening_responses");

            migrationBuilder.DropTable(
                name: "candidate_skills");

            migrationBuilder.DropTable(
                name: "screening_questions");

            migrationBuilder.DropIndex(
                name: "IX_empresas_Dominio",
                table: "empresas");

            migrationBuilder.DropColumn(
                name: "application_source",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "attested_signature",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "attested_truth",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "completion_time_seconds",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "consent_gdpr",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "consent_marketing",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "impact_statement",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "soft_skills",
                table: "postulaciones");

            migrationBuilder.CreateIndex(
                name: "IX_empresas_Dominio",
                table: "empresas",
                column: "Dominio",
                unique: true,
                filter: "dominio IS NOT NULL");
        }
    }
}
