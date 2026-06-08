import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVacanteById } from '../api/vacantesApi';
import { sendEmailNow, cancelEmail, restartEmailTimer } from '../api/postulacionesApi';
import KanbanBoard from '../components/kanban/KanbanBoard';
import RechazadosTray from '../components/kanban/RechazadosTray';
import { useRechazadosRestore } from '../hooks/useRechazadosRestore';
import { formatSalaryRange, formatId } from '../utils/vacanteHelpers';
import Breadcrumb from '../components/common/Breadcrumb';

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

  const { handleRestore } = useRechazadosRestore(setRechazados);

  const handleTrayEmailAction = useCallback(async (id, action, opts) => {
    try {
      if (action === 'send-now') await sendEmailNow(id);
      if (action === 'cancel')   await cancelEmail(id);
      if (action === 'restart')  await restartEmailTimer(id, opts?.minutes);
      const nextStatus = action === 'send-now' ? 'sending' : action === 'cancel' ? 'cancelled' : 'pending';
      setRechazados((prev) =>
        prev.map((p) => (p.id === id ? { ...p, emailStatus: nextStatus } : p))
      );
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-accent-bg">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/vacantes')}
            className="flex items-center gap-2 text-navy hover:text-navy-light font-semibold mb-6 transition-colors"
          >
            ← Volver a Vacantes
          </button>

          {loading ? (
            <div className="text-slate">Cargando vacante...</div>
          ) : vacante ? (
            <>
              <Breadcrumb
                items={[
                  { label: 'Administración' },
                  { label: 'Vacantes', onClick: () => navigate('/admin/vacantes') },
                  { label: vacante.titulo },
                ]}
              />

              {/* Vacancy Header Card */}
              <div className="bg-surface border border-border rounded-2xl shadow-sm p-8 mb-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-extrabold text-navy mb-2">
                      {vacante.titulo}
                    </h1>
                    <p className="text-slate text-lg">
                      {vacante.postulacionesCount || 0} aplicante{vacante.postulacionesCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate mb-2">ID</div>
                    <div className="font-mono text-navy font-semibold">
                      {formatId(vacante.id)}
                    </div>
                  </div>
                </div>

                {/* Vacancy Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate">
                      Ubicación
                    </span>
                    <p className="text-navy font-semibold mt-2">{vacante.ubicacion}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate">
                      Tipo de Contrato
                    </span>
                    <p className="text-navy font-semibold mt-2">{vacante.tipoContrato}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate">
                      Rango Salarial
                    </span>
                    <p className="text-navy font-semibold mt-2">
                      {formatSalaryRange(vacante.salarioMin, vacante.salarioMax)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate">
                      Estado
                    </span>
                    <p className="mt-2">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          vacante.estaActiva
                            ? 'bg-green-bg text-green'
                            : 'bg-error-container/40 text-error'
                        }`}
                      >
                        {vacante.estaActiva ? 'Activa' : 'Inactiva'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Requisitos */}
                {vacante.requisitos && vacante.requisitos.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-border/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate">
                      Requisitos
                    </span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {vacante.requisitos.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-accent-bg text-navy text-xs font-semibold rounded-full"
                        >
                          ✓ {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Kanban Section */}
              <div className="bg-surface border border-border rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-extrabold text-navy mb-8">
                  Pipeline de Candidatos
                </h2>
                <KanbanBoard vacanteId={id} onRechazadosChange={setRechazados} />

                {/* Rejected candidates tray */}
                <RechazadosTray rechazados={rechazados} onRestore={handleRestore} onEmailAction={handleTrayEmailAction} />
              </div>
            </>
          ) : (
            <div className="text-error bg-error-container/30 p-6 rounded-lg">
              Vacante no encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
