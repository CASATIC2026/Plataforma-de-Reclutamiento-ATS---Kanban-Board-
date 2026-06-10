import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getPostulaciones, getPostulacionesByVacante, updateEstado, sendEmailNow, cancelEmail, restartEmailTimer } from '../../api/postulacionesApi';
import KanbanColumn from './KanbanColumn';
import CandidateProfileModal from './CandidateProfileModal';

const COLUMNS = [
  { estado: 0, title: 'Nuevo',          color: 'bg-teal-light text-teal' },
  { estado: 1, title: 'Entrevista',     color: 'bg-accent-bg text-accent' },
  { estado: 2, title: 'Prueba Técnica', color: 'bg-surface-2 text-navy' },
  { estado: 3, title: 'Oferta',         color: 'bg-green-light text-green' },
];

const MAX_TOASTS = 10;
let toastIdCounter = 0;

export default function KanbanBoard({ vacanteId, filterFn, sortFn, onCardsUpdate, onRechazadosChange }) {
  const [cards, setCards]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [toasts, setToasts]             = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [ghost, setGhost]               = useState(null);   // { card, x, y } while dragging
  const [hoverCol, setHoverCol]         = useState(null);   // estado of column under cursor

  const ghostRef          = useRef(null);
  const dragSessionRef    = useRef(null);
  const dragJustEndedRef  = useRef(false);

  const visibleCards = useMemo(() => {
    let result = filterFn ? cards.filter(filterFn) : [...cards];
    if (sortFn) result.sort(sortFn);
    return result;
  }, [cards, filterFn, sortFn]);

  useEffect(() => { onCardsUpdate?.(visibleCards); }, [visibleCards, onCardsUpdate]);
  useEffect(() => {
    onRechazadosChange?.(cards.filter(c => c.estado === -1));
  }, [cards, onRechazadosChange]);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastIdCounter;
    setToasts(prev => {
      const next = [...prev, { id, message, type }];
      return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
    });
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  useEffect(() => {
    (vacanteId ? getPostulacionesByVacante(vacanteId) : getPostulaciones())
      .then(res => setCards(res.data))
      .catch(() => showToast('Error al cargar postulaciones', 'error'))
      .finally(() => setLoading(false));
  }, [vacanteId, showToast]);

  useEffect(() => {
    const id = setInterval(() => {
      (vacanteId ? getPostulacionesByVacante(vacanteId) : getPostulaciones())
        .then(res => setCards(res.data))
        .catch(err => console.error('Polling error:', err));
    }, 30000);
    return () => clearInterval(id);
  }, [vacanteId]);

  const handleDropToEstado = useCallback(async (card, targetEstado) => {
    if (card.estado === targetEstado) return;
    const prevCards = cards;
    setCards(p => p.map(c => c.id === card.id ? { ...c, estado: targetEstado } : c));
    try {
      const res = await updateEstado(card.id, targetEstado);
      setCards(p => p.map(c => c.id === card.id ? res.data : c));
      showToast(`Movido a "${COLUMNS.find(c => c.estado === targetEstado)?.title}"`, 'success');
    } catch {
      setCards(prevCards);
      showToast('Error al actualizar estado', 'error');
    }
  }, [cards, showToast]);

  // ---------- Pointer-based drag (works for mouse + touch) ----------
  const onCardPointerDown = useCallback((card, e) => {
    if (e.button !== undefined && e.button !== 0) return;

    const session = {
      card,
      startX: e.clientX,
      startY: e.clientY,
      isTouch: e.pointerType !== 'mouse',
      activated: false,
      holdTimer: null,
    };

    const findColAt = (x, y) => {
      if (ghostRef.current) ghostRef.current.style.display = 'none';
      const el = document.elementFromPoint(x, y);
      if (ghostRef.current) ghostRef.current.style.display = '';
      const colEl = el?.closest('[data-kanban-column]');
      return colEl ? parseInt(colEl.dataset.kanbanColumn, 10) : null;
    };

    const activate = (x, y) => {
      if (!dragSessionRef.current || dragSessionRef.current.activated) return;
      dragSessionRef.current.activated = true;
      document.body.style.userSelect = 'none';
      document.body.style.touchAction = 'none';
      document.body.style.cursor = 'grabbing';
      setGhost({ card: session.card, x, y });
      setHoverCol(findColAt(x, y));
    };

    const onMove = (me) => {
      const s = dragSessionRef.current;
      if (!s) return;
      const dx = me.clientX - s.startX;
      const dy = me.clientY - s.startY;
      const dist = Math.hypot(dx, dy);

      if (!s.activated) {
        if (!s.isTouch && dist > 5) {
          activate(me.clientX, me.clientY);
        } else if (s.isTouch && dist > 12) {
          // user is scrolling — abort drag
          cleanup();
          return;
        }
      }

      if (s.activated) {
        me.preventDefault?.();
        setGhost({ card: s.card, x: me.clientX, y: me.clientY });
        setHoverCol(findColAt(me.clientX, me.clientY));
      }
    };

    const onUp = (ue) => {
      const s = dragSessionRef.current;
      if (!s) { cleanup(); return; }

      if (s.activated) {
        const targetEstado = findColAt(ue.clientX, ue.clientY);
        if (targetEstado !== null) {
          handleDropToEstado(s.card, targetEstado);
        }
        dragJustEndedRef.current = true;
        setTimeout(() => { dragJustEndedRef.current = false; }, 250);
      }
      cleanup();
    };

    const cleanup = () => {
      const s = dragSessionRef.current;
      if (s?.holdTimer) clearTimeout(s.holdTimer);
      dragSessionRef.current = null;
      setGhost(null);
      setHoverCol(null);
      document.body.style.userSelect = '';
      document.body.style.touchAction = '';
      document.body.style.cursor = '';
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    };

    dragSessionRef.current = session;
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);

    if (session.isTouch) {
      session.holdTimer = setTimeout(() => {
        activate(session.startX, session.startY);
      }, 280);
    }
  }, [handleDropToEstado]);

  // Cleanup body styles if component unmounts mid-drag
  useEffect(() => () => {
    document.body.style.userSelect = '';
    document.body.style.touchAction = '';
    document.body.style.cursor = '';
  }, []);

  const handleEmailAction = useCallback(async (id, action, opts) => {
    try {
      if (action === 'send-now') await sendEmailNow(id);
      if (action === 'cancel')   await cancelEmail(id);
      if (action === 'restart')  await restartEmailTimer(id, opts?.minutes);
      const res = await (vacanteId ? getPostulacionesByVacante(vacanteId) : getPostulaciones());
      setCards(res.data);
      showToast('Email actualizado', 'success');
    } catch {
      showToast('Error al actualizar email', 'error');
    }
  }, [vacanteId, showToast]);

  const handleCardClick = useCallback(p => {
    if (dragJustEndedRef.current) return;   // suppress click right after a drag
    setSelectedCard(p);
  }, []);

  const handleNotasUpdated = useCallback(p => {
    setCards(prev => prev.map(c => c.id === p.id ? p : c));
    setSelectedCard(p);
  }, []);

  return (
    <div className="relative">
      <style>{`
        .kb-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          align-items: stretch;
        }
        .kb-col-cards {
          max-height: 560px;
        }
        .kb-col[data-hover="true"] {
          box-shadow: 0 0 0 2px var(--color-accent), 0 6px 20px rgba(0,0,0,0.35);
          transform: translateY(-2px);
        }
        @media (max-width: 870px) {
          .kb-board {
            grid-template-columns: repeat(2, 1fr);
          }
          .kb-col-cards {
            max-height: 420px;
          }
        }
        @media (max-width: 470px) {
          .kb-board {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .kb-col-cards {
            max-height: 260px;
          }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
      `}</style>

      {/* Toasts */}
      <div style={{ position: 'fixed', right: '1.5rem', top: '5rem', zIndex: 50 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            marginBottom: 8, padding: '10px 20px', borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            fontSize: 13, fontWeight: 600,
            backgroundColor: t.type === 'error' ? '#3a0f0c' : '#0f2e2a',
            color: t.type === 'error' ? '#ffb4ab' : '#6ad9c0',
            border: t.type === 'error' ? '1px solid rgba(255,180,171,0.4)' : '1px solid rgba(106,217,192,0.4)',
            animation: 'fadeUp 0.25s ease',
          }}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Phase boxes */}
      <div className="kb-board">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.estado}
            estado={col.estado}
            title={col.title}
            color={col.color}
            loading={loading}
            cards={visibleCards.filter(c => c.estado === col.estado)}
            isHover={hoverCol === col.estado}
            onCardPointerDown={onCardPointerDown}
            onCardClick={handleCardClick}
            onEmailAction={handleEmailAction}
          />
        ))}
      </div>

      {/* Drag ghost — follows pointer */}
      {ghost && (
        <div
          ref={ghostRef}
          style={{
            position: 'fixed',
            left: ghost.x - 110,
            top: ghost.y - 26,
            pointerEvents: 'none',
            zIndex: 9999,
            width: 220,
            transform: 'rotate(-2deg)',
            opacity: 0.92,
          }}
        >
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-accent)',
            borderRadius: 10,
            padding: '10px 12px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--color-navy)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {ghost.card.nombreCandidato}
            </div>
            <div style={{
              fontSize: 11, color: 'var(--color-slate)', marginTop: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {ghost.card.email}
            </div>
          </div>
        </div>
      )}

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
