# Talentify SV — ATS Recruitment Platform

A full-stack Applicant Tracking System (ATS) with a public-facing job board, an admin recruiter portal, and a Kanban-based candidate pipeline.

---

## Features

**Authentication & Authorization**
- JWT Bearer authentication with BCrypt password hashing
- Register with name, email, password, career field, and role (Estudiante, Profesor, Administrador, Invitado)
- Login with email and password; 8-hour token expiry
- Two-panel auth UI with floating animations and glassmorphism design
- Admin write operations require authentication; public read endpoints remain open
- Automatic 401 redirect to login with token cleanup

**Public Job Board**
- Browse active job vacancies with search, location, and contract-type filters
- View job details and skill requirements
- Submit applications with optional CV upload (drag-and-drop, 5MB limit)
- Auto-refreshes every 30 seconds

**Admin Portal** (Protected — requires login)
- Create, edit, and delete job vacancies with requirements — modern modal form with stats dashboard
- View all candidate applications per vacancy with detailed table view
- **Operational Kanban pipeline** — view ALL candidates across all vacancies in one unified board
  - Real-time filters: search by name/email, filter by vacancy, date range (Hoy/Semana/Mes), sort options
  - Pipeline summary: live-updating stage chips showing candidate counts (Nuevo / Entrevista / Prueba Técnica / Oferta)
  - Drag-and-drop card movements with optimistic updates + automatic 30-second polling for multi-user conflict resolution
- Per-vacancy Kanban view — focused pipeline for a single job opening
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
| estado | enum | Nuevo, Entrevista, PruebaTecnica, Oferta |
| notas_internas | string? | Internal recruiter notes (nullable) |
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

## Notes

- **JWT Authentication** — Admin write operations (create/update/delete vacantes, update estado/notas, delete postulaciones) require a valid JWT token. Public read endpoints and candidate applications remain open. CV viewing also requires authentication. Token stored in `localStorage` (`tb_token`, `tb_user`), auto-attached via Axios interceptor, 8-hour expiry.
- **No CORS** — relies on Vite dev proxy; configure CORS headers for non-proxied deployments
- **No role-based authorization** — any authenticated user can access admin features; role field exists but is not enforced yet
- CV files are stored on disk under `Storage/CVs/` with UUID-based names; files are deleted when the application is deleted
- **Polling for multi-user sync** — The operational Kanban board (`/admin/kanban`) auto-refreshes every 30 seconds. This prevents lost updates when multiple recruiters move cards simultaneously on different devices. Last-write-wins conflict resolution: whichever PATCH arrives last to the server is the final state; the 30s poll catches and syncs all conflicting changes across users.
- **Vacancy color pills** — Each candidate card on the operational Kanban shows a colored pill with the vacancy name. Colors are deterministic per vacancy (based on vacancy ID hash, same as job board) so recruiters instantly recognize which job a candidate applied to.
- **Oferta accent** — Candidates in the "Oferta" stage have a green left border, making finalists visually distinct.
- The public job board uses 30-second polling (no WebSocket/SignalR)
- Kanban drag-and-drop uses optimistic updates + automatic reconciliation. Cards update immediately locally; a PATCH request syncs to the server; on success/failure, the card reconciles with the server response.
- Clicking a Kanban card opens `CandidateProfileModal` with candidate data, embedded CV, and internal notes
- PDF CVs are served inline via `GET /api/postulaciones/{id}/cv`; non-PDF formats trigger a file download
- Internal notes auto-save with a 1.5s debounce; cards show a "Notas" badge when notes exist
- 6 EF Core migrations applied (latest: `AddUsuarios`)
- JWT secret key is hardcoded in `appsettings.json` — use environment variables or secrets manager in production
