import { formatRelativeDate, getPuntajeStyle } from '../../utils/vacanteHelpers';
import EmailTimerBadge from '../common/EmailTimerBadge';

export default function ReviewCard({
  application,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  onEmailAction,
}) {
  return (
    <div
      className={`bg-surface rounded-xl border shadow-sm p-4 transition-all ${
        isSelected ? 'border-accent ring-1 ring-accent' : 'border-border'
      }`}
    >
      {/* Header row: checkbox + name + vacancy */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(application.id, e.target.checked)}
          className="mt-1 accent-accent cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-navy truncate">
              {application.nombreCandidato}
            </span>
            {application.puntaje != null && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={getPuntajeStyle(application.puntaje)}
              >
                {Math.round(application.puntaje)}
              </span>
            )}
          </div>
          <p className="text-xs text-slate mt-0.5 truncate">
            {application.vacantetitulo ?? application.vacanteTitulo ?? '—'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatRelativeDate(application.createdAt)}
          </p>
        </div>
      </div>

      {/* Email timer */}
      {application.emailStatus && (
        <div className="mt-3">
          <EmailTimerBadge
            emailStatus={application.emailStatus}
            emailScheduledFor={application.emailScheduledFor}
            emailSentAt={application.emailSentAt}
            emailType={application.emailTypeToSend}
            emailRetryCount={application.emailRetryCount}
            onSendNow={() => onEmailAction?.(application.id, 'send-now')}
            onCancel={() => onEmailAction?.(application.id, 'cancel')}
            onRestart={(mins) => onEmailAction?.(application.id, 'restart', { minutes: mins })}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onApprove(application.id)}
          className="flex-1 text-sm font-semibold py-1.5 rounded-lg bg-green-bg text-green hover:bg-tertiary/25 border border-green/30 transition-colors"
        >
          Aprobar
        </button>
        <button
          onClick={() => onReject(application.id)}
          className="flex-1 text-sm font-semibold py-1.5 rounded-lg bg-error-container/30 text-error hover:bg-error-container/50 border border-error/30 transition-colors"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
