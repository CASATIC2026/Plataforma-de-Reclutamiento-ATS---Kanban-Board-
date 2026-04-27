import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getPostulaciones, getPostulacionesByVacante, updateEstado } from '../../api/postulacionesApi';
import KanbanColumn from './KanbanColumn';
import CandidateProfileModal from './CandidateProfileModal';

const COLUMNS = [
  { estado: 0, title: 'Nuevo',          color: 'bg-teal-light text-teal' },
  { estado: 1, title: 'Entrevista',     color: 'bg-accent-bg text-accent' },
  { estado: 2, title: 'Prueba Técnica', color: 'bg-slate-100 text-slate-900' },
  { estado: 3, title: 'Oferta',         color: 'bg-green-light text-green' },
];

const MAX_TOASTS = 10;
let toastIdCounter = 0;

export default function KanbanBoard({ vacanteId, filterFn, sortFn, onCardsUpdate, onRechazadosChange }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const dragId = useRef(null);

  // Compute visible (filtered + sorted) cards
  const visibleCards = useMemo(() => {
    let result = filterFn ? cards.filter(filterFn) : [...cards];
    if (sortFn) result.sort(sortFn);
    return result;
  }, [cards, filterFn, sortFn]);

  // Notify parent when visible cards change
  useEffect(() => {
    onCardsUpdate?.(visibleCards);
  }, [visibleCards, onCardsUpdate]);

  // Notify parent of rejected candidates (unfiltered)
  useEffect(() => {
    const rechazados = cards.filter((c) => c.estado === -1);
    onRechazadosChange?.(rechazados);
  }, [cards, onRechazadosChange]);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastIdCounter;
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Initial fetch
  useEffect(() => {
    const fetchPostulaciones = vacanteId
      ? getPostulacionesByVacante(vacanteId)
      : getPostulaciones();

    fetchPostulaciones
      .then((res) => setCards(res.data))
      .catch(() => showToast('Error al cargar postulaciones', 'error'))
      .finally(() => setLoading(false));
  }, [vacanteId, showToast]);

  // Auto-refresh every 30 seconds to catch changes from other users
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchPostulaciones = vacanteId
        ? getPostulacionesByVacante(vacanteId)
        : getPostulaciones();

      fetchPostulaciones
        .then((res) => setCards(res.data))
        .catch((err) => console.error('Polling error:', err));
    }, 30000);

    return () => clearInterval(interval);
  }, [vacanteId]);

  const handleDragStart = useCallback((e, id) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    async (e, targetEstado) => {
      e.preventDefault();
      const id = dragId.current;
      if (!id) return;

      const card = cards.find((c) => c.id === id);
      if (!card || card.estado === targetEstado) return;

      const previousCards = cards;
      setCards((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, estado: targetEstado } : c
        )
      );

      try {
        const res = await updateEstado(id, targetEstado);
        setCards((prev) =>
          prev.map((c) => (c.id === id ? res.data : c))
        );
        const col = COLUMNS.find((c) => c.estado === targetEstado);
        showToast(`Movido a "${col?.title}"`, 'success');
      } catch {
        setCards(previousCards);
        showToast('Error al actualizar estado', 'error');
      }
    },
    [cards, showToast]
  );

  const handleCardClick = useCallback((postulacion) => {
    setSelectedCard(postulacion);
  }, []);

  const handleNotasUpdated = useCallback((updatedPostulacion) => {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedPostulacion.id ? updatedPostulacion : c))
    );
    setSelectedCard(updatedPostulacion);
  }, []);

  return (
    <div className="relative">
      {/* Toasts */}
      <div className="fixed right-6 z-50" style={{ top: '5rem' }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="mb-2 px-5 py-3 rounded-lg shadow-lg text-sm font-semibold"
            style={{
              backgroundColor: t.type === 'error' ? '#ef4444' : 'var(--color-score-high-bg)',
              color: t.type === 'error' ? '#fff' : 'var(--color-navy)',
              border: t.type === 'error' ? '1px solid #dc2626' : '1px solid #6ee7b7',
              animation: 'fadeUp 0.25s ease',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(({ estado, title, color }) => (
          <KanbanColumn
            key={estado}
            estado={estado}
            title={title}
            color={color}
            loading={loading}
            cards={visibleCards.filter((c) => c.estado === estado)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Candidate profile modal */}
      {selectedCard && (
        <CandidateProfileModal
          postulacion={selectedCard}
          onClose={() => setSelectedCard(null)}
          onNotasUpdated={handleNotasUpdated}
        />
      )}
    </div>
  );
}
