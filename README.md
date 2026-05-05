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
- Submit applications with optional CV upload (drag-and-drop, 5MB limit)
- Technical skills input (comma-separated) for improved scoring
- Department selection (14 Salvadoran locations)
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
| nombre_candidato | string | |
| email | string | |
| telefono | string | |
| cv_file_name | string | UUID-named filename on disk |
| cv_file_path | string | Absolute path on disk |
| estado | enum | Rechazado (-1), Nuevo (0), Entrevista (1), PruebaTecnica (2), Oferta (3) |
| notas_internas | string? | Internal recruiter notes (nullable) |
| puntaje | decimal? | Auto-screening score (0–100, nullable) |
| puntaje_detalle | string? | JSON breakdown: `{"requisitos":45.0,"ubicacion":25.0,"completeness":15.0}` |
| email_confirmacion_enviado | bool | Receipt email sent (default: false) |
| email_resultado_enviado | bool | Result email sent (default: false) |
| created_at | DateTime | UTC |
| updated_at | DateTime | UTC |

---

## API Endpoints

```
# Authentication
POST   /api/auth/register              # Create account (201 or 409 if email exists)
POST   /api/auth/login                 # Get JWT token (200 or 401)

# Vacancies
GET    /api/vacantes                   # Public
GET    /api/vacantes/{id}              # Public
POST   /api/vacantes                   # 🔒 Requires JWT
PUT    /api/vacantes/{id}              # 🔒 Requires JWT
DELETE /api/vacantes/{id}              # 🔒 Requires JWT — cascades to requisitos & postulaciones

# Applications
GET    /api/postulaciones              # Public
GET    /api/postulaciones/{id}         # Public
GET    /api/postulaciones/vacante/{id} # Public
POST   /api/postulaciones              # Public (candidates apply with CV)
GET    /api/postulaciones/{id}/cv      # 🔒 Requires JWT (inline PDF, attachment for others)
PATCH  /api/postulaciones/{id}/estado  # 🔒 Requires JWT
PATCH  /api/postulaciones/{id}/notas   # 🔒 Requires JWT
DELETE /api/postulaciones/{id}         # 🔒 Requires JWT — also deletes CV file
```

---

## Frontend Routes

| Route | Page | Auth | Description |
|---|---|---|---|
| `/` | NewLandingPage | Public | Modern landing page with job listings |
| `/jobs` | PublicVacantesPage | Public | Classic job board with 30s polling |
| `/login` | AuthPage | Public | Login / Register (`?mode=register`) |
| `/admin/vacantes` | AdminVacantesPage | 🔒 Protected | Manage vacancies (create/edit/delete) |
| `/admin/vacantes/:id/aplicantes` | VacanteAplicantesPage | 🔒 Protected | Per-vacancy applicant Kanban + details |
| `/admin/postulaciones` | AdminPostulacionesPage | 🔒 Protected | (Hidden) Applications view |
| `/admin/kanban` | KanbanAllPage | 🔒 Protected | Operational dashboard: all candidates, filters, live counts, 30s polling |

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
- 7 EF Core migrations applied (latest: `AddScreeningAndEmailTracking`)
- **Security status**: RBAC enforced, JWT validated, SQL injection protected. Known issues being patched: credentials to env vars, rate limiting, file upload validation, DTO validation, security headers. See [PENTESTING.md](PENTESTING.md) for full security audit and remediation plan.
