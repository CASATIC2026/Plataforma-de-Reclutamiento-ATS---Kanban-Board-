import { useState } from 'react';
import { formatRelativeDate, getPuntajeStyle } from '../../utils/vacanteHelpers';
import CandidateSummary from './CandidateSummary';

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
                return (
                  <div
                    key={postulacion.id}
                    className="flex-shrink-0 w-80 bg-white rounded-lg border border-red-200 p-3 shadow-sm"
                  >
                    <CandidateSummary postulacion={postulacion} />

                    {/* Footer: date + score + restore button */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {formatRelativeDate(postulacion.createdAt)}
                        </span>
                        {postulacion.puntaje != null && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-bold"
                            style={getPuntajeStyle(postulacion.puntaje)}
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
