import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';
import NewLandingPage from './pages/NewLandingPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

const AdminVacantesPage = lazy(() => import('./pages/AdminVacantesPage'));
const AdminPostulacionesPage = lazy(() => import('./pages/AdminPostulacionesPage'));
const KanbanAllPage = lazy(() => import('./pages/KanbanAllPage'));
const VacanteAplicantesPage = lazy(() => import('./pages/VacanteAplicantesPage'));
const AdminUsuariosPage = lazy(() => import('./pages/AdminUsuariosPage'));

function AdminFallback() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-slate)',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
      }}
    >
      Cargando…
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route element={<PublicLayout />}>
              <Route path="/" element={<NewLandingPage />} />
            </Route>
            <Route element={
              <ProtectedRoute allowedRoles={['Administrador', 'Manager']}>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route
                path="/admin/vacantes"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminVacantesPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/vacantes/:id/aplicantes"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <VacanteAplicantesPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/postulaciones"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminPostulacionesPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/kanban"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <KanbanAllPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/usuarios"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminUsuariosPage />
                  </Suspense>
                }
              />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
