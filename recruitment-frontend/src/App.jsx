import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';
import PublicVacantesPage from './pages/PublicVacantesPage';
import AdminVacantesPage from './pages/AdminVacantesPage';
import AdminPostulacionesPage from './pages/AdminPostulacionesPage';
import KanbanPage from './pages/KanbanPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicVacantesPage />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/admin/vacantes" element={<AdminVacantesPage />} />
          <Route path="/admin/postulaciones" element={<AdminPostulacionesPage />} />
          <Route path="/admin/kanban" element={<KanbanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
