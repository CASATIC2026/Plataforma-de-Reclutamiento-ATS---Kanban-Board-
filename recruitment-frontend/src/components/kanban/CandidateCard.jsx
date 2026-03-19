import { formatRelativeDate } from '../../utils/vacanteHelpers';

export default function CandidateCard({ postulacion, onDragStart }) {
  const hasCv = Boolean(postulacion.cvFileName);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, postulacion.id)}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-indigo-300 transition-all select-none"
    >
      {/* Candidate name */}
      <p className="font-semibold text-gray-900 text-sm truncate">
        {postulacion.nombreCandidato}
      </p>

      {/* Vacancy title */}
      <p className="text-xs text-indigo-600 font-medium truncate mt-0.5">
        {postulacion.vacanteTitulo}
      </p>

      {/* Contact info */}
      <div className="mt-2 space-y-0.5">
        <p className="text-xs text-gray-500 truncate">{postulacion.email}</p>
        {postulacion.telefono && (
          <p className="text-xs text-gray-500">{postulacion.telefono}</p>
        )}
      </div>

      {/* Footer: time + CV badge */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {formatRelativeDate(postulacion.createdAt)}
        </span>
        {hasCv && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
            CV
          </span>
        )}
      </div>
    </div>
  );
}
