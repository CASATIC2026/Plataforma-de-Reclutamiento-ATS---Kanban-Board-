import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getEmailLog } from '../../api/postulacionesApi';

const TYPE_ICONS = {
  confirmacion_recepcion: '✉',
  rechazo_screening:      '✗',
  avance_entrevista:      '↑',
  prueba_tecnica:         '💻',
  oferta:                 '🎉',
};

const STATUS_STYLES = {
  sent:    { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Enviado'   },
  failed:  { bg: 'bg-red-50',    text: 'text-danger',     label: 'Error'     },
  pending: { bg: 'bg-blue-50',   text: 'text-blue-700',   label: 'Pendiente' },
};

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-SV', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function EmailLogModal({ postulacionId, isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !postulacionId) return;
    setLoading(true);
    getEmailLog(postulacionId)
      .then(setLogs)
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [isOpen, postulacionId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Historial de emails">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-slate py-6 text-center">Sin registros de email.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((entry) => {
            const statusStyle = STATUS_STYLES[entry.status] ?? STATUS_STYLES.pending;
            const icon = TYPE_ICONS[entry.emailType] ?? '✉';
            return (
              <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-gray-50">
                <span className="text-lg mt-0.5">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-navy truncate">
                      {entry.subject ?? entry.emailType}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDateTime(entry.sentAt)}
                    {entry.attemptCount > 1 && ` · ${entry.attemptCount} intentos`}
                  </p>
                  {entry.lastError && (
                    <p className="text-xs text-danger mt-1 truncate">{entry.lastError}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
