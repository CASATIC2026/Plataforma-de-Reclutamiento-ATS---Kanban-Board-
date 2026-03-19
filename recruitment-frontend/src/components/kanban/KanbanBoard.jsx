import { useState, useEffect, useCallback, useRef } from 'react';
import { getPostulaciones, updateEstado } from '../../api/postulacionesApi';
import KanbanColumn from './KanbanColumn';

const COLUMNS = [
  { estado: 0, title: 'Nuevo',          color: 'bg-blue-200 text-blue-900' },
  { estado: 1, title: 'Entrevista',     color: 'bg-yellow-200 text-yellow-900' },
  { estado: 2, title: 'Prueba Técnica', color: 'bg-purple-200 text-purple-900' },
  { estado: 3, title: 'Oferta',         color: 'bg-emerald-200 text-emerald-900' },
];

export default function KanbanBoard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const dragId = useRef(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
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

      // Optimistic update
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
        // Rollback
        setCards(previousCards);
        showToast('Error al actualizar estado', 'error');
      }
    },
    [cards, showToast]
  );

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
          }`}
        >
          {toast.message}
        </div>
      )}

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
          />
        ))}
      </div>
    </div>
  );
}
