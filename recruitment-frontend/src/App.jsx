import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';
import NewLandingPage from './pages/NewLandingPage';
import AuthPage from './pages/AuthPage';
import AdminVacantesPage from './pages/AdminVacantesPage';
import AdminPostulacionesPage from './pages/AdminPostulacionesPage';
import KanbanAllPage from './pages/KanbanAllPage';
import VacanteAplicantesPage from './pages/VacanteAplicantesPage';
import AdminUsuariosPage from './pages/AdminUsuariosPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
            <Route path="/admin/vacantes" element={<AdminVacantesPage />} />
            <Route path="/admin/vacantes/:id/aplicantes" element={<VacanteAplicantesPage />} />
            <Route path="/admin/postulaciones" element={<AdminPostulacionesPage />} />
            <Route path="/admin/kanban" element={<KanbanAllPage />} />
            <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
