<<<<<<< HEAD
import { useEffect, useState } from "react";
import KanbanBoard from "../components/postulaciones/KanbanBoard";
import { getPostulaciones } from "../api/postulacionesApi";

const AdminPostulacionesPage = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostulaciones()
      .then(setPostulaciones)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Cargando postulaciones...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Tablero de Candidatos
      </h1>
      <KanbanBoard postulaciones={postulaciones} />
    </div>
  );
};

export default AdminPostulacionesPage;
=======
import { useState, useEffect } from 'react';
import { getPostulaciones, deletePostulacion } from '../api/postulacionesApi';
import PostulacionList from '../components/postulaciones/PostulacionList';

export default function AdminPostulacionesPage() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroVacante, setFiltroVacante] = useState('');

  const fetchPostulaciones = async () => {
    try {
      const response = await getPostulaciones();
      setPostulaciones(response.data);
    } catch (error) {
      console.error('Error fetching postulaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostulaciones();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta postulación?')) return;
    await deletePostulacion(id);
    fetchPostulaciones();
  };

  // Unique vacante titles for the filter dropdown
  const vacantes = [...new Set(postulaciones.map((p) => p.vacanteTitulo))].sort();

  const filtradas = filtroVacante
    ? postulaciones.filter((p) => p.vacanteTitulo === filtroVacante)
    : postulaciones;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-800">
          Postulaciones ({filtradas.length})
        </h1>

        {vacantes.length > 0 && (
          <select
            value={filtroVacante}
            onChange={(e) => setFiltroVacante(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas las vacantes</option>
            {vacantes.map((titulo) => (
              <option key={titulo} value={titulo}>
                {titulo}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <PostulacionList postulaciones={filtradas} onDelete={handleDelete} />
      )}
    </div>
  );
}
>>>>>>> 0145ebc5970147f9474b6bd257190a89db667477
