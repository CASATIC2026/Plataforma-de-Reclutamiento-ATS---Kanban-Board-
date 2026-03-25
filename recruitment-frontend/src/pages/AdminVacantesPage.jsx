import { useState, useEffect } from 'react';
import { getVacantes, createVacante, deleteVacante } from '../api/vacantesApi';
import VacanteForm from '../components/vacantes/VacanteForm';
import VacanteList from '../components/vacantes/VacanteList';

export default function AdminVacantesPage() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVacantes = async () => {
    try {
      const response = await getVacantes();
      setVacantes(response.data);
    } catch (error) {
      console.error('Error fetching vacantes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacantes();
  }, []);

  const handleCreate = async (data) => {
    await createVacante(data);
    fetchVacantes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta vacante?')) return;
    await deleteVacante(id);
    fetchVacantes();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-navy">Administrar Vacantes</h1>

      <VacanteForm onSubmit={handleCreate} />

      <div>
        <h2 className="text-lg font-semibold text-navy mb-4">
          Vacantes creadas ({vacantes.length})
        </h2>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <VacanteList
            vacantes={vacantes}
            onDelete={handleDelete}
            showActions={true}
          />
        )}
      </div>
    </div>
  );
}