import { useState, useEffect } from 'react';
import { getVacantes } from '../api/vacantesApi';
import VacanteList from '../components/vacantes/VacanteList';

export default function PublicVacantesPage() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacantes = async () => {
      try {
        const response = await getVacantes();
        // Only show active vacantes to candidates
        setVacantes(response.data.filter((v) => v.estaActiva));
      } catch (error) {
        console.error('Error fetching vacantes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVacantes();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Ofertas de Empleo</h1>
        <p className="text-gray-500 mt-1">Encuentra tu próxima oportunidad profesional</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando vacantes...</p>
      ) : (
        <VacanteList vacantes={vacantes} />
      )}
    </div>
  );
}