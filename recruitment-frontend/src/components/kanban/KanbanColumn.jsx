import CandidateCard from './CandidateCard';

const PHASE_ACCENT = {
  0: { bar: '#40e0d0', bg: 'rgba(64,224,208,0.10)',  text: '#40e0d0' },
  1: { bar: '#f0b07a', bg: 'rgba(240,176,122,0.10)', text: '#f0b07a' },
  2: { bar: '#93c5fd', bg: 'rgba(147,197,253,0.10)', text: '#93c5fd' },
  3: { bar: '#6ad9c0', bg: 'rgba(106,217,192,0.10)', text: '#6ad9c0' },
};

export default function KanbanColumn({
  title,
  estado,
  cards,
  loading,
  isHover,
  onCardPointerDown,
  onCardClick,
  onEmailAction,
}) {
  const accent = PHASE_ACCENT[estado] ?? PHASE_ACCENT[0];
  const total = cards.length;

  return (
    <div
      className="kb-col"
      data-kanban-column={estado}
      data-hover={isHover ? 'true' : 'false'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderTop: `3px solid ${accent.bar}`,
        borderRadius: 14,
        overflow: 'hidden',
        minWidth: 0,
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
    >
      {/* Phase header */}
      <div
        data-kanban-column={estado}
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: accent.bg,
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13, color: accent.text, letterSpacing: '0.02em' }}>
          {title}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 700,
          background: accent.bar + '22',
          color: accent.text,
          padding: '2px 9px',
          borderRadius: 20,
        }}>
          {loading ? '…' : total}
        </span>
      </div>

      {/* Card list — scrollable */}
      <div
        className="kb-col-cards"
        data-kanban-column={estado}
        style={{
          flex: 1,
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          overflowY: 'auto',
        }}
      >
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: 10,
                background: 'var(--color-border)',
                height: 96,
                animation: 'pulse 1.5s infinite',
                flexShrink: 0,
              }}
            />
          ))
        ) : total === 0 ? (
          <div
            data-kanban-column={estado}
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              color: 'var(--color-muted)',
              fontSize: 12,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>—</div>
            Sin candidatos
          </div>
        ) : (
          cards.map(card => (
            <div key={card.id} data-kanban-column={estado} style={{ flexShrink: 0 }}>
              <CandidateCard
                postulacion={card}
                onPointerDown={onCardPointerDown}
                onCardClick={onCardClick}
                onEmailAction={onEmailAction}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
