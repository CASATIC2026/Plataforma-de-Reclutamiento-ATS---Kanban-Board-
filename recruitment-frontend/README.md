# Talentify sv — Recruitment Frontend

React 19.2 + Vite 8 frontend for the Talentify sv ATS platform. Fully responsive job board and recruiter admin portal with modern UI and drag-and-drop Kanban pipeline.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (Vite with HMR, proxies /api to backend)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Frontend**: `http://localhost:5173` (auto-opens in browser)  
**Backend**: `http://localhost:5223` (via Vite proxy at `/api`)

## Tech Stack

- **Framework**: React 19.2 with Hooks (Context API, useState, useEffect, useCallback, useMemo, useRef)
- **Build Tool**: Vite 8 (beta 13) with HMR and proxy middleware
- **Styling**: Tailwind CSS 4 + custom CSS system (`talentbridge.css`)
- **Routing**: React Router 7 with hash-based navigation
- **HTTP Client**: Axios with JWT interceptor
- **Drag-and-Drop**: HTML5 native + `@dnd-kit` library
- **Fonts**: Google Fonts — Playwrite IE (brand), Playfair Display (headings), DM Sans (body)
- **Package Manager**: npm

## Project Structure

```
src/
├── main.jsx                         # React 19 root entry with StrictMode
├── App.jsx                          # Router setup: PublicLayout + MainLayout routes
├── index.css                        # Imports Tailwind + talentbridge.css
├── pages/
│   ├── NewLandingPage.jsx           # Modern landing (/) with pagination, filters, responsive
│   ├── PublicVacantesPage.jsx       # Classic job board (/jobs, deprecated)
│   ├── AuthPage.jsx                 # Login/Register forms with modal UI
│   ├── AdminVacantesPage.jsx        # Manage vacancies with modal form, pagination, stats
│   ├── AdminPostulacionesPage.jsx   # Simple Kanban for applications
│   └── KanbanAllPage.jsx            # Full Kanban dashboard + rejected candidates tray
├── components/
│   ├── common/
│   │   ├── Button.jsx               # Reusable button variants
│   │   ├── Input.jsx                # Label + input wrapper
│   │   ├── Modal.jsx                # Overlay modal with Escape/backdrop handling
│   │   └── ProtectedRoute.jsx       # Auth guard for /admin/* routes
│   ├── vacantes/
│   │   ├── VacanteCard.jsx          # Admin vacancy card
│   │   ├── VacanteList.jsx          # 3-col grid
│   │   ├── VacanteForm.jsx          # Create/edit form with dynamic requisitos
│   │   ├── JobCard.jsx              # Public-facing job card with logo colors
│   │   └── JobDetailModal.jsx       # Full job details modal
│   ├── postulaciones/
│   │   ├── PostulacionForm.jsx      # Application form
│   │   ├── PostulacionCard.jsx      # Application card
│   │   ├── PostulacionList.jsx      # 3-col grid
│   │   ├── ApplyModal.jsx           # Drag-drop CV, skills, department input
│   │   ├── KanbanBoard.jsx          # @dnd-kit Kanban (older implementation)
│   │   └── KanbanCard.jsx           # Draggable card
│   └── kanban/                      # Full-featured Kanban (HTML5 native)
│       ├── KanbanBoard.jsx          # HTML5 drag-drop, toasts, polling
│       ├── KanbanColumn.jsx         # Drop zone with counter badge
│       ├── CandidateCard.jsx        # Card with puntaje score badge
│       ├── CandidateProfileModal.jsx # CV preview + notes editor
│       └── RechazadosTray.jsx       # Collapsed rejected candidates section
├── context/
│   └── AuthContext.jsx              # JWT + user state (localStorage)
├── api/
│   ├── axiosInstance.js             # Shared axios with JWT interceptor
│   ├── authApi.js                   # POST /auth/register, /auth/login
│   ├── vacantesApi.js               # CRUD /vacantes, screening config
│   └── postulacionesApi.js          # CRUD /postulaciones, scoring, emails
├── layouts/
│   ├── PublicLayout.jsx             # Public navbar + footer, scroll-aware
│   └── MainLayout.jsx               # Admin navbar with Vacantes/Kanban links
├── utils/
│   └── vacanteHelpers.js            # Color generation, logo, salary formatting, dates
└── styles/
    └── talentbridge.css             # Design system: vars, buttons, cards, navbar, footer
```

## Routes

| Route | Auth | Component | Description |
|---|---|---|---|
| `/` | Public | NewLandingPage | Modern landing with 6 jobs/page, filters, responsive |
| `/jobs` | Public | PublicVacantesPage | Classic job board (deprecated, 30s polling) |
| `/empresas` | Public | EmpresasPage | Companies marketing page |
| `/recursos` | Public | RecursosPage | Resources / articles |
| `/precios` | Public | PreciosPage | Pricing plans |
| `/contacto` | Public | ContactoPage | Contact form |
| `/legal/terminos` | Public | LegalTerminosPage | Terms of service |
| `/legal/privacidad` | Public | LegalPrivacidadPage | Privacy policy |
| `/login` | Public | AuthPage | Login / Register forms |
| `/dashboard` | Protected | CandidateDashboard | Candidate personal applications |
| `/admin/dashboard` | Protected | RecruiterDashboard | Recruiter stats & activity |
| `/admin/vacantes` | Protected | AdminVacantesPage | Create/edit/delete vacancies, stats dashboard |
| `/admin/vacantes/:id/aplicantes` | Protected | VacanteAplicantesPage | Per-vacancy candidate Kanban |
| `/admin/kanban` | Protected | KanbanAllPage | Full Kanban pipeline + rejected candidates |
| `/admin/analytics` | Protected | ManagerAnalytics | Pipeline funnel, time-to-hire, sources |
| `/platform/*` | Protected | Platform pages | Multi-tenant admin (companies, users, roles, audit, ops) |

## Key Features

### Public Job Board (NewLandingPage)
- **Pagination**: 6 jobs per page with numbered page buttons
- **Filters**: 7 contract types, 14 Salvadoran departments
- **Dynamic Hero Tags**: Top 8 skills across active jobs
- **"Nueva" Badge**: Shows 🔥 for jobs posted within 2 days
- **Responsive Design**: 900px (desktop), 680px (tablet), 500px (mobile), 300px (small mobile)
- **Search Navigation**: Footer "Buscar empleo" link → `/#search-bar` → auto-focus

### Admin Vacancy Management (AdminVacantesPage)
- **Modal Form**: Create/edit vacancies without page nav
- **Pagination**: 10 items per page with prev/next buttons
- **Stats Grid**: Total active, applications count, average, active rate %
- **Data Table**: Responsive with hover actions (edit/delete)
- **Requisitos**: Add/remove dynamic requirement tags
- **Screening Config**: Toggle auto-screening, set score threshold (0–100, default 60)

### Candidate Kanban Pipeline (KanbanAllPage)
- **4 Columns**: Nuevo → Entrevista → Prueba Técnica → Oferta
- **Drag-and-Drop**: HTML5 native (not @dnd-kit)
- **Optimistic Updates**: Immediate UI update, rollback on error
- **Toasts**: Stacking notifications (max 10, auto-dismiss 3s each)
- **Candidate Modal**: CV preview + notes + info in 2-column layout
- **Score Badges**: Green ≥75, amber 60–74, red <60
- **Rejected Tray**: Collapsible section with restore button

### Auto-Screening
- **Three-Signal Scoring** (0–100):
  - Requisitos matching (60%): Comma-separated skills vs job requirements
  - Location match (25%): Candidate's department vs job location
  - Completeness (15%): Phone + CV + name length
- **Automatic Routing**: Score < threshold → moved to Rechazado
- **Email Notifications**: Confirmation + result emails (if configured)

## Styling System

### CSS Variables (tailwindbridge.css)
```css
--navy: #131931          /* Primary dark */
--accent: #CD7B4F        /* Copper/orange */
--gold: #1F9DB9          /* Teal */
--green: #319E85         /* Success */
--radius-md: 0.75rem
--shadow-md: (box-shadow)
--transition: 0.22s cubic-bezier(0.4,0,0.2,1)
```

### Typography
- **Brand**: Playwrite IE, "Talentify sv"
- **Headings**: Playfair Display (serif)
- **Body**: DM Sans (sans-serif)

### Component Classes
- Buttons: `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--accent`, `.btn--lg`
- Navbar: `.navbar`, `.navbar__brand`, `.navbar__links`
- Cards: `.job-card`, `.job-card__header`, `.job-card__logo`
- Modals: `.modal`, `.modal__overlay`, `.form-*`
- Animations: `fadeUp`, `pulse`, `floatShape`

## Authentication

### JWT Flow
1. User registers/logs in → backend returns JWT token + user object
2. Axios interceptor auto-attaches `Authorization: Bearer <token>` to all requests
3. Token stored in localStorage (`tb_token`, `tb_user`)
4. 401 response → interceptor clears auth, redirects to `/login`

### Protected Routes
`<ProtectedRoute>` component wraps `/admin/*` routes, redirects unauthenticated users to `/login`

## Responsive Design

### Breakpoints
- **900px+**: Full desktop layout
- **680px–900px**: Tablet mode, compact search
- **500px–680px**: Mobile, vertical search bar, single-column grid
- **300px–500px**: Small mobile, minimal padding

### Implementation
All responsive CSS in `NewLandingPage.jsx` style tag with `!important` to override inline styles. Other pages use Tailwind media queries.

## API Integration

### Axios Interceptor
- Auto-adds `Authorization: Bearer <JWT>` header
- 401 responses → logout + redirect to login
- Base URL: `/api` (proxied by Vite to `localhost:5223`)

### Key Endpoints
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/vacantes` — List all active jobs
- `POST /api/postulaciones` — Submit application (public, multipart/form-data)
- `PATCH /api/postulaciones/{id}/estado` — Move candidate in pipeline (requires JWT)
- `GET /api/postulaciones/{id}/cv` — Download CV file
- For more, see [Backend API docs](../CLAUDE.md#api-endpoints)

## Development Tips

### Running Locally
```bash
# Terminal 1: Backend
cd ../RecruitmentAPI
dotnet run

# Terminal 2: Frontend
npm run dev
```

### Vite Proxy Config
`vite.config.js` proxies `/api/*` → `http://localhost:5223/api/*`
This avoids CORS issues during development.

### Hot Module Replacement (HMR)
Vite auto-reloads on file changes. Config: `vite.config.js` with React plugin.

### Debugging
- **Network**: Open DevTools, Network tab to inspect API calls
- **LocalStorage**: Check `tb_token` and `tb_user` keys for auth state
- **Console**: Look for Axios errors or component warnings

## Build & Deployment

### Production Build
```bash
npm run build
# Creates: dist/
```

### Preview Build Locally
```bash
npm run preview
# Serves: http://localhost:4173
```

### Deployment Notes
- Frontend: Typically served from `dist/` via nginx/Vercel/etc.
- Backend: Must be running at the configured API URL
- JWT secret and CORS must be configured on backend before deploying to production
- Consider environment variables for API base URL (currently hardcoded `/api`)

## Known Issues & TODOs

- ⚠️ **Email Sending**: SMTP credentials in backend `appsettings.json` are placeholders; configure before production
- ⚠️ **TypeScript**: Frontend uses JSX/JavaScript; consider migrating to TypeScript for type safety
- ⚠️ **Error Handling**: Limited error messages on network failures; could improve UX
- ⚠️ **Accessibility**: No ARIA labels or keyboard navigation testing on Kanban yet

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## License

© 2026 Talentify sv. All rights reserved.
