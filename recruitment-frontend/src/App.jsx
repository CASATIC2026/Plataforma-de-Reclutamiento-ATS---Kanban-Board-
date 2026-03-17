import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';
import PublicVacantesPage from './pages/PublicVacantesPage';
import AdminVacantesPage from './pages/AdminVacantesPage';
import AdminPostulacionesPage from './pages/AdminPostulacionesPage';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
