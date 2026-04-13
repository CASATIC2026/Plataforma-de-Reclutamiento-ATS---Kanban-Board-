import { useState } from 'react';
import { formatRelativeDate, getColorForId } from '../../utils/vacanteHelpers';

export default function RechazadosTray({ rechazados, onRestore }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (rechazados.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-red-200/50">
      {/* Header / Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">⊖</span>
          <h3 className="font-semibold text-red-700">
            Rechazados por screening ({rechazados.length})
          </h3>
        </div>
        <span className="text-gray-400">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-red-200/50 px-6 py-4 bg-red-50/30">
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {rechazados.map((postulacion) => {
                const vacancyColor = postulacion.vacanteId ? getColorForId(postulacion.vacanteId) : null;
                return (
                  <div
                    key={postulacion.id}
                    className="flex-shrink-0 w-80 bg-white rounded-lg border border-red-200 p-3 shadow-sm"
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

                    {/* Footer: date + score + restore button */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {formatRelativeDate(postulacion.createdAt)}
                        </span>
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
                      </div>
                      <button
                        onClick={() => onRestore(postulacion.id)}
                        className="text-xs font-semibold text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors"
                      >
                        Restaurar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
