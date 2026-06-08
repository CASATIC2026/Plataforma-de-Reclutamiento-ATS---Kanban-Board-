import { useState } from 'react';
import { formatRelativeDate, getPuntajeStyle } from '../../utils/vacanteHelpers';
import CandidateSummary from './CandidateSummary';
import EmailTimerBadge from '../common/EmailTimerBadge';

export default function RechazadosTray({ rechazados, onRestore, onEmailAction }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (rechazados.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-surface rounded-xl shadow-sm border border-error/20">
      {/* Header / Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-error-container/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">⊖</span>
          <h3 className="font-semibold text-error">
            Rechazados por screening ({rechazados.length})
          </h3>
        </div>
        <span className="text-gray-400">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-error/20 px-6 py-4 bg-error-container/15">
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {rechazados.map((postulacion) => {
                return (
                  <div
                    key={postulacion.id}
                    className="flex-shrink-0 w-80 bg-surface-2 rounded-lg border border-error/20 p-3 shadow-sm"
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
                        className="text-xs font-semibold text-green hover:bg-green-bg px-2 py-1 rounded transition-colors"
                      >
                        Restaurar
                      </button>
                    </div>

                    {postulacion.emailStatus && (
                      <div className="mt-2 border-t border-error/15 pt-2">
                        <EmailTimerBadge
                          emailStatus={postulacion.emailStatus}
                          emailScheduledFor={postulacion.emailScheduledFor}
                          emailSentAt={postulacion.emailSentAt}
                          emailType={postulacion.emailTypeToSend}
                          emailRetryCount={postulacion.emailRetryCount}
                          onSendNow={() => onEmailAction?.(postulacion.id, 'send-now')}
                          onCancel={() => onEmailAction?.(postulacion.id, 'cancel')}
                          onRestart={(mins) => onEmailAction?.(postulacion.id, 'restart', { minutes: mins })}
                        />
                      </div>
                    )}
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
