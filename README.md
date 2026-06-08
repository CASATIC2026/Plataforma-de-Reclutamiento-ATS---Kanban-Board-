# Talentify sv — Plataforma ATS de Reclutamiento

Sistema integral de seguimiento de candidatos (ATS) full-stack para el mercado salvadoreño: bolsa de empleo pública, portal de reclutadores, pipeline Kanban, panel de analítica y administración multi-empresa con RBAC.

**Última actualización:** junio 2026 — sincronización del nuevo frontend (UI de marketing, auth rediseñada, temas público/admin).

---

## Novedades (junio 2026)

Actualización del frontend integrada en la rama `development-BM`:

- **Sitio público ampliado:** páginas de empresas, recursos, precios, contacto y legales (términos / privacidad).
- **Nueva capa visual pública:** `LandingNav`, `LandingFooter`, hero, filtros rápidos y tarjetas de empleo modulares.
- **Auth rediseñada:** formularios separados de login/registro con `AuthLayout`, barra de fortaleza de contraseña y componentes reutilizables.
- **Dashboard de candidato renovado:** vista desktop/móvil con tarjetas de progreso y detalle de postulaciones.
- **Temas CSS dedicados:** `public-theme.css` (marketing turquesa oscuro) y `admin-theme.css` (panel interno).
- **Dependencia nueva:** `lucide-react` para iconografía en landing y filtros.
- **Ruta legacy conservada:** `/jobs` sigue apuntando a `PublicVacantesPage` (bolsa clásica con polling 30 s).
- **Backend:** cabecera `Server` de Kestrel deshabilitada (`AddServerHeader = false`).

---

## Características

### Autenticación y autorización

- JWT Bearer con hash BCrypt; expiración de 8 horas.
- Registro público (nombre, email, contraseña, carrera) → rol General/Candidate.
- UI de auth en dos paneles con animaciones y diseño moderno.
- Operaciones de escritura protegidas; lectura pública en endpoints abiertos.
- Redirección automática a `/login` en 401 con limpieza de token.
- RBAC: **8 roles**, **41 permisos**, alcance multi-empresa vía `usuario_roles`.

### Bolsa de empleo pública

**Landing principal (`/`)**

- Búsqueda, filtros por departamento (14 departamentos de El Salvador) y tipo de contrato (7 tipos).
- Paginación: 6 vacantes por página.
- Etiquetas dinámicas con las 8 habilidades más frecuentes.
- Badge «Nueva» (🔥) para vacantes de los últimos 2 días.
- Diseño responsive probado de 300 px a 900 px+.

**Formulario de postulación en 4 pasos** (modal, sin cambio de página):

1. Datos básicos (nombre, email, teléfono).
2. Habilidades técnicas (nivel Básico→Experto + años), soft skills (máx. 5), declaración de impacto (30–500 caracteres).
3. CV drag-and-drop (PDF/DOC/DOCX, 5 MB), preguntas de screening por vacante, grilla de disponibilidad (Lun–Dom × Mañana/Tarde/Noche).
4. Resumen, consentimiento GDPR, declaración de veracidad y firma digital (debe coincidir con el nombre).

- Preguntas de screening desde `GET /api/vacantes/{id}/screening-questions`.
- Validación por paso con errores inline.

**Páginas de marketing** (nuevo)

| Ruta | Contenido |
|---|---|
| `/empresas` | Propuesta de valor para empresas contratantes |
| `/recursos` | Artículos y guías |
| `/precios` | Planes, FAQ y toggle de facturación |
| `/contacto` | Formulario de contacto |
| `/legal/terminos` | Términos de servicio |
| `/legal/privacidad` | Política de privacidad |

### Portal de reclutadores (protegido)

- CRUD de vacantes con modal, estadísticas y requisitos dinámicos.
- Configuración de screening por vacante (toggle, umbral 0–100, default 60).
- Kanban operativo (`/admin/kanban`): todos los candidatos, filtros, polling 30 s, bandeja de rechazados.
- Kanban por vacante (`/admin/vacantes/:id/aplicantes`).
- Auto-puntuación en tres señales: requisitos 60 %, ubicación 25 %, completitud 15 %.
- Badges de puntaje: verde ≥75, ámbar 60–74, rojo <60.
- Toasts apilables (máx. 10, auto-cierre 3 s).
- Modal de perfil con CV embebido (PDF) y notas internas con guardado automático (1,5 s debounce).

### Panel de candidato (`/dashboard`)

- Vista personal de postulaciones propias (`applications:read_own`).
- Layout responsive desktop/móvil con tarjetas de progreso y detalle.

### Analítica y plataforma

- `/admin/analytics` — embudo, time-to-hire, fuentes, actividad del equipo.
- `/platform/*` — empresas, usuarios, roles, auditoría, configuración, operaciones (deploy, flags, logs).

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | .NET 8, C#, Entity Framework Core 8 |
| Base de datos | PostgreSQL (puerto 5432 en Ubuntu) |
| API | Swagger (solo desarrollo) |
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7 |
| HTTP | Axios con interceptor JWT |
| Estado | React Context (`AuthContext`) |
| Drag & Drop | HTML5 nativo + `@dnd-kit` |
| Iconos | `lucide-react` |
| Auth | JWT Bearer 8.0.11 + BCrypt.Net-Next 4.0.3 |
| Email | MailKit + `EmailDispatcherService` (background) |

---

## Estructura del proyecto

```
Plataforma-de-Reclutamiento-ATS---Kanban-Board-/
├── RecruitmentAPI/              # API REST .NET 8
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/ + DTOs/
│   ├── Data/ + Migrations/
│   └── Storage/CVs/             # CVs subidos (nombre UUID)
└── recruitment-frontend/        # SPA React
    └── src/
        ├── pages/               # Rutas (landing, admin, platform, legal…)
        ├── components/
        │   ├── landing/         # Nav, footer, hero, job cards
        │   ├── auth/            # Login, registro, tabs
        │   ├── dashboard/       # Panel candidato
        │   ├── legal/           # Contenido legal
        │   ├── planes/          # Precios y FAQ
        │   ├── kanban/          # Kanban HTML5 completo
        │   └── postulaciones/   # ApplyModal 4 pasos
        ├── layouts/             # PublicLayout, MainLayout, PlatformLayout
        ├── api/                 # Clientes Axios (15 módulos)
        ├── context/             # AuthContext
        ├── data/                # Contenido estático de marketing
        ├── styles/              # talentbridge, public-theme, admin-theme
        └── hooks/               # usePermission, useRechazadosRestore
```

---

## Rutas del frontend

| Ruta | Página | Acceso | Permiso |
|---|---|---|---|
| `/` | NewLandingPage | Público | — |
| `/jobs` | PublicVacantesPage | Público | — (legacy, polling 30 s) |
| `/empresas` | EmpresasPage | Público | — |
| `/recursos` | RecursosPage | Público | — |
| `/precios` | PreciosPage | Público | — |
| `/contacto` | ContactoPage | Público | — |
| `/legal/terminos` | LegalTerminosPage | Público | — |
| `/legal/privacidad` | LegalPrivacidadPage | Público | — |
| `/login` | AuthPage | Público | — |
| `/dashboard` | CandidateDashboard | Auth | `applications:read_own` |
| `/admin/dashboard` | RecruiterDashboard | Auth | `jobs:create` |
| `/admin/vacantes` | AdminVacantesPage | Auth | `jobs:create` |
| `/admin/vacantes/:id/aplicantes` | VacanteAplicantesPage | Auth | `jobs:read_all` |
| `/admin/kanban` | KanbanAllPage | Auth | `jobs:read_all` |
| `/admin/analytics` | ManagerAnalytics | Auth | `reports:read` |
| `/admin/usuarios` | AdminUsuariosPage | Auth | rol Administrador |
| `/platform` | PlatformOverview | Auth | `platform:access` |
| `/platform/companies` | PlatformCompanies | Auth | `companies:read` |
| `/platform/users` | PlatformUsers | Auth | `users:read` |
| `/platform/roles` | PlatformRoles | Auth | `roles:read` |
| `/platform/audit` | PlatformAudit | Auth | `audit:read` |
| `/platform/config` | PlatformConfig | Auth | `platform:configure` |
| `/platform/ops` | PlatformOps | Auth | `deployment:trigger` u ops |
| `*` | NotFoundPage | Público | — |

---

## RBAC (resumen)

| Rol | Nivel | Alcance | Uso principal |
|---|---|---|---|
| Candidate | App | Empresa propia | Ver postulaciones propias |
| Recruiter | App | Empresa | Crear/gestionar vacantes propias |
| Manager | App | Empresa | Aprobar, ver todas las vacantes, analítica |
| Admin | Plataforma | Global | Usuarios, empresas, auditoría |
| Owner | Plataforma | Global | Control total (rol inmutable) |
| Developer / DevOps / DBA | Plataforma | Global | Deploy, infra, logs |

**Frontend:** `usePermission()` + `<Can>` + `ProtectedRoute requiredPermission`.

**Crítico:** el `company_id` del JWT proviene de `usuario_roles.EmpresaId`, no de `usuarios.EmpresaId` (columna sin escritura activa).

---

## Desarrollo local (Ubuntu 26.04 LTS)

### Requisitos

```bash
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib

sudo snap install dotnet-sdk --classic --channel=8.0
sudo snap alias dotnet-sdk.dotnet dotnet
dotnet tool install --global dotnet-ef --version 8.0.11

echo 'export DOTNET_ROOT=/snap/dotnet-sdk/current' >> ~/.bashrc
echo 'export PATH="$HOME/.dotnet/tools:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Base de datos

```bash
sudo -u postgres psql -c "CREATE USER recruitment_user WITH PASSWORD 'Recruitment2025!';"
sudo -u postgres psql -c "CREATE DATABASE recruitment_db OWNER recruitment_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE recruitment_db TO recruitment_user;"
```

### Variables de entorno

**`RecruitmentAPI/.env`**

```
DB_CONNECTION=Host=localhost;Port=5432;Database=recruitment_db;Username=recruitment_user;Password=Recruitment2025!
JWT_KEY=TalentBridge_SuperSecretKey_2025_MustBeAtLeast32Chars!
SEED_ADMIN_PASSWORD=Admin123!
ALLOWED_ORIGIN=http://localhost:5173,http://192.168.1.40:5173
```

**`recruitment-frontend/.env`**

```
# Dejar VITE_API_URL sin definir en desarrollo/LAN.
# El proxy de Vite redirige /api → localhost:5223
```

> No definir `VITE_API_URL=http://localhost:5223` en LAN: el bundle intentará llamar al localhost de cada dispositivo cliente.

### Migraciones y arranque

```bash
export DOTNET_ROOT=/snap/dotnet-sdk/current
export PATH="$HOME/.dotnet/tools:$PATH"
cd RecruitmentAPI && dotnet-ef database update

# Terminal 1 — API
cd RecruitmentAPI && dotnet run
# → http://localhost:5223  |  Swagger: /swagger

# Terminal 2 — Frontend
cd recruitment-frontend && npm install && npm run dev
# → http://localhost:5173  |  LAN: http://<ip-servidor>:5173
```

### Acceso en red local

- Vite escucha en `0.0.0.0:5173` con `allowedHosts: true`.
- Backend en `0.0.0.0:5223`.
- CORS vía `ALLOWED_ORIGIN` (orígenes separados por coma).
- Firewall: `sudo ufw allow 5223/tcp && sudo ufw allow 5173/tcp`.

---

## Arquitectura

```
Backend:
  Controller ([Authorize] + permiso) → Service → Repository → EF Core → PostgreSQL

Frontend:
  AuthProvider → ProtectedRoute → Page/Component
      → axiosInstance (/api + JWT) → proxy Vite → API
```

Layouts:

- **PublicLayout** — `LandingNav` + `LandingFooter` + tema `.public-theme`
- **MainLayout** — navbar admin (vacantes, kanban, analítica)
- **PlatformLayout** — panel multi-empresa

---

## Sistema de diseño

1. Tokens Tailwind 4 en `@theme` (`src/index.css`): `bg-navy`, `text-accent`, etc.
2. Clases semánticas en `talentbridge.css` (botones, cards, navbar).
3. Tema público en `public-theme.css` (turquesa `#40e0d0`, fondo `#071326`).
4. Tema admin en `admin-theme.css`.
5. Estilos inline solo para valores calculados en runtime (p. ej. Kanban).

**Tipografía:** Playwrite IE (marca), Playfair Display (títulos), DM Sans (cuerpo).

---

## Diseño responsive (landing)

| Breakpoint | Comportamiento |
|---|---|
| 900 px+ | Barra de búsqueda horizontal, grid 3 columnas |
| 680–900 px | Layout compacto, tipografía reducida |
| 500–680 px | Búsqueda vertical, grid 1 columna |
| 300–500 px | Padding mínimo, controles compactos |

---

## Email y screening

**EmailDispatcherService** — polling cada 15 s: pending → sending → sent/failed, máx. 3 reintentos.

**Scoring (3 señales):** requisitos 60 % + ubicación 25 % + completitud 15 %. Si `score < umbral` y screening activo → `Estado = Rechazado (-1)`.

---

## Seguridad

- Credenciales en `.env` (`DB_CONNECTION`, `JWT_KEY`, `SEED_ADMIN_PASSWORD`).
- Upload CV: solo `.pdf`/`.doc`/`.docx`, máx. 5 MB.
- Cabeceras: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- Kestrel sin cabecera `Server`.
- JWT en `localStorage` (`tb_token`, `tb_user`) — considerar cookies httpOnly en producción.

---

## Documentación adicional

| Archivo | Propósito |
|---|---|

| `recruitment-frontend/README.md` | Documentación específica del frontend |
| `MDs/UBUNTU_SERVER_SETUP.md` | Setup paso a paso en Ubuntu |
| `MDs/PENTESTING.md` | Auditoría de seguridad |

---

© 2026 Talentify sv. Todos los derechos reservados.
