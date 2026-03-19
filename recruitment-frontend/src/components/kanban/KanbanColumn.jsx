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
}) {
  return (
    <div
      className="flex flex-col bg-gray-100 rounded-xl min-h-[500px] w-64 flex-shrink-0"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, estado)}
    >
      {/* Column header */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl ${color}`}>
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs font-bold bg-white/30 px-2 py-0.5 rounded-full">
          {loading ? '…' : cards.length}
        </span>
      </div>

      {/* Cards area */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-3 animate-pulse"
            >
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-2 bg-gray-200 rounded w-5/6 mb-1" />
              <div className="h-2 bg-gray-200 rounded w-1/3" />
            </div>
          ))
        ) : cards.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-xs text-center px-4">
            Arrastra candidatos aquí
          </div>
        ) : (
          cards.map((card) => (
            <CandidateCard
              key={card.id}
              postulacion={card}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
