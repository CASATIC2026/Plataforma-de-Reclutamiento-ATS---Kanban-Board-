import { formatRelativeDate, getColorForId } from '../../utils/vacanteHelpers';

export default function CandidateCard({ postulacion, onDragStart, onCardClick }) {
  const hasCv = Boolean(postulacion.cvFileName);
  const hasNotes = Boolean(postulacion.notasInternas);
  const vacancyColor = postulacion.vacanteId ? getColorForId(postulacion.vacanteId) : null;
  const isOferta = postulacion.estado === 3;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, postulacion.id)}
      onClick={() => onCardClick?.(postulacion)}
      style={isOferta ? { borderLeft: '4px solid #319E85' } : {}}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-accent transition-all select-none"
    >
      {/* Candidate name */}
      <p className="font-semibold text-gray-900 text-sm truncate">
        {postulacion.nombreCandidato}
      </p>

      {/* Vacancy pill */}
      {vacancyColor ? (
        <div
          className="text-xs font-medium px-2.5 py-1 rounded-full mt-2 inline-block truncate max-w-full"
          style={{
            backgroundColor: vacancyColor.bg,
            color: vacancyColor.text,
          }}
          title={postulacion.vacanteTitulo}
        >
          {postulacion.vacanteTitulo}
        </div>
      ) : (
        <p className="text-xs text-navy font-medium truncate mt-0.5">
          {postulacion.vacanteTitulo}
        </p>
      )}

      {/* Contact info */}
      <div className="mt-2 space-y-0.5">
        <p className="text-xs text-gray-500 truncate">{postulacion.email}</p>
        {postulacion.telefono && (
          <p className="text-xs text-gray-500">{postulacion.telefono}</p>
        )}
      </div>

      {/* Footer: time + badges */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {formatRelativeDate(postulacion.createdAt)}
        </span>
        <div className="flex items-center gap-1">
          {postulacion.puntaje != null && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor: postulacion.puntaje >= 75 ? '#d1fae5' : postulacion.puntaje >= 60 ? '#fef3c7' : '#fee2e2',
                color: postulacion.puntaje >= 75 ? '#065f46' : postulacion.puntaje >= 60 ? '#92400e' : '#991b1b',
              }}
            >
              {Math.round(postulacion.puntaje)}
            </span>
          )}
          {hasNotes && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium" title="Tiene notas internas">
              Notas
            </span>
          )}
          {hasCv && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
              CV
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
