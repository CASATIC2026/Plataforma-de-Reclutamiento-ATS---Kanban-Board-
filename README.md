# TalentBridge — ATS Recruitment Platform

A full-stack Applicant Tracking System (ATS) with a public-facing job board, an admin recruiter portal, and a Kanban-based candidate pipeline.

---

## Features

**Public Job Board**
- Browse active job vacancies with search, location, and contract-type filters
- View job details and skill requirements
- Submit applications with optional CV upload
- Auto-refreshes every 30 seconds

**Admin Portal**
- Create, edit, and delete job vacancies with requirements
- View all candidate applications per vacancy
- Track candidates through a drag-and-drop Kanban pipeline (Nuevo → Entrevista → Prueba Técnica → Oferta)
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
| HTTP Client | Axios |
| Routing | React Router 7 |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |

---

## Project Structure

```
Plataforma-de-Reclutamiento-ATS---Kanban-Board-/
├── RecruitmentAPI/          # .NET 8 REST API
│   ├── Controllers/         # HTTP endpoints
│   ├── Services/            # Business logic
│   ├── Repositories/        # Data access layer
│   ├── Models/              # EF Core entities
│   ├── DTOs/                # Request/response objects
│   ├── Data/                # DbContext + Fluent API configurations
│   ├── Migrations/          # EF Core migrations
│   └── Storage/CVs/         # Uploaded CV files (UUID-named)
└── recruitment-frontend/    # React SPA
    └── src/
        ├── pages/           # Route-level page components
        ├── components/      # Reusable UI components
        ├── api/             # Axios API clients
        ├── layouts/         # Page layout wrappers
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
# Vacancies
GET    /api/vacantes
GET    /api/vacantes/{id}
POST   /api/vacantes
PUT    /api/vacantes/{id}
DELETE /api/vacantes/{id}              # Cascades to requisitos & postulaciones

# Applications
GET    /api/postulaciones
GET    /api/postulaciones/{id}
GET    /api/postulaciones/vacante/{vacanteId}
POST   /api/postulaciones              # multipart/form-data (with optional CV)
GET    /api/postulaciones/{id}/cv      # Serve CV file (inline for PDF, attachment for others)
PATCH  /api/postulaciones/{id}/estado  # Update EstadoPostulacion
PATCH  /api/postulaciones/{id}/notas   # Update internal recruiter notes
DELETE /api/postulaciones/{id}         # Also deletes CV file from disk
```

---

## Frontend Routes

| Route | Page | Description |
|---|---|---|
| `/` | PublicVacantesPage | Public job board |
| `/admin/vacantes` | AdminVacantesPage | Manage vacancies |
| `/admin/postulaciones` | AdminPostulacionesPage | View applications |
| `/admin/kanban` | KanbanPage | Drag-and-drop candidate pipeline |

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
Controller → Service → Repository → EF Core → PostgreSQL

# Frontend
React Page → Axios API Client → Vite Proxy → REST API
```

Backend uses interface-based dependency injection throughout:
- `IVacanteRepository` / `VacanteRepository`
- `IPostulacionRepository` / `PostulacionRepository`
- `IVacanteService` / `VacanteService`
- `IPostulacionService` / `PostulacionService`

---

## Notes

- **No authentication** — admin routes are unprotected; add auth before deploying to production
- **No CORS** — relies on Vite dev proxy; configure CORS headers for non-proxied deployments
- CV files are stored on disk under `Storage/CVs/` with UUID-based names; files are deleted when the application is deleted
- The public job board uses 30-second polling (no WebSocket/SignalR)
- Kanban drag-and-drop updates application status via `PATCH /api/postulaciones/{id}/estado`
- Clicking a Kanban card opens `CandidateProfileModal` with candidate data, embedded CV, and internal notes
- PDF CVs are served inline via `GET /api/postulaciones/{id}/cv`; non-PDF formats trigger a file download
- Internal notes auto-save with a 1.5s debounce; cards show a "Notas" badge when notes exist
- 5 EF Core migrations applied (latest: `AddNotasInternasToPostulaciones`)
