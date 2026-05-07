# Talentify sv — ATS Recruitment Platform

A full-stack Applicant Tracking System (ATS) with a public-facing job board, an admin recruiter portal, and a Kanban-based candidate pipeline. Built for the Salvadoran market with Spanish UI, local departments as locations, and modern responsive design.

---

## Features

**Authentication & Authorization**
- JWT Bearer authentication with BCrypt password hashing
- Register with name, email, password, and career field (public registration always creates a General role account)
- Login with email and password; 8-hour token expiry
- Two-panel auth UI with floating animations and glassmorphism design
- Admin write operations require authentication; public read endpoints remain open
- Automatic 401 redirect to login with token cleanup

**Public Job Board** (Modern responsive design)
- Browse active job vacancies with search, location, and contract-type filters
- Dynamic hero tags showing top 8 skills across all jobs
- "Nueva" badge (🔥) for jobs posted within 2 days
- Pagination: 6 jobs per page with numbered navigation
- Fully responsive: desktop, tablet, mobile (300px–900px), all breakpoints tested
- **4-step structured application form** (modal, no page navigation):
  - Step 1: Basic info (name, email, phone)
  - Step 2: Technical skills with proficiency levels (Básico→Experto) + years of experience, soft skills multi-select (max 5), impact statement (30–500 chars)
  - Step 3: CV drag-and-drop upload (PDF/DOC/DOCX, 5MB), per-vacancy dynamic screening questions (text, multiple choice, boolean, scale 1–5), availability grid (Mon–Sun × Morning/Afternoon/Night)
  - Step 4: Review summary, GDPR consent, truth attestation, digital signature validation
- Per-step validation with inline errors; signature must match name from step 1 (case-insensitive)
- Screening questions fetched dynamically per vacancy from `GET /api/vacantes/{id}/screening-questions`
- Auto-refreshes every 30 seconds

**Admin Portal** (Protected — requires login)
- Create, edit, and delete job vacancies with requirements — modern modal form with stats dashboard
- **Screening configuration** per vacancy:
  - Toggle auto-screening on/off
  - Set custom score threshold (0–100, default 60)
  - Automatic routing: candidates below threshold marked as Rechazado
- View all candidate applications per vacancy with detailed table view
- **Operational Kanban pipeline** — view ALL candidates across all vacancies in one unified board
  - Real-time filters: search by name/email, filter by vacancy, date range (Hoy/Semana/Mes), sort options
  - Pipeline summary: live-updating stage chips showing candidate counts (Nuevo / Entrevista / Prueba Técnica / Oferta)
  - Drag-and-drop card movements with optimistic updates + automatic 30-second polling for multi-user conflict resolution
  - **Rejected candidates tray** — collapsible section showing auto-screened candidates with "Restore" button
- Per-vacancy Kanban view — focused pipeline for a single job opening
- **Auto-scoring system** — three-signal algorithm:
  - Skill matching (60%): candidate skills vs job requisitos
  - Location match (25%): candidate location vs job location
  - Profile completeness (15%): phone + CV + name length
- **Score badges** on candidate cards: green (≥75), amber (60–74), red (<60)
- Stacking toast notifications — up to 10 visible at once, each auto-dismisses after 3 seconds
- Admin stats dashboard: Total Activas, Postulaciones count, Average per vacancy, Active rate percentage
- Delete applications (removes associated CV file from disk)

**Candidate Profile Viewer**
- Click any Kanban card to open a full profile modal
- Embedded PDF preview for CV files; download button for other formats (.docx, etc.)
- Internal notes area per candidate — auto-saves 1.5s after typing stops
- Notes badge on Kanban cards when notes have been written

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | .NET 8, C#, Entity Framework Core 8 |
| Database | PostgreSQL |
| API Docs | Swagger (Development mode) |
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Authentication | JWT Bearer (Microsoft.AspNetCore.Authentication.JwtBearer 8.0.11) |
| Password Hashing | BCrypt (BCrypt.Net-Next 4.0.3) |
| HTTP Client | Axios (shared instance with JWT interceptor) |
| Routing | React Router 7 |
| State Management | React Context API (AuthContext) |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |

---

## RBAC System (Role-Based Access Control)

**Overview:** Talentify SV implements a comprehensive RBAC system with 8 roles, 41 fine-grained permissions, multi-tenant company scoping, and a dedicated platform admin panel. All data is database-backed via EF Core seed scripts — no mocked data.

### Role Hierarchy

| Role | Tier | Scope | Purpose |
|---|---|---|---|
| **Candidate** | App | User's own company | Job seeker; view own applications only |
| **Recruiter** | App | Company | Manage job postings and candidate screening |
| **Manager** | App | Company | Oversee recruitment funnel, analytics, team activity |
| **Admin** | Platform | All companies | System administration, user/role management |
| **Owner** | Platform | All companies | Full system control; immutable role (DB-only assignment) |
| **Developer** | Platform | N/A | Deployment, feature flag toggles, log access |
| **DevOps** | Platform | N/A | Infrastructure, pipeline, deployment rollback |
| **DBA** | Platform | N/A | Audit logs, database metrics, performance monitoring |

### Permission Categories (41 Total)

| Category | Permissions | Role Assignments |
|---|---|---|
| **jobs** (7) | `read`, `create`, `update`, `delete`, `approve`, `publish`, `read_all` | Recruiter: create/update/delete; Manager: approve/publish/read_all |
| **applications** (6) | `create`, `read_own`, `read`, `read_all`, `update_status`, `add_note` | Candidate: create/read_own; Recruiter: read/update_status/add_note; Manager: read_all |
| **profile** (1) | `update_own` | Candidate |
| **users** (4) | `read`, `update`, `disable`, `assign_role` | Admin: all; Manager: read only |
| **companies** (4) | `create`, `read`, `update`, `transfer` | Admin: create/read/update; Owner: transfer |
| **reports** (1) | `read` | Manager |
| **roles** (3) | `read`, `create`, `update`, `assign_admin` | Admin: read; Owner: create/update/assign_admin |
| **audit** (2) | `read`, `export` | Admin: read; Owner: export |
| **platform** (3) | `access`, `configure`, `billing:read` | Admin: access; Owner: configure/billing:read |
| **ops** (9) | `deployment:trigger`, `deployment:read_logs`, `deployment:rollback`, `infra:read_metrics`, `infra:configure`, `pipeline:trigger`, `logs:read`, `features:toggle`, `db:read_logs` | Owner: all; Developer: trigger/read_logs/toggle; DevOps: trigger/rollback/infra:*; DBA: audit:read/db:read_logs |

### Permission Checking

**Backend:** All controllers use `[Authorize]` attribute with role checks. Missing permission → 403 Forbidden.

**Frontend:** Use the `usePermission()` hook and `<Can>` component for deny-by-default UI:

```jsx
import { usePermission } from '../hooks/usePermission';
import { Can } from '../components/common/Can';

// Hook-based check
const canCreateJob = usePermission('jobs:create');

// Component-based wrapping
<Can permission="jobs:create">
  <button>Publicar Vacante</button>
</Can>

<Can permission="roles:update" fallback={<p>No tienes permiso</p>}>
  <RoleEditor />
</Can>
```

### Legacy Fallback

Users created before RBAC deployment have permissions derived from their legacy `rol` enum (Estudiante, Profesor, Administrador, Invitado). Once the database seed runs, the `usuario_roles` join table is populated with the appropriate role + company scope; these users get their permissions from the new system, with the enum as a fallback display field.

### Multi-Tenancy

Each `usuario_roles` record scopes a user to a company (`empresa_id`). The JWT includes `company_id` claim; APIs filter cross-tenant visibility based on the user's scoped company.

- **Candidate/Recruiter/Manager:** scoped to their assigned company
- **Admin/Owner/Developer/DevOps/DBA:** platform-tier, see all companies (no scoping)

---

## Project Structure

```
Plataforma-de-Reclutamiento-ATS---Kanban-Board-/
├── RecruitmentAPI/          # .NET 8 REST API
│   ├── Controllers/         # HTTP endpoints
│   ├── Services/            # Business logic
│   ├── Repositories/        # Data access layer
│   ├── Models/              # EF Core entities (Vacante, Postulacion, Usuario)
│   ├── DTOs/                # Request/response objects (incl. auth DTOs)
│   ├── Data/                # DbContext + Fluent API configurations
│   ├── Migrations/          # EF Core migrations
│   └── Storage/CVs/         # Uploaded CV files (UUID-named)
└── recruitment-frontend/    # React SPA
    └── src/
        ├── pages/           # Route-level pages (incl. AuthPage)
        ├── components/      # Reusable UI components (incl. ProtectedRoute)
        ├── context/         # React Context providers (AuthContext)
        ├── api/             # Axios API clients + shared instance with JWT interceptor
        ├── layouts/         # Page layout wrappers (auth-aware headers)
        └── utils/           # Helpers (color, salary, date formatting)
```

---

## Database Schema

### `vacantes` — Job Postings
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| titulo | string | Job title |
| descripcion | string | Full description |
| ubicacion | string | Location |
| tipo_contrato | string | Contract type |
| salario_min | decimal? | Optional |
| salario_max | decimal? | Optional |
| esta_activa | bool | Default: true |
| screening_activo | bool | Auto-screening toggle (default: true) |
| umbral_puntaje | decimal | Score threshold 0–100 (default: 60) |
| created_at | DateTime | UTC |
| updated_at | DateTime | UTC |

### `requisitos` — Skill Tags (1:N → vacantes)
| Column | Type |
|---|---|
| id | UUID |
| nombre | string |
| vacante_id | UUID (FK) |

### `usuarios` — User Accounts
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| nombre | string | First name |
| apellido | string | Last name |
| email | string | Unique index |
| password_hash | string | BCrypt hashed |
| carrera | string? | Career field (optional) |
| rol | enum | Estudiante, Profesor, Administrador, Invitado |
| created_at | DateTime | UTC |

### `postulaciones` — Applications (1:N → vacantes)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| vacante_id | UUID (FK) | |
| usuario_id | UUID (FK) | Authenticated applier (nullable for legacy) |
| nombre_candidato | string | |
| email | string | |
| telefono | string | |
| cv_file_name | string | UUID-named filename on disk |
| cv_file_path | string | Absolute path on disk |
| estado | enum | Rechazado (-1), Nuevo (0), Entrevista (1), PruebaTecnica (2), Oferta (3) |
| notas_internas | string? | Internal recruiter notes (nullable) |
| puntaje | decimal? | Auto-screening score (0–100, nullable) |
| puntaje_detalle | string? | JSON breakdown: `{"requisitos":45.0,"ubicacion":25.0,"completeness":15.0}` |
| soft_skills | string? | JSON array of selected soft skill labels |
| impact_statement | string? | Candidate's self-description (30–500 chars) |
| application_source | string? | Origin channel (default: "direct") |
| consent_gdpr | bool | GDPR consent (default: false) |
| consent_marketing | bool | Marketing comms consent (default: false) |
| attested_truth | bool | Candidate truth attestation (default: false) |
| attested_signature | string? | Digital signature (must match nombre_candidato) |
| completion_time_seconds | int? | Time to complete the form |
| email_confirmacion_enviado | bool | Receipt email sent (default: false) |
| email_resultado_enviado | bool | Result email sent (default: false) |
| created_at | DateTime | UTC |
| updated_at | DateTime | UTC |

### `candidate_skills` — Structured Skill Records (1:N → postulaciones)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| postulacion_id | UUID (FK) | Cascade delete |
| skill_name | string | e.g. "React", "PostgreSQL" |
| skill_category | string? | e.g. "frontend", "database" |
| proficiency_level | string | Básico / Intermedio / Avanzado / Experto |
| years_experience | decimal? | Optional years in this skill |
| is_verified | bool | Default: false (for future endorsement) |
| source | string | Default: "self_reported" |
| created_at | DateTime | UTC |

### `candidate_availability` — Weekly Availability Slots (1:N → postulaciones)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| postulacion_id | UUID (FK) | Cascade delete |
| day_of_week | string | Mon / Tue / Wed … |
| time_slot | string | Mañana / Tarde / Noche |
| is_available | bool | Default: false |
| created_at | DateTime | UTC |

**Unique constraint:** (postulacion_id, day_of_week, time_slot)

### `screening_questions` — Per-vacancy Evaluation Questions (1:N → vacantes)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| vacante_id | UUID (FK) | Cascade delete |
| question_text | string | The question prompt |
| question_type | string | `text` / `multiple_choice` / `boolean` / `scale_1_5` |
| options | string? | JSONB array for multiple_choice options |
| correct_answer | string? | For auto-scoring |
| max_score | int | Default: 10 |
| required | bool | Default: true |
| orden | int | Sort order (default: 0) |
| created_at | DateTime | UTC |

### `candidate_screening_responses` — Answers to Screening Questions (1:N → postulaciones)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| postulacion_id | UUID (FK) | Cascade delete |
| question_id | UUID (FK) | Cascade delete |
| response_text | string? | Candidate's answer |
| auto_score | decimal? | Computed score (future) |
| created_at | DateTime | UTC |

**Unique constraint:** (postulacion_id, question_id)

---

## RBAC Database Tables

### `empresas` — Multi-tenant Companies
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| nombre | string | Company name |
| dominio | string | Unique partial index (IS NOT NULL), e.g. "talentifysv.com" |
| estado | enum | "activa" or "inactiva" (default: "activa") |
| created_at | DateTime | UTC |

### `roles` — RBAC Role Definitions
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| nombre | string | Unique, e.g. "Candidate", "Owner" |
| ambito | string | "app_tier" (scoped to company) or "platform_tier" (global) |
| es_inmutable | bool | If true, cannot be edited/deleted (e.g., Owner role) |
| created_at | DateTime | UTC |

### `permisos` — Fine-grained Permission Definitions
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| nombre | string | Unique, e.g. "jobs:create", "audit:read" |
| descripcion | string? | Human-readable description |
| categoria | string? | Category for grouping, e.g. "jobs", "audit" |
| created_at | DateTime | UTC |

### `rol_permisos` — Role-Permission Mappings
| Column | Type | Notes |
|---|---|---|
| rol_id | UUID (FK) | → roles, cascade delete |
| permiso_id | UUID (FK) | → permisos, cascade delete |

**Composite PK:** (rol_id, permiso_id)

### `usuario_roles` — User Role Assignments (Multi-tenant Scope)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| usuario_id | UUID (FK) | → usuarios, cascade delete |
| rol_id | UUID (FK) | → roles, cascade delete |
| empresa_id | UUID (FK) | → empresas, nullable (NULL = platform-tier only) |
| asignado_por | UUID (FK) | → usuarios, who assigned this role (nullable) |
| asignado_en | DateTime | When assigned (default: NOW()) |

**Index:** (usuario_id, empresa_id) for scoped queries

### `audit_log` — Audit Trail
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| usuario_id | UUID (FK)? | → usuarios, nullable, SetNull on delete |
| accion | string | e.g. "CREATE_VACANTE", "UPDATE_ESTADO" |
| recurso | string? | Resource identifier, e.g. "vacantes:123abc" |
| resultado | string | "Allowed" or "Denied" (default: "Allowed") |
| ip | string? | Client IP address |
| detalles | string? | JSON details, e.g. `{"campo":"estado","valor_antiguo":"Nuevo","valor_nuevo":"Entrevista"}` |
| created_at | DateTime | UTC |

**Indexes:** created_at, (usuario_id, created_at)

### `feature_flags` — Feature Toggle Configuration
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| nombre | string | Unique flag name, e.g. "screening_automatico" |
| descripcion | string? | Human-readable description |
| esta_activo | bool | Flag state (default: false) |
| modificado_por | UUID (FK)? | → usuarios, last modifier |
| modified_at | DateTime | Last update time (default: NOW()) |

**Index:** nombre (unique)

### `deployment_logs` — Deployment History
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| version | string | Semantic version, e.g. "1.0.0" |
| disparado_por | UUID (FK)? | → usuarios, who triggered deployment |
| estado | string | "Running", "Success", "Failed", "RolledBack" (default: "Running") |
| duracion_segundos | int? | Execution duration in seconds |
| notas | string? | Deployment notes or error messages |
| created_at | DateTime | UTC |

**Index:** created_at

---

## API Endpoints

### Authentication
```
POST   /api/auth/register              # Create account (201 or 409 if email exists)
POST   /api/auth/login                 # Get JWT token (200 or 401)
                                       # Response: {token, user{...}, permissions[], companyId}
```

### Vacancies
```
GET    /api/vacantes                   # Public list
GET    /api/vacantes/{id}              # Public detail
POST   /api/vacantes                   # 🔒 jobs:create
PUT    /api/vacantes/{id}              # 🔒 jobs:update
DELETE /api/vacantes/{id}              # 🔒 jobs:delete (cascades to requisitos & postulaciones)
```

### Applications
```
GET    /api/postulaciones              # Public
GET    /api/postulaciones/{id}         # Public
GET    /api/postulaciones/vacante/{id} # Public
POST   /api/postulaciones              # Public (multipart: CV + JSON-serialised skills/availability/screening)
GET    /api/postulaciones/{id}/cv      # 🔒 applications:read
PATCH  /api/postulaciones/{id}/estado  # 🔒 applications:update_status
PATCH  /api/postulaciones/{id}/notas   # 🔒 applications:add_note
DELETE /api/postulaciones/{id}         # 🔒 applications:read_all (also deletes CV file)
```

### Screening Questions
```
GET    /api/vacantes/{id}/screening-questions        # Public — returns questions for the vacancy
POST   /api/vacantes/{id}/screening-questions        # 🔒 jobs:update — add a question
PUT    /api/vacantes/{id}/screening-questions/{qid}  # 🔒 jobs:update — edit a question
DELETE /api/vacantes/{id}/screening-questions/{qid}  # 🔒 jobs:update — remove a question
```

### Candidate Dashboard
```
GET    /api/candidato/postulaciones    # 🔒 applications:read_own
                                       # Returns only user's own applications
```

### Multi-Tenant Companies
```
GET    /api/empresas                   # 🔒 companies:read
POST   /api/empresas                   # 🔒 companies:create
PUT    /api/empresas/{id}              # 🔒 companies:update
DELETE /api/empresas/{id}              # 🔒 companies:update (soft delete)
```

### RBAC Roles & Permissions
```
GET    /api/roles                      # 🔒 roles:read
POST   /api/roles                      # 🔒 roles:create
PATCH  /api/roles/{id}/permisos        # 🔒 roles:update (blocked if EsInmutable=true)
POST   /api/roles/assign               # 🔒 users:assign_role
                                       # Body: {usuarioId, rolNombre, empresaId?}
```

### Audit Logs
```
GET    /api/audit                      # 🔒 audit:read
                                       # Query params: from, to, usuarioId, resultado, page, pageSize
```

### Feature Flags
```
GET    /api/feature-flags              # 🔒 features:toggle
PATCH  /api/feature-flags/{id}/toggle  # 🔒 features:toggle
```

### Analytics
```
GET    /api/analytics/pipeline         # 🔒 reports:read
GET    /api/analytics/time-to-hire     # 🔒 reports:read
GET    /api/analytics/sources          # 🔒 reports:read
GET    /api/analytics/team             # 🔒 reports:read (also requires users:read)
```

### Operations (Deployments, Infrastructure, Logs)
```
GET    /api/ops/deployments            # 🔒 deployment:read_logs
POST   /api/ops/deploy                 # 🔒 deployment:trigger
POST   /api/ops/rollback/{id}          # 🔒 deployment:rollback
GET    /api/platform/overview          # 🔒 platform:access
```

---

## Frontend Routes

| Route | Page | Guard | Permission | Description |
|---|---|---|---|---|
| `/` | NewLandingPage | Public | — | Landing page + job listings |
| `/jobs` | PublicVacantesPage | Public | — | Job board with 30s polling |
| `/login` | AuthPage | Public | — | Login / Register |
| `/dashboard` | CandidateDashboard | 🔒 Authenticated | `applications:read_own` | Candidate's personal Kanban (own applications only) |
| **Admin Routes** (via MainLayout) |
| `/admin/dashboard` | RecruiterDashboard | 🔒 Authenticated | `jobs:create` | Recruiter stats & recent activity |
| `/admin/vacantes` | AdminVacantesPage | 🔒 Authenticated | `jobs:create` | Manage vacancies (CRUD) |
| `/admin/vacantes/:id/aplicantes` | VacanteAplicantesPage | 🔒 Authenticated | `jobs:read_all` | Per-vacancy candidate Kanban |
| `/admin/kanban` | KanbanAllPage | 🔒 Authenticated | `jobs:read_all` | Operational Kanban: all candidates, filters, 30s polling |
| `/admin/analytics` | ManagerAnalytics | 🔒 Authenticated | `reports:read` | Pipeline funnel, time-to-hire, source stats, team activity |
| `/admin/usuarios` | AdminUsuariosPage | 🔒 Authenticated | `Administrador` role | User management (admin-only) |
| **Platform Admin Routes** (via PlatformLayout) |
| `/platform` | PlatformOverview | 🔒 Authenticated | `platform:access` | System stats, company list, health indicator |
| `/platform/companies` | PlatformCompanies | 🔒 Authenticated | `companies:read` | Multi-tenant company CRUD |
| `/platform/users` | PlatformUsers | 🔒 Authenticated | `users:read` | Cross-tenant user management & role assignment |
| `/platform/roles` | PlatformRoles | 🔒 Authenticated | `roles:read` | Role definitions + permission mapping (editable for Owner only) |
| `/platform/audit` | PlatformAudit | 🔒 Authenticated | `audit:read` | Audit log viewer with filters + CSV export |
| `/platform/config` | PlatformConfig | 🔒 Authenticated | `platform:configure` | Feature flags, SMTP config, global settings (Owner-only) |
| `/platform/ops` | PlatformOps | 🔒 Authenticated | `deployment:trigger` OR `infra:read_metrics` OR `db:read_logs` | Deployments, infrastructure, feature flags, database logs |
| `*` | NotFoundPage | Public | — | 404 page |

---

## Local Development

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- PostgreSQL running on `localhost:5433`

### Environment Variables

Create `RecruitmentAPI/.env`:
```
DB_CONNECTION=Host=localhost;Port=5433;Database=recruitment_db;Username=recruitment_user;Password=Recruitment2025!
JWT_KEY=TalentBridge_SuperSecretKey_2025_MustBeAtLeast32Chars!
SEED_ADMIN_PASSWORD=Admin123!
ALLOWED_ORIGIN=http://localhost:5173
```

Create `recruitment-frontend/.env`:
```
VITE_API_URL=http://localhost:5223
```

> `.env` files are git-ignored. Use `.env.example` in each directory as a template.

### Database Setup

Create the database and user:
```sql
CREATE USER recruitment_user WITH PASSWORD 'Recruitment2025!';
CREATE DATABASE recruitment_db OWNER recruitment_user;
```

Apply migrations:
```bash
cd Plataforma-de-Reclutamiento-ATS---Kanban-Board-/RecruitmentAPI
dotnet ef database update
```

### Start Backend
```bash
cd Plataforma-de-Reclutamiento-ATS---Kanban-Board-/RecruitmentAPI
dotnet run
# Runs on http://localhost:5223
# Swagger UI at http://localhost:5223/swagger
```

### Start Frontend
```bash
cd Plataforma-de-Reclutamiento-ATS---Kanban-Board-/recruitment-frontend
npm install
npm run dev
# Runs on http://localhost:5173
# /api requests proxied to http://localhost:5223
```

---

## Architecture

```
# Backend
Controller ([Authorize] on write endpoints) → Service → Repository → EF Core → PostgreSQL
AuthController → AuthService (JWT generation + BCrypt) → AppDbContext → usuarios table

# Frontend
AuthProvider (React Context) → ProtectedRoute (guards /admin/*)
React Page → Axios API Client (JWT interceptor) → Vite Proxy → REST API
```

Backend uses interface-based dependency injection throughout:
- `IVacanteRepository` / `VacanteRepository`
- `IPostulacionRepository` / `PostulacionRepository`
- `IVacanteService` / `VacanteService`
- `IPostulacionService` / `PostulacionService`
- `IAuthService` / `AuthService`

---

## Responsive Design (NewLandingPage)

The landing page (`/`) implements comprehensive mobile-first responsive design using CSS media queries with three key breakpoints:

**Desktop (900px+)**
- Full search bar: horizontal layout with location dropdown (200px width) + search button side-by-side
- Large typography: hero titles 40px, descriptions 18px
- Standard padding: hero section 80px horizontal
- Grid: 3-column auto-fill layout (minmax 340px)

**Tablet (680px–900px)**
- Search bar remains horizontal but more compact
- Location select width becomes flexible (`auto`)
- Padding reduces to 24px horizontal
- Font sizes scale: hero titles → 32px, descriptions → 16px
- Grid: maintains 3-column layout with tighter gaps (28px → adjusted)

**Mobile (500px–680px)**
- **Search bar transforms vertical** (flex-direction: column):
  - Input field spans full width with rounded top
  - Location select below, full width, no border radius
  - Search button spans full width with rounded bottom
  - No divider separator between input and select
- Single-column grid layout (1fr)
- Pagination controls wrap with smaller buttons (24–28px)
- Filter bar label hides; filter buttons adjust padding
- Padding reduces to 16px horizontal

**Small Mobile (300px–500px)**
- Minimal padding: 12px horizontal
- Hero section: 40px vertical padding
- Font sizes: hero titles 24px, descriptions 13px
- Pagination buttons: 24px × 24px with 11px font
- All gaps reduced for compact display
- Single column grid with 12px card gaps

**Key Implementation Details:**
- No horizontal overflow (overflow-x: hidden on root)
- All fixed widths (200px select, 32px buttons) become responsive
- Search bar button width changes from fixed padding to `width: 100%` on mobile
- Job cards maintain aspect ratio with `minHeight` scaling
- Media queries use `!important` flag to override inline styles
- Pagination controls wrap with adjusted gap and flex-wrap: wrap

**Tested & Fixed Issues:**
- ✅ Brand name/user text mounting at 590px
- ✅ Search bar buttons disappearing
- ✅ White blank bar appearing on right side at 300px
- ✅ Overflow caused by fixed element widths
- ✅ Filter bar overflow on small screens

---

## Notes

- **JWT Authentication** — Admin write operations (create/update/delete vacantes, update estado/notas, delete postulaciones) require a valid JWT token. Public read endpoints and candidate applications remain open. CV viewing also requires authentication. Token stored in `localStorage` (`tb_token`, `tb_user`), auto-attached via Axios interceptor, 8-hour expiry.
- **Role-based authorization** — enforced via `[Authorize(Roles = ...)]` on all admin endpoints. VacantesController write ops require Administrador; PostulacionesController read/PATCH require Administrador or Manager.
- **CORS** — restricted to `ALLOWED_ORIGIN` environment variable in all environments. Vite proxy used in development (`/api → http://localhost:5223`); set `ALLOWED_ORIGIN` to your frontend domain in production.
- CV files are stored on disk under `Storage/CVs/` with UUID-based names; files are deleted when the application is deleted
- **Polling for multi-user sync** — The operational Kanban board (`/admin/kanban`) auto-refreshes every 30 seconds. This prevents lost updates when multiple recruiters move cards simultaneously on different devices. Last-write-wins conflict resolution: whichever PATCH arrives last to the server is the final state; the 30s poll catches and syncs all conflicting changes across users.
- **Vacancy color pills** — Each candidate card on the operational Kanban shows a colored pill with the vacancy name. Colors are deterministic per vacancy (based on vacancy ID hash, same as job board) so recruiters instantly recognize which job a candidate applied to.
- **Oferta accent** — Candidates in the "Oferta" stage have a green left border, making finalists visually distinct.
- The public job board uses 30-second polling (no WebSocket/SignalR)
- Kanban drag-and-drop uses optimistic updates + automatic reconciliation. Cards update immediately locally; a PATCH request syncs to the server; on success/failure, the card reconciles with the server response.
- Clicking a Kanban card opens `CandidateProfileModal` with candidate data, embedded CV, and internal notes
- PDF CVs are served inline via `GET /api/postulaciones/{id}/cv`; non-PDF formats trigger a file download
- Internal notes auto-save with a 1.5s debounce; cards show a "Notas" badge when notes exist
- 9 EF Core migrations applied (latest: `AddStructuredApplicationData` — adds `candidate_skills`, `candidate_availability`, `screening_questions`, `candidate_screening_responses`, and 8 new columns on `postulaciones`)
- **Security**: All critical and high-severity patches applied — credentials moved to environment variables (`DB_CONNECTION`, `JWT_KEY`), file upload restricted to `.pdf`/`.doc`/`.docx` with 5 MB limit, DTO validation on all public inputs, CORS policy via `ALLOWED_ORIGIN`, security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`), npm dependencies patched to 0 vulnerabilities. See [PENTESTING.md](PENTESTING.md) for the original audit and `SECURITY_QUICKSTART.md` for setup instructions.
