using System;
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
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_name='postulaciones' AND column_name='Estado'
                    ) THEN
                        ALTER TABLE postulaciones ADD ""Estado"" integer NOT NULL DEFAULT 0;
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_name='postulaciones' AND column_name='UpdatedAt'
                    ) THEN
                        ALTER TABLE postulaciones ADD ""UpdatedAt"" timestamp with time zone NOT NULL DEFAULT NOW();
                    END IF;
                END
                $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Estado",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "postulaciones");
        }
    }
}
