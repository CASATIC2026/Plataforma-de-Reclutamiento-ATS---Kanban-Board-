import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';
import PublicVacantesPage from './pages/PublicVacantesPage';
import NewLandingPage from './pages/NewLandingPage';
import AuthPage from './pages/AuthPage';
import AdminVacantesPage from './pages/AdminVacantesPage';
import AdminPostulacionesPage from './pages/AdminPostulacionesPage';
import KanbanPage from './pages/KanbanPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route element={<PublicLayout />}>
            <Route path="/" element={<NewLandingPage />} />
            <Route path="/jobs" element={<PublicVacantesPage />} />
          </Route>
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/admin/vacantes" element={<AdminVacantesPage />} />
            <Route path="/admin/postulaciones" element={<AdminPostulacionesPage />} />
            <Route path="/admin/kanban" element={<KanbanPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
