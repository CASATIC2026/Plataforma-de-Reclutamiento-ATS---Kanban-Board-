# Talentify SV — Plataforma ATS de Reclutamiento

Sistema integral de seguimiento de candidatos (ATS) full-stack para el mercado salvadoreño: bolsa de empleo pública, portal de reclutadores, pipeline Kanban, analítica y administración multi-empresa con RBAC.

**Rama activa:** `development-BM` · **Última actualización:** junio 2026

---

## Novedades recientes

### Junio 2026 — Vinculación de empresas, panel de candidato y rebranding

- **Vinculación de empresa por administrador:** desde `/platform/users`, los Admin/Owner de plataforma
  ahora pueden asignar o quitar (`null`) la empresa vinculada a cualquier usuario directamente desde un
  selector en la tabla, sin afectar el flujo de paywall (HTTP 402) existente.
- **Corrección del error 400 al postularse desde el dashboard:** el modal de detalle de vacante enviaba
  el evento de clic en lugar del puesto seleccionado; ya corregido. El formulario de postulación además
  precarga nombre y correo del usuario autenticado.
- **"Mis postulaciones" en el dashboard:** las postulaciones realizadas con sesión iniciada quedan
  asociadas a la cuenta del candidato y aparecen en su panel.
- **Menú de usuario unificado:** nuevo componente `UserMenu` (avatar con iniciales → nombre, rol y
  "Cerrar sesión") reutilizado en el dashboard y en la barra de navegación pública, incluyendo el menú
  móvil (antes sin opción de cierre de sesión).
- **Campana de notificaciones funcional** en el dashboard: muestra cambios de estado recientes en las
  postulaciones del candidato.
- **Descarga de guía en `/recursos`:** el botón "Descargar guía" ahora entrega un PDF real.
- **Rebranding visual:** nuevo isotipo (icono turquesa) y favicon, y la marca "Talentify SV" se
  estandarizó (tipografía, color y disposición) en todos los encabezados (dashboard, landing,
  panel admin, panel de plataforma y páginas legales).
- **Manual de usuario en español:** `docs/Manual_Usuario_Talentify_SV.docx`.
- **Despliegue en producción:** backend y frontend corren como servicios `systemd --user`
  (`recruitmentapi`, `recruitment-frontend`) con reinicio automático y arranque al iniciar el servidor,
  igual que el túnel de Cloudflare.

### Junio 2026 — Kanban responsivo + drag-and-drop táctil + flujo paywall

- **Kanban rediseñado:** una caja por fase (Nuevo → Entrevista → Prueba Técnica → Oferta). Cada caja muestra la lista completa de candidatos con scroll interno.
- **Drag-and-drop universal:** reemplaza HTML5 drag por Pointer Events. Funciona en mouse, pantalla táctil y vista responsiva del navegador. Mouse: arrastra en cuanto se mueve >5 px. Táctil: mantén presionado ~280 ms para activar; deslizar rápido sigue siendo scroll. Ghost card flotante + columna destino resaltada.
- **Grid responsivo del Kanban:** 4 columnas ≥871 px → 2×2 ≤870 px → apilado ≤470 px.
- **Flujo paywall 402:** crear una vacante sin empresa vinculada devuelve HTTP 402. El frontend muestra `NoPlanModal` con CTA a `/precios` en lugar de un error genérico.
- **`PAYMENT_PROPOSALS.md`:** opciones de integración de pago documentadas (Stripe Payment Links, Stripe Checkout, activación manual).
- **Responsive general:** `PlatformLayout` con sidebar drawer + hamburger ≤768 px. `PlatformOverview`, `RecruiterDashboard` y `ManagerAnalytics` corregidos para móvil desde ~200 px.

### Mayo–junio 2026 — Seguridad y plataforma

- Rate limiting en `/api/auth/login` (5 req/min/IP).
- Cloudflare Turnstile CAPTCHA en login/registro.
- Cloudflare Access Zero Trust JWT para rutas `/platform/*`.
- Túnel Cloudflare en servidor de producción (`talentify.infraone.space`).
- Gestión de usuarios consolidada y panel de administración de plataforma.

### Mayo 2026 — UI pública + Auth

- Sitio público ampliado: `/empresas`, `/recursos`, `/precios`, `/contacto`, `/legal/*`.
- Auth rediseñada con `AuthLayout`, barra de fortaleza de contraseña.
- Dashboard de candidato renovado.
- Temas CSS separados: `public-theme.css` y `admin-theme.css`.
- `lucide-react` para iconografía.

---

## Características

### Bolsa de empleo pública (`/` y `/jobs`)

- Búsqueda por texto, filtros por departamento (14) y tipo de contrato (7).
- Paginación: 6 vacantes por página. Etiquetas dinámicas de las 8 habilidades más frecuentes.
- Badge «Nueva» para vacantes de los últimos 2 días.
- Diseño responsive 300 px → 900 px+.

**Formulario de postulación en 4 pasos** (modal sin cambio de página):
1. Datos básicos (nombre, email, teléfono).
2. Habilidades técnicas (nivel + años), soft skills (máx. 5), declaración de impacto (30–500 chars).
3. CV drag-and-drop (PDF/DOC/DOCX, 5 MB), preguntas de screening, grilla de disponibilidad.
4. Resumen, consentimiento GDPR, declaración de veracidad y firma digital.

### Portal de reclutadores (`/admin/*`)

- CRUD de vacantes con modal, requisitos dinámicos y configuración de screening por vacante.
- **Kanban operativo (`/admin/kanban`):** pipeline visual completo con drag-and-drop táctil.
- Kanban por vacante (`/admin/vacantes/:id/aplicantes`).
- Auto-puntuación: requisitos 60 % + ubicación 25 % + completitud 15 %.
- Badges de puntaje: verde ≥75, ámbar 60–74, rojo <60.
- Modal de perfil con CV embebido (PDF) y notas internas (guardado automático 1,5 s).
- Dashboard resumen (`/admin/dashboard`): stat cards, actividad reciente, acciones rápidas.

### Analítica (`/admin/analytics`)

- Embudo del pipeline (por fase).
- Tiempo promedio de contratación por ubicación.
- Rendimiento por vacante (tasas de conversión, ordenación).
- Actividad del equipo (solo roles con `users:read`).

### Panel de plataforma (`/platform/*`)

| Ruta | Contenido |
|---|---|
| `/platform` | Overview: empresas, usuarios, vacantes, postulaciones totales |
| `/platform/companies` | Gestión de empresas |
| `/platform/users` | Gestión de usuarios global |
| `/platform/roles` | Roles y permisos |
| `/platform/audit` | Log de auditoría |
| `/platform/config` | Configuración de plataforma |
| `/platform/ops` | Operaciones: deploy, feature flags, logs |

### Email automatizado

`EmailDispatcherService` — background service, polling 15 s. Flujo: `pending → sending → sent / failed`. Máx. 3 reintentos. Envíos programados con timer configurable por candidato.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | .NET 8, C#, Entity Framework Core 8 |
| Base de datos | PostgreSQL 16 |
| API | REST + Swagger (solo desarrollo) |
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7 |
| HTTP | Axios con interceptor JWT auto-adjunto |
| Estado global | React Context (`AuthContext`) |
| Drag & Drop | Pointer Events personalizado (mouse + táctil) |
| Iconos | `lucide-react` |
| Auth backend | JWT Bearer 8.0.11 + BCrypt.Net-Next 4.0.3 |
| Email | MailKit + `EmailDispatcherService` (hosted service) |
| Seguridad | Cloudflare Turnstile CAPTCHA + CF Access Zero Trust |
| Exposición pública | Cloudflare Tunnel (`cloudflared`) |

---

## Estructura del proyecto

```
Plataforma-de-Reclutamiento-ATS---Kanban-Board-/
├── RecruitmentAPI/                  # API REST .NET 8
│   ├── Controllers/                 # 14 controllers
│   │   ├── AuthController.cs
│   │   ├── VacantesController.cs
│   │   ├── PostulacionesController.cs
│   │   ├── AnalyticsController.cs
│   │   ├── PlatformController.cs
│   │   ├── EmpresasController.cs
│   │   ├── UsuariosController.cs
│   │   ├── RolesController.cs
│   │   ├── AuditController.cs
│   │   ├── FeatureFlagsController.cs
│   │   ├── OpsController.cs
│   │   └── ...
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── VacanteService.cs
│   │   ├── PostulacionService.cs
│   │   ├── ScoringService.cs
│   │   ├── EmailDispatcherService.cs
│   │   ├── EmailService.cs
│   │   ├── AuditService.cs
│   │   ├── DeploymentService.cs
│   │   ├── FeatureFlagService.cs
│   │   └── CurrentUser.cs          # ICurrentUser: reads JWT claims
│   ├── Repositories/
│   ├── Models/ + DTOs/
│   ├── Data/ + Migrations/
│   ├── Middleware/
│   └── Storage/CVs/                # Uploaded CVs (UUID filenames)
│
└── recruitment-frontend/            # SPA React 19
    └── src/
        ├── pages/
        │   ├── NewLandingPage.jsx
        │   ├── PublicVacantesPage.jsx
        │   ├── AuthPage.jsx
        │   ├── CandidateDashboard.jsx
        │   ├── RecruiterDashboard.jsx
        │   ├── AdminVacantesPage.jsx
        │   ├── KanbanAllPage.jsx
        │   ├── VacanteAplicantesPage.jsx
        │   ├── ManagerAnalytics.jsx
        │   ├── EmpresasPage.jsx, RecursosPage.jsx,
        │   │   PreciosPage.jsx, ContactoPage.jsx
        │   ├── LegalTerminosPage.jsx, LegalPrivacidadPage.jsx
        │   └── platform/            # 7 platform admin pages
        ├── components/
        │   ├── kanban/              # KanbanBoard, KanbanColumn, CandidateCard,
        │   │                        # CandidateProfileModal, RechazadosTray, CommandBar
        │   ├── common/              # Can, ProtectedRoute, NoPlanModal, Modal,
        │   │                        # EmailTimerBadge, Pagination, Breadcrumb…
        │   ├── landing/             # LandingNav, LandingFooter, hero, job cards
        │   ├── postulaciones/       # ApplyModal (4-step wizard)
        │   ├── auth/
        │   ├── dashboard/
        │   ├── planes/
        │   └── legal/
        ├── layouts/
        │   ├── PublicLayout.jsx     # LandingNav + LandingFooter + public-theme
        │   ├── MainLayout.jsx       # Admin navbar
        │   └── PlatformLayout.jsx   # Sidebar drawer + hamburger (responsive)
        ├── api/                     # Axios modules: postulacionesApi, vacantesApi,
        │                            # analyticsApi, platformApi, usuariosApi…
        ├── context/                 # AuthContext (JWT, user, permissions)
        ├── hooks/                   # usePermission, useRechazadosRestore
        ├── data/                    # Static marketing content
        ├── styles/                  # talentbridge.css, public-theme.css, admin-theme.css
        └── utils/                   # vacanteHelpers, formatters
```

---

## Rutas del frontend

| Ruta | Página | Acceso | Permiso requerido |
|---|---|---|---|
| `/` | NewLandingPage | Público | — |
| `/jobs` | PublicVacantesPage | Público | — (legacy) |
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
| `/admin/usuarios` | AdminUsuariosPage | Auth | rol Admin |
| `/platform` | PlatformOverview | Auth | `platform:access` |
| `/platform/companies` | PlatformCompanies | Auth | `companies:read` |
| `/platform/users` | PlatformUsers | Auth | `users:read` |
| `/platform/roles` | PlatformRoles | Auth | `roles:read` |
| `/platform/audit` | PlatformAudit | Auth | `audit:read` |
| `/platform/config` | PlatformConfig | Auth | `platform:configure` |
| `/platform/ops` | PlatformOps | Auth | `deployment:trigger` |
| `*` | NotFoundPage | Público | — |

---

## RBAC

**8 roles · 41 permisos** vía tabla `usuario_roles` (multi-empresa).

| Rol | Nivel | Alcance | Uso principal |
|---|---|---|---|
| Candidate | App | Empresa propia | Ver postulaciones propias |
| Recruiter | App | Empresa | Crear/gestionar vacantes propias |
| Manager | App | Empresa | Aprobar, ver todo, analítica |
| Admin | Plataforma | Global | Usuarios, empresas, auditoría |
| Owner | Plataforma | Global | Control total (rol inmutable) |
| Developer | Plataforma | Global | Feature flags, logs |
| DevOps | Plataforma | Global | Deploy, infra |
| DBA | Plataforma | Global | Operaciones de base de datos |

**Frontend:** `usePermission()` hook, `<Can permission="...">` wrapper, `ProtectedRoute requiredPermission`.

**Crítico:** `company_id` en el JWT proviene de `usuario_roles.EmpresaId`, no de `usuarios.EmpresaId`.

---

## Arquitectura

```
Request flow:
  Browser → Vite proxy /api → .NET Controller → Service → Repository → EF Core → PostgreSQL

Auth flow:
  POST /api/auth/login
    → JWT (8h) → localStorage (tb_token, tb_user)
    → AuthContext → axiosInstance Bearer header
    → 401 → clear storage + redirect /login

Paywall flow (empresa_required):
  API → 402 empresa_required
    → NoPlanModal → /precios
```

### Diseño del sistema CSS

1. Tokens Tailwind 4 en `@theme` (`src/index.css`): `bg-navy`, `text-accent`, etc.
2. Clases semánticas en `talentbridge.css` (botones, cards, navbar).
3. Tema público en `public-theme.css` (turquesa `#40e0d0`, fondo `#071326`).
4. Tema admin en `admin-theme.css`.
5. Componentes con inline styles usan bloques `<style>` + `@media` queries para responsive.

**Tipografía:** Playwrite IE (marca), Playfair Display (títulos), DM Sans (cuerpo).

### Kanban — drag-and-drop táctil

Implementado con Pointer Events (sin librerías externas):
- Mouse: drag activa a los 5 px de movimiento.
- Táctil/Chrome responsive: long-press 280 ms activa drag; deslizar rápido cancela (scroll normal).
- `data-kanban-column` en contenedores de columna + `elementFromPoint` para detección de drop.

---

## Desarrollo local

### Requisitos

```bash
sudo apt update && sudo apt install -y nodejs npm postgresql postgresql-contrib
sudo snap install dotnet-sdk --classic --channel=8.0
sudo snap alias dotnet-sdk.dotnet dotnet
dotnet tool install --global dotnet-ef --version 8.0.11
```

### Base de datos

```bash
sudo -u postgres psql -c "CREATE USER recruitment_user WITH PASSWORD '...';"
sudo -u postgres psql -c "CREATE DATABASE recruitment_db OWNER recruitment_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE recruitment_db TO recruitment_user;"
```

### Migraciones y arranque

```bash
# Terminal 1 — Backend
cd RecruitmentAPI
dotnet-ef database update
dotnet run
# → http://localhost:5223  |  /swagger

# Terminal 2 — Frontend
cd recruitment-frontend
npm install && npm run dev
# → http://localhost:5173
```

### Acceso en red local

- Vite escucha en `0.0.0.0:5173` (`allowedHosts: true` en vite.config.js).
- Backend en `0.0.0.0:5223`.
- `ALLOWED_ORIGIN` en `.env` del backend: orígenes separados por coma.
- Firewall: `sudo ufw allow 5223/tcp && sudo ufw allow 5173/tcp`.

---

## Seguridad

- Credenciales exclusivamente en archivos `.env` (no comprometidos en git).
- Upload de CV: solo `.pdf` / `.doc` / `.docx`, máx. 5 MB, nombres renombrados a UUID.
- Cabeceras HTTP: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- Kestrel sin cabecera `Server` (`AddServerHeader = false`).
- Rate limiting en `/api/auth/login`: 5 peticiones/min por IP.
- Cloudflare Turnstile CAPTCHA en login y registro (desactivable en `.env` para dev local).
- Cloudflare Access Zero Trust JWT para todas las rutas `/platform/*`.

---

## Documentación adicional

| Archivo | Propósito |
|---|---|
| `CLAUDE.md` | Contexto de desarrollo para Claude Code (no público) |
| `PAYMENT_PROPOSALS.md` | Opciones de integración de pagos y hoja de ruta |
| `MDs/UBUNTU_SERVER_SETUP.md` | Setup paso a paso en Ubuntu |
| `MDs/PENTESTING.md` | Auditoría de seguridad |
| `docs/Manual_Usuario_Talentify_SV.docx` | Manual de usuario (español) para candidatos, reclutadores y administradores |

---

© 2026 Talentify SV. Todos los derechos reservados.
