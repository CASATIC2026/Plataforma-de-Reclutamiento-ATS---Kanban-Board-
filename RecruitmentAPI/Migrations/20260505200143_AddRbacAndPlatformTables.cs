using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecruitmentAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddRbacAndPlatformTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreadoPor",
                table: "vacantes",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EmpresaId",
                table: "vacantes",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EmpresaId",
                table: "usuarios",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UsuarioId",
                table: "postulaciones",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "audit_log",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: true),
                    Accion = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Recurso = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Resultado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Allowed"),
                    Ip = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Detalles = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_log", x => x.Id);
                    table.ForeignKey(
                        name: "FK_audit_log_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "deployment_logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Version = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DisparadoPor = table.Column<Guid>(type: "uuid", nullable: true),
                    Estado = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false, defaultValue: "Running"),
                    DuracionSegundos = table.Column<int>(type: "integer", nullable: true),
                    Notas = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_deployment_logs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_deployment_logs_usuarios_DisparadoPor",
                        column: x => x.DisparadoPor,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "empresas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Dominio = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "activa"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_empresas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "feature_flags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    EstaActivo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    ModificadoPor = table.Column<Guid>(type: "uuid", nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_feature_flags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "permisos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Categoria = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permisos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Nombre = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Ambito = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "app_tier"),
                    EsInmutable = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "rol_permisos",
                columns: table => new
                {
                    RolId = table.Column<Guid>(type: "uuid", nullable: false),
                    PermisoId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rol_permisos", x => new { x.RolId, x.PermisoId });
                    table.ForeignKey(
                        name: "FK_rol_permisos_permisos_PermisoId",
                        column: x => x.PermisoId,
                        principalTable: "permisos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rol_permisos_roles_RolId",
                        column: x => x.RolId,
                        principalTable: "roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "usuario_roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    RolId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmpresaId = table.Column<Guid>(type: "uuid", nullable: true),
                    AsignadoPor = table.Column<Guid>(type: "uuid", nullable: true),
                    AsignadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuario_roles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_usuario_roles_empresas_EmpresaId",
                        column: x => x.EmpresaId,
                        principalTable: "empresas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_usuario_roles_roles_RolId",
                        column: x => x.RolId,
                        principalTable: "roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_usuario_roles_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_vacantes_CreadoPor",
                table: "vacantes",
                column: "CreadoPor");

            migrationBuilder.CreateIndex(
                name: "IX_vacantes_EmpresaId",
                table: "vacantes",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_EmpresaId",
                table: "usuarios",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_postulaciones_UsuarioId",
                table: "postulaciones",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_audit_log_CreatedAt",
                table: "audit_log",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_audit_log_UsuarioId_CreatedAt",
                table: "audit_log",
                columns: new[] { "UsuarioId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_deployment_logs_CreatedAt",
                table: "deployment_logs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_deployment_logs_DisparadoPor",
                table: "deployment_logs",
                column: "DisparadoPor");

            migrationBuilder.CreateIndex(
                name: "IX_empresas_Dominio",
                table: "empresas",
                column: "Dominio",
                unique: true,
                filter: "\"Dominio\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_feature_flags_Nombre",
                table: "feature_flags",
                column: "Nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_permisos_Nombre",
                table: "permisos",
                column: "Nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_rol_permisos_PermisoId",
                table: "rol_permisos",
                column: "PermisoId");

            migrationBuilder.CreateIndex(
                name: "IX_roles_Nombre",
                table: "roles",
                column: "Nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuario_roles_EmpresaId",
                table: "usuario_roles",
                column: "EmpresaId");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_roles_RolId",
                table: "usuario_roles",
                column: "RolId");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_roles_UsuarioId_EmpresaId",
                table: "usuario_roles",
                columns: new[] { "UsuarioId", "EmpresaId" });

            migrationBuilder.AddForeignKey(
                name: "FK_postulaciones_usuarios_UsuarioId",
                table: "postulaciones",
                column: "UsuarioId",
                principalTable: "usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_usuarios_empresas_EmpresaId",
                table: "usuarios",
                column: "EmpresaId",
                principalTable: "empresas",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_vacantes_empresas_EmpresaId",
                table: "vacantes",
                column: "EmpresaId",
                principalTable: "empresas",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_vacantes_usuarios_CreadoPor",
                table: "vacantes",
                column: "CreadoPor",
                principalTable: "usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_postulaciones_usuarios_UsuarioId",
                table: "postulaciones");

            migrationBuilder.DropForeignKey(
                name: "FK_usuarios_empresas_EmpresaId",
                table: "usuarios");

            migrationBuilder.DropForeignKey(
                name: "FK_vacantes_empresas_EmpresaId",
                table: "vacantes");

            migrationBuilder.DropForeignKey(
                name: "FK_vacantes_usuarios_CreadoPor",
                table: "vacantes");

            migrationBuilder.DropTable(
                name: "audit_log");

            migrationBuilder.DropTable(
                name: "deployment_logs");

            migrationBuilder.DropTable(
                name: "feature_flags");

            migrationBuilder.DropTable(
                name: "rol_permisos");

            migrationBuilder.DropTable(
                name: "usuario_roles");

            migrationBuilder.DropTable(
                name: "permisos");

            migrationBuilder.DropTable(
                name: "empresas");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropIndex(
                name: "IX_vacantes_CreadoPor",
                table: "vacantes");

            migrationBuilder.DropIndex(
                name: "IX_vacantes_EmpresaId",
                table: "vacantes");

            migrationBuilder.DropIndex(
                name: "IX_usuarios_EmpresaId",
                table: "usuarios");

            migrationBuilder.DropIndex(
                name: "IX_postulaciones_UsuarioId",
                table: "postulaciones");

            migrationBuilder.DropColumn(
                name: "CreadoPor",
                table: "vacantes");

            migrationBuilder.DropColumn(
                name: "EmpresaId",
                table: "vacantes");

            migrationBuilder.DropColumn(
                name: "EmpresaId",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "postulaciones");
        }
    }
}
