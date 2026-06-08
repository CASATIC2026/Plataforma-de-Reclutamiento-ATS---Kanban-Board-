import { useEffect } from 'react';
import { X } from 'lucide-react';
import { getPuntajeStyle } from '../../utils/vacanteHelpers';

const ESTADO_LABELS = {
  '-1': 'Rechazado',
  0: 'Pendiente',
  1: 'En Revisión',
  2: 'Prueba Técnica',
  3: 'Oferta',
};

export default function ApplicationDetailModal({ app, onClose }) {
  useEffect(() => {
    if (!app) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [app, onClose]);

  if (!app) return null;

  const estadoKey = String(app.estado);
  const estadoLabel = ESTADO_LABELS[estadoKey] ?? 'Pendiente';
  const rejected = app.estado === -1;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          className="pointer-events-auto w-full max-w-md rounded-2xl border border-outline-variant/10 bg-[#101C2F] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-on-surface font-display truncate">
                {app.vacanteTitulo}
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Postulado el{' '}
                {new Date(app.createdAt).toLocaleDateString('es-SV', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {rejected ? (
              <div className="rounded-xl border border-error/30 bg-error-container/30 p-4">
                <p className="text-error text-sm font-medium">
                  Lo sentimos, tu aplicación no fue seleccionada en esta ocasión.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-tertiary/20 bg-tertiary/10 p-4">
                <p className="text-tertiary text-sm">
                  Tu aplicación está siendo revisada. Te notificaremos sobre cualquier cambio.
                </p>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center gap-4">
                <span className="text-on-surface-variant">Estado actual</span>
                <span className="px-3 py-1 rounded-full font-semibold bg-surface-container-high text-on-surface">
                  {estadoLabel}
                </span>
              </div>

              {app.puntaje != null && (
                <div className="flex justify-between items-center gap-4">
                  <span className="text-on-surface-variant">Puntaje de compatibilidad</span>
                  <span
                    className="px-3 py-1 rounded-full font-bold text-xs"
                    style={getPuntajeStyle(app.puntaje)}
                  >
                    {Math.round(app.puntaje)}/100
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Última actualización</span>
                <span className="text-on-surface font-medium">
                  {new Date(app.updatedAt).toLocaleDateString('es-SV')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
