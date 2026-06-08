import CandidateCard from './CandidateCard';

export default function KanbanColumn({
  title,
  estado,
  color,
  cards,
  loading,
  onDragStart,
  onDragOver,
  onDrop,
  onCardClick,
  onEmailAction,
}) {
  return (
    <div
      className="flex flex-col bg-gray-50 rounded-xl min-h-[500px] w-64 flex-shrink-0 border border-gray-200"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, estado)}
    >
      {/* Column header */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl ${color}`}>
        <span className="font-semibold text-sm">{title}</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={color.includes('text-white')
            ? { backgroundColor: '#fff', color: 'var(--color-navy)' }
            : { backgroundColor: 'rgba(255,255,255,0.3)' }
          }
        >
          {loading ? '…' : cards.length}
        </span>
      </div>

      {/* Cards area */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface rounded-lg border border-gray-200 p-3 animate-pulse"
            >
              <div className="h-3 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-300 rounded w-1/2 mb-3" />
              <div className="h-2 bg-gray-300 rounded w-5/6 mb-1" />
              <div className="h-2 bg-gray-300 rounded w-1/3" />
            </div>
          ))
        ) : cards.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-xs text-center px-4">
            Arrastra candidatos aquí
          </div>
        ) : (
          cards.map((card) => (
            <CandidateCard
              key={card.id}
              postulacion={card}
              onDragStart={onDragStart}
              onCardClick={onCardClick}
              onEmailAction={onEmailAction}
            />
          ))
        )}
      </div>
    </div>
  );
}
