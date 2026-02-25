import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PublicVacantesPage from './pages/PublicVacantesPage';
import AdminVacantesPage from './pages/AdminVacantesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<PublicVacantesPage />} />
          <Route path="/admin/vacantes" element={<AdminVacantesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}