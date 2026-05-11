import { useState, useEffect, useCallback, useMemo } from 'react';
import { getVacantes } from '../api/vacantesApi';
import { sendEmailNow, cancelEmail, restartEmailTimer } from '../api/postulacionesApi';
import KanbanBoard from '../components/kanban/KanbanBoard';
import RechazadosTray from '../components/kanban/RechazadosTray';
import CommandBar from '../components/kanban/CommandBar';
import { useRechazadosRestore } from '../hooks/useRechazadosRestore';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';

const STAGE_LABELS = ['Nuevo', 'Entrevista', 'Prueba Técnica', 'Oferta'];
const STAGE_COLORS = [
  'var(--color-teal)',
  'var(--color-accent)',
  'var(--color-navy)',
  'var(--color-green)',
];

export default function KanbanAllPage() {
  const { selectedCompanyId } = useAuth();

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    vacanteId: null,
    fecha: 'todos',
    sort: 'reciente',
  });

  // Data state
  const [vacantes, setVacantes] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [rechazados, setRechazados] = useState([]);

  // Fetch vacantes for dropdown — refetch when platform admin changes the company filter
  useEffect(() => {
    getVacantes({ companyId: selectedCompanyId })
      .then((res) => setVacantes(res.data))
      .catch((err) => console.error('Error loading vacantes:', err));
  }, [selectedCompanyId]);

  // Filter function (additive AND)
  const filterFn = useCallback(
    (card) => {
      // Search: matches nombre or email
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !card.nombreCandidato.toLowerCase().includes(q) &&
          !card.email.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // Vacancy filter
      if (filters.vacanteId && card.vacanteId !== filters.vacanteId) {
        return false;
      }

      // Date filter
      if (filters.fecha !== 'todos') {
        const cardDate = new Date(card.createdAt);
        const now = new Date();

        if (filters.fecha === 'hoy') {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (cardDate < today) return false;
        } else if (filters.fecha === 'semana') {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          if (cardDate < weekAgo) return false;
        } else if (filters.fecha === 'mes') {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          if (cardDate < monthAgo) return false;
        }
      }

      return true;
    },
    [filters.search, filters.vacanteId, filters.fecha]
  );

  // Sort function
  const sortFn = useCallback(
    (a, b) => {
      if (filters.sort === 'nombre') {
        return a.nombreCandidato.localeCompare(b.nombreCandidato);
      }
      // reciente: newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    },
    [filters.sort]
  );

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

  // Compute stage counts from visible cards
  const stageCounts = useMemo(
    () =>
      [0, 1, 2, 3].map((estado) => ({
        estado,
        label: STAGE_LABELS[estado],
        color: STAGE_COLORS[estado],
        count: visibleCards.filter((c) => c.estado === estado).length,
      })),
    [visibleCards]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-accent-bg">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <Breadcrumb
            items={[
              { label: 'Administración' },
              { label: 'Pipeline de Candidatos' },
            ]}
          />
          <h1 className="text-4xl md:text-4xl font-extrabold text-navy tracking-tight mb-3">
            Pipeline de Candidatos
          </h1>
          <p className="text-slate max-w-2xl">
            Vista operacional en tiempo real de todos los candidatos en el proceso de selección.
            Arrastra tarjetas para cambiar el estado de los candidatos.
          </p>
        </div>

        {/* Command Bar */}
        <CommandBar filters={filters} setFilters={setFilters} vacantes={vacantes} />

        {/* Pipeline Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stageCounts.map(({ estado, label, color, count }) => (
            <div
              key={estado}
              className="bg-white rounded-xl shadow-sm p-5 border border-border/10"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate">
                    {label}
                  </p>
                  <p className="text-2xl font-black text-navy mt-1">{count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <KanbanBoard
            filterFn={filterFn}
            sortFn={sortFn}
            onCardsUpdate={setVisibleCards}
            onRechazadosChange={setRechazados}
          />

          {/* Rejected candidates tray */}
          <RechazadosTray rechazados={rechazados} onRestore={handleRestore} onEmailAction={handleTrayEmailAction} />
        </div>
      </div>
    </div>
  );
}
