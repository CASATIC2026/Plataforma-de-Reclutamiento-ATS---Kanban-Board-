import { formatRelativeDate, getPuntajeStyle } from '../../utils/vacanteHelpers';
import CandidateSummary from './CandidateSummary';
import EmailTimerBadge from '../common/EmailTimerBadge';

export default function CandidateCard({ postulacion, onDragStart, onCardClick, onEmailAction }) {
  const hasCv = Boolean(postulacion.cvFileName);
  const hasNotes = Boolean(postulacion.notasInternas);
  const isOferta = postulacion.estado === 3;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, postulacion.id)}
      onClick={() => onCardClick?.(postulacion)}
      className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-accent transition-all select-none ${
        isOferta ? 'border-l-4 border-l-green' : ''
      }`}
    >
      <CandidateSummary postulacion={postulacion} />

      {/* Footer: time + badges */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {formatRelativeDate(postulacion.createdAt)}
        </span>
        <div className="flex items-center gap-1">
          {postulacion.puntaje != null && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={getPuntajeStyle(postulacion.puntaje)}
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

      {postulacion.emailStatus && (
        <div
          className="mt-2 border-t border-gray-100 pt-2"
          onClick={(e) => e.stopPropagation()}
        >
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
}
