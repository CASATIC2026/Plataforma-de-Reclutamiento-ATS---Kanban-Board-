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
            // Only convert if column is still varchar (no-op on fresh DBs where it starts as integer).
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_name = 'postulaciones'
                          AND column_name = 'Estado'
                          AND data_type IN ('character varying', 'text', 'character')
                    ) THEN
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
                    END IF;
                END
                $$;
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
