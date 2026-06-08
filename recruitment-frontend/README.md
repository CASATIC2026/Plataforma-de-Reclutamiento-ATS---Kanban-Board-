# Talentify sv — Frontend de Reclutamiento

Frontend React 19.2 + Vite 8 para la plataforma ATS Talentify sv. Bolsa de empleo responsive, sitio de marketing, portal de reclutadores y panel multi-empresa con Kanban drag-and-drop.

**Última actualización:** junio 2026

---

## Inicio rápido

```bash
npm install
npm run dev      # desarrollo con HMR, proxy /api → backend
npm run build    # producción → dist/
npm run preview  # vista previa de dist/
```

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:5223` (proxy Vite en `/api`)

---

## Stack

| Tecnología | Uso |
|---|---|
| React 19.2 | UI con Hooks y Context API |
| Vite 8 | Build, HMR, proxy |
| Tailwind CSS 4 | Utilidades + `@theme` en `index.css` |
| React Router 7 | Navegación SPA |
| Axios | Cliente HTTP con interceptor JWT |
| @dnd-kit | Kanban simple (`postulaciones/`) |
| HTML5 DnD | Kanban operacional (`kanban/`) |
| lucide-react | Iconos en landing y filtros |

**Fuentes:** Playwrite IE (marca), Playfair Display (títulos), DM Sans (cuerpo).

---

## Estructura

```
src/
├── App.jsx                    # Rutas + lazy loading
├── layouts/
│   ├── PublicLayout.jsx       # LandingNav + LandingFooter + public-theme
│   ├── MainLayout.jsx         # Admin reclutadores
│   └── PlatformLayout.jsx     # Admin plataforma
├── pages/
│   ├── NewLandingPage.jsx     # / — bolsa principal
│   ├── PublicVacantesPage.jsx # /jobs — legacy
│   ├── EmpresasPage.jsx       # Marketing empresas
│   ├── RecursosPage.jsx       # Artículos
│   ├── PreciosPage.jsx        # Planes y FAQ
│   ├── ContactoPage.jsx       # Contacto
│   ├── LegalTerminosPage.jsx  # Términos
│   ├── LegalPrivacidadPage.jsx
│   ├── AuthPage.jsx           # Login / registro
│   ├── CandidateDashboard.jsx # Panel candidato
│   ├── AdminVacantesPage.jsx  # CRUD vacantes
│   ├── KanbanAllPage.jsx      # Kanban operacional
│   └── platform/              # PlatformOverview, Companies, Users…
├── components/
│   ├── landing/               # Nav, footer, hero, job cards
│   ├── auth/                  # LoginForm, RegisterForm, AuthLayout
│   ├── dashboard/             # Panel candidato
│   ├── legal/, planes/, recursos/
│   ├── kanban/                # Kanban completo HTML5
│   ├── postulaciones/         # ApplyModal 4 pasos
│   └── common/                # ProtectedRoute, Can, Modal…
├── data/                      # Contenido estático (contacto, precios, legal)
├── api/                       # 15 clientes REST
├── context/AuthContext.jsx
├── hooks/                     # usePermission, useRechazadosRestore
└── styles/
    ├── talentbridge.css       # Design system base
    ├── public-theme.css       # Tema marketing
    └── admin-theme.css        # Tema admin
```

---

## Rutas

| Ruta | Auth | Componente | Descripción |
|---|---|---|---|
| `/` | Público | NewLandingPage | Landing + bolsa (6 jobs/página, filtros) |
| `/jobs` | Público | PublicVacantesPage | Bolsa clásica (deprecated, polling 30 s) |
| `/empresas` | Público | EmpresasPage | Página para empresas |
| `/recursos` | Público | RecursosPage | Recursos y artículos |
| `/precios` | Público | PreciosPage | Planes y precios |
| `/contacto` | Público | ContactoPage | Formulario de contacto |
| `/legal/terminos` | Público | LegalTerminosPage | Términos de servicio |
| `/legal/privacidad` | Público | LegalPrivacidadPage | Privacidad |
| `/login` | Público | AuthPage | Iniciar sesión / registrarse |
| `/dashboard` | Protegido | CandidateDashboard | Postulaciones del candidato |
| `/admin/dashboard` | Protegido | RecruiterDashboard | Stats del reclutador |
| `/admin/vacantes` | Protegido | AdminVacantesPage | Gestión de vacantes |
| `/admin/vacantes/:id/aplicantes` | Protegido | VacanteAplicantesPage | Kanban por vacante |
| `/admin/kanban` | Protegido | KanbanAllPage | Kanban operacional completo |
| `/admin/analytics` | Protegido | ManagerAnalytics | Analítica de pipeline |
| `/platform/*` | Protegido | Platform pages | Admin multi-empresa |

---

## Características clave

### Bolsa pública
- Paginación, filtros por departamento y contrato, tags dinámicos de skills.
- Formulario de 4 pasos con CV, screening y disponibilidad.
- Tema oscuro turquesa bajo `.public-theme`.

### Admin
- Modal CRUD de vacantes con stats y screening configurable.
- Kanban con drag-and-drop optimista, toasts, bandeja de rechazados.
- Badges de puntaje y modal de perfil con CV y notas.

### Auth
- JWT en `localStorage` (`tb_token`, `tb_user`).
- Interceptor Axios; 401 → logout + redirect `/login`.
- `ProtectedRoute` + `usePermission()` + `<Can>`.

---

## Desarrollo local

```bash
# Terminal 1 — API
cd ../RecruitmentAPI && dotnet run

# Terminal 2 — Frontend
npm run dev
```

**Proxy Vite** (`vite.config.js`): `/api/*` → `http://localhost:5223/api/*`

**LAN:** `host: '0.0.0.0'`, `allowedHosts: true`. No definir `VITE_API_URL` en `.env`.

---

## Sistema de estilos

1. Tokens en `@theme` (`index.css`)
2. Componentes en `talentbridge.css`
3. Marketing en `public-theme.css`
4. Admin en `admin-theme.css`

---

## Build y despliegue

```bash
npm run build    # → dist/
npm run preview  # → http://localhost:4173
```

En producción sin proxy Vite, configurar `VITE_API_URL` o servir frontend y API bajo el mismo origen.

---

## Documentación relacionada

- [README principal del proyecto](../README.md)
- [Guía técnica para desarrolladores](../../MDs/CLAUDE.md)

---

© 2026 Talentify sv. Todos los derechos reservados.
