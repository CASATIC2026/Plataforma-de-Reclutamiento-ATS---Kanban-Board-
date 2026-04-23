using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixEstadoColumnType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the varchar default, convert column to integer, restore integer default.
            migrationBuilder.Sql(@"
                ALTER TABLE postulaciones ALTER COLUMN ""Estado"" DROP DEFAULT;
                ALTER TABLE postulaciones
                    ALTER COLUMN ""Estado"" TYPE integer
                    USING CASE ""Estado""
                        WHEN 'Entrevista'    THEN 1
                        WHEN 'PruebaTecnica' THEN 2
                        WHEN 'Oferta'        THEN 3
                        ELSE 0
                    END;
                ALTER TABLE postulaciones ALTER COLUMN ""Estado"" SET DEFAULT 0;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE postulaciones ALTER COLUMN ""Estado"" DROP DEFAULT;
                ALTER TABLE postulaciones
                    ALTER COLUMN ""Estado"" TYPE character varying
                    USING CASE ""Estado""
                        WHEN 1 THEN 'Entrevista'
                        WHEN 2 THEN 'PruebaTecnica'
                        WHEN 3 THEN 'Oferta'
                        ELSE 'Nuevo'
                    END;
                ALTER TABLE postulaciones ALTER COLUMN ""Estado"" SET DEFAULT 'Nuevo';
            ");
        }
    }
}
