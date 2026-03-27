import { useState, useEffect, useCallback, useRef } from 'react';
import { getPostulaciones, updateEstado } from '../../api/postulacionesApi';
import KanbanColumn from './KanbanColumn';
import CandidateProfileModal from './CandidateProfileModal';

const COLUMNS = [
  { estado: 0, title: 'Nuevo',          color: 'bg-teal-light text-teal' },
  { estado: 1, title: 'Entrevista',     color: 'bg-accent-bg text-accent' },
  { estado: 2, title: 'Prueba Técnica', color: 'bg-navy-lighter text-white' },
  { estado: 3, title: 'Oferta',         color: 'bg-green-light text-green' },
];

const MAX_TOASTS = 10;
let toastIdCounter = 0;

export default function KanbanBoard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const dragId = useRef(null);

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

  useEffect(() => {
    getPostulaciones()
      .then((res) => setCards(res.data))
      .catch(() => showToast('Error al cargar postulaciones', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

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
              backgroundColor: t.type === 'error' ? '#ef4444' : '#d1fae5',
              color: t.type === 'error' ? '#fff' : '#131931',
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
            cards={cards.filter((c) => c.estado === estado)}
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
