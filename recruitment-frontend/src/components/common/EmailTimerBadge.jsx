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
      <div className={`${containerBase} bg-[rgba(106,217,192,0.14)] text-[#6ad9c0] border-[rgba(106,217,192,0.3)]`}>
        <span>✓</span>
        <span className="font-medium">{EMAIL_TYPE_LABELS[emailType] ?? 'Email'} enviado</span>
        {emailSentAt && <span className="text-[#6ad9c0]/70">{formatTime(emailSentAt)}</span>}
      </div>
    );
  }

  if (emailStatus === 'sending') {
    return (
      <div className={`${containerBase} bg-[rgba(96,165,250,0.14)] text-[#93c5fd] border-[rgba(96,165,250,0.3)]`}>
        <span className="animate-spin inline-block w-3 h-3 border-2 border-[#93c5fd] border-t-transparent rounded-full" />
        <span className="font-medium">Enviando…</span>
      </div>
    );
  }

  if (emailStatus === 'failed') {
    return (
      <div className={`${containerBase} bg-[rgba(255,180,171,0.14)] text-[#ffb4ab] border-[rgba(255,180,171,0.3)]`}>
        <span>✗</span>
        <span className="font-medium">Error al enviar</span>
        {emailRetryCount > 0 && <span className="text-[#ffb4ab]/70">({emailRetryCount} intento{emailRetryCount > 1 ? 's' : ''})</span>}
        <button
          onClick={onRestart}
          className="ml-auto text-xs font-semibold text-[#ffb4ab] hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (emailStatus === 'cancelled') {
    return (
      <div className={`${containerBase} bg-[rgba(255,255,255,0.05)] text-[#8593b3] border-[rgba(255,255,255,0.12)]`}>
        <span>⊘</span>
        <span className="font-medium">Email cancelado</span>
        <button
          onClick={() => onRestart?.(5)}
          className="ml-auto text-xs font-semibold text-[#b8c2dc] hover:underline"
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
            ? 'bg-[rgba(240,176,122,0.16)] text-[#f0b07a] border-[rgba(240,176,122,0.4)] animate-pulse'
            : 'bg-[rgba(96,165,250,0.14)] text-[#93c5fd] border-[rgba(96,165,250,0.3)]'
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
                ? 'bg-[rgba(240,176,122,0.3)] hover:bg-[rgba(240,176,122,0.45)] text-[#f0b07a]'
                : 'bg-[rgba(96,165,250,0.3)] hover:bg-[rgba(96,165,250,0.45)] text-[#bfdbfe]'
            }`}
          >
            ⚡
          </button>
          <button
            onClick={onCancel}
            title="Cancelar email"
            className="text-xs font-bold px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.18)] text-[#b8c2dc] transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
}
