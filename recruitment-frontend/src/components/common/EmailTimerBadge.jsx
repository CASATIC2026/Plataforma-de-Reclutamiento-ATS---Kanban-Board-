import { useState, useEffect } from 'react';

const EMAIL_TYPE_LABELS = {
  confirmacion_recepcion: 'Confirmación',
  rechazo_screening:      'Rechazo screening',
};

function formatCountdown(ms) {
  if (ms <= 0) return '00:00';
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' });
}

export default function EmailTimerBadge({
  emailStatus,
  emailScheduledFor,
  emailSentAt,
  emailType,
  emailRetryCount,
  onSendNow,
  onCancel,
  onRestart,
}) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (emailStatus !== 'pending' || !emailScheduledFor) return;
    const update = () => setTimeLeft(Math.max(0, new Date(emailScheduledFor) - Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [emailStatus, emailScheduledFor]);

  const isExpiring = emailStatus === 'pending' && timeLeft <= 10000;

  const containerBase = 'rounded-lg border px-2.5 py-1.5 text-xs flex items-center gap-2 flex-wrap';

  if (emailStatus === 'sent') {
    return (
      <div className={`${containerBase} bg-green-50 text-green-800 border-green-200`}>
        <span>✓</span>
        <span className="font-medium">{EMAIL_TYPE_LABELS[emailType] ?? 'Email'} enviado</span>
        {emailSentAt && <span className="text-green-600">{formatTime(emailSentAt)}</span>}
      </div>
    );
  }

  if (emailStatus === 'sending') {
    return (
      <div className={`${containerBase} bg-blue-50 text-blue-800 border-blue-200`}>
        <span className="animate-spin inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full" />
        <span className="font-medium">Enviando…</span>
      </div>
    );
  }

  if (emailStatus === 'failed') {
    return (
      <div className={`${containerBase} bg-red-50 text-red-800 border-red-200`}>
        <span>✗</span>
        <span className="font-medium">Error al enviar</span>
        {emailRetryCount > 0 && <span className="text-red-500">({emailRetryCount} intento{emailRetryCount > 1 ? 's' : ''})</span>}
        <button
          onClick={onRestart}
          className="ml-auto text-xs font-semibold text-red-700 hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (emailStatus === 'cancelled') {
    return (
      <div className={`${containerBase} bg-gray-50 text-gray-500 border-gray-200`}>
        <span>⊘</span>
        <span className="font-medium">Email cancelado</span>
        <button
          onClick={() => onRestart?.(5)}
          className="ml-auto text-xs font-semibold text-gray-600 hover:underline"
        >
          Reactivar
        </button>
      </div>
    );
  }

  if (emailStatus === 'pending') {
    return (
      <div
        className={`${containerBase} ${
          isExpiring
            ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
            : 'bg-blue-50 text-blue-800 border-blue-200'
        }`}
      >
        <span>✉</span>
        <span className="font-medium">{EMAIL_TYPE_LABELS[emailType] ?? 'Email'}</span>
        <span className="font-mono tabular-nums font-bold">{formatCountdown(timeLeft)}</span>
        <div className="ml-auto flex gap-1">
          <button
            onClick={onSendNow}
            title="Enviar ahora"
            className={`text-xs font-bold px-1.5 py-0.5 rounded transition-colors ${
              isExpiring
                ? 'bg-amber-200 hover:bg-amber-300 text-amber-900'
                : 'bg-blue-200 hover:bg-blue-300 text-blue-900'
            }`}
          >
            ⚡
          </button>
          <button
            onClick={onCancel}
            title="Cancelar email"
            className="text-xs font-bold px-1.5 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
}
