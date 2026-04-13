import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVacanteById } from '../api/vacantesApi';
import { updateEstado } from '../api/postulacionesApi';
import KanbanBoard from '../components/kanban/KanbanBoard';
import RechazadosTray from '../components/kanban/RechazadosTray';

export default function VacanteAplicantesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacante, setVacante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rechazados, setRechazados] = useState([]);

  useEffect(() => {
    const fetchVacante = async () => {
      try {
        const response = await getVacanteById(id);
        setVacante(response.data);
      } catch (error) {
        console.error('Error loading vacancy:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacante();
  }, [id]);

  const handleRestore = useCallback(
    async (postulacionId) => {
      try {
        await updateEstado(postulacionId, 0); // Move to Nuevo
        // Refresh rechazados list
        setRechazados((prev) => prev.filter((r) => r.id !== postulacionId));
      } catch (err) {
        console.error('Error restoring candidate:', err);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] to-[#eaedff]">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/vacantes')}
            className="flex items-center gap-2 text-[#3525cd] hover:text-[#2816b8] font-semibold mb-6 transition-colors"
          >
            ← Volver a Vacantes
          </button>

          {loading ? (
            <div className="text-[#464555]">Cargando vacante...</div>
          ) : vacante ? (
            <>
              <nav className="flex items-center gap-2 text-[#464555] text-xs mb-4">
                <span>Administración</span>
                <span>›</span>
                <span
                  onClick={() => navigate('/admin/vacantes')}
                  className="cursor-pointer hover:text-[#3525cd]"
                >
                  Vacantes
                </span>
                <span>›</span>
                <span className="text-[#3525cd] font-medium">{vacante.titulo}</span>
              </nav>

              {/* Vacancy Header Card */}
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-extrabold text-[#131b2e] mb-2">
                      {vacante.titulo}
                    </h1>
                    <p className="text-[#464555] text-lg">
                      {vacante.postulacionesCount || 0} aplicante{vacante.postulacionesCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#464555] mb-2">ID</div>
                    <div className="font-mono text-[#3525cd] font-semibold">
                      {vacante.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Vacancy Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                      Ubicación
                    </span>
                    <p className="text-[#131b2e] font-semibold mt-2">{vacante.ubicacion}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                      Tipo de Contrato
                    </span>
                    <p className="text-[#131b2e] font-semibold mt-2">{vacante.tipoContrato}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                      Rango Salarial
                    </span>
                    <p className="text-[#131b2e] font-semibold mt-2">
                      {vacante.salarioMin && vacante.salarioMax
                        ? `$${vacante.salarioMin.toLocaleString()} - $${vacante.salarioMax.toLocaleString()}`
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                      Estado
                    </span>
                    <p className="mt-2">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          vacante.estaActiva
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {vacante.estaActiva ? 'Activa' : 'Inactiva'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Requisitos */}
                {vacante.requisitos && vacante.requisitos.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-[#c7c4d8]/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                      Requisitos
                    </span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {vacante.requisitos.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#e2dfff] text-[#3525cd] text-xs font-semibold rounded-full"
                        >
                          ✓ {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Kanban Section */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-extrabold text-[#131b2e] mb-8">
                  Pipeline de Candidatos
                </h2>
                <KanbanBoard vacanteId={id} onRechazadosChange={setRechazados} />

                {/* Rejected candidates tray */}
                <RechazadosTray rechazados={rechazados} onRestore={handleRestore} />
              </div>
            </>
          ) : (
            <div className="text-[#ba1a1a] bg-red-50 p-6 rounded-lg">
              Vacante no encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
