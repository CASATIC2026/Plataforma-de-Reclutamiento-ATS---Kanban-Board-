import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';
import PlatformLayout from './layouts/PlatformLayout';
import NewLandingPage from './pages/NewLandingPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

const AdminVacantesPage      = lazy(() => import('./pages/AdminVacantesPage'));
const AdminPostulacionesPage = lazy(() => import('./pages/AdminPostulacionesPage'));
const KanbanAllPage          = lazy(() => import('./pages/KanbanAllPage'));
const VacanteAplicantesPage  = lazy(() => import('./pages/VacanteAplicantesPage'));
const AdminUsuariosPage      = lazy(() => import('./pages/AdminUsuariosPage'));
const CandidateDashboard     = lazy(() => import('./pages/CandidateDashboard'));
const RecruiterDashboard     = lazy(() => import('./pages/RecruiterDashboard'));
const ManagerAnalytics       = lazy(() => import('./pages/ManagerAnalytics'));

// Platform pages
const PlatformOverview   = lazy(() => import('./pages/platform/PlatformOverview'));
const PlatformCompanies  = lazy(() => import('./pages/platform/PlatformCompanies'));
const PlatformUsers      = lazy(() => import('./pages/platform/PlatformUsers'));
const PlatformRoles      = lazy(() => import('./pages/platform/PlatformRoles'));
const PlatformAudit      = lazy(() => import('./pages/platform/PlatformAudit'));
const PlatformConfig     = lazy(() => import('./pages/platform/PlatformConfig'));
const PlatformOps        = lazy(() => import('./pages/platform/PlatformOps'));

function Fallback() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-slate)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
    }}>
      Cargando…
    </div>
  );
}

const S = (Page) => <Suspense fallback={<Fallback />}><Page /></Suspense>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<AuthPage />} />

            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<NewLandingPage />} />
            </Route>

            {/* Candidate dashboard (any authenticated user with the right permission) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredPermission="applications:read_own">
                  <Suspense fallback={<Fallback />}><CandidateDashboard /></Suspense>
                </ProtectedRoute>
              }
            />

            {/* Admin / Recruiter routes (wrapped in MainLayout) */}
            <Route element={
              <ProtectedRoute allowedRoles={['Administrador', 'Manager']}>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="/admin/dashboard"    element={S(RecruiterDashboard)} />
              <Route path="/admin/vacantes"     element={S(AdminVacantesPage)} />
              <Route path="/admin/vacantes/:id/aplicantes" element={S(VacanteAplicantesPage)} />
              <Route path="/admin/postulaciones" element={S(AdminPostulacionesPage)} />
              <Route path="/admin/kanban"       element={S(KanbanAllPage)} />
              <Route path="/admin/usuarios"     element={S(AdminUsuariosPage)} />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requiredPermission="reports:read">
                    {S(ManagerAnalytics)}
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Platform routes (wrapped in PlatformLayout) */}
            <Route
              path="/platform"
              element={
                <ProtectedRoute requiredPermission="platform:access">
                  <PlatformLayout />
                </ProtectedRoute>
              }
            >
              <Route index        element={S(PlatformOverview)} />
              <Route path="companies" element={S(PlatformCompanies)} />
              <Route path="users"     element={S(PlatformUsers)} />
              <Route path="roles"     element={S(PlatformRoles)} />
              <Route path="audit"     element={S(PlatformAudit)} />
              <Route path="config"    element={S(PlatformConfig)} />
              <Route path="ops"       element={S(PlatformOps)} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
