import { useEffect, useRef, useState } from 'react';
import { updateNotas, getCvUrl } from '../../api/postulacionesApi';
import { formatRelativeDate } from '../../utils/vacanteHelpers';

const ESTADO_LABELS = {
  0: { label: 'Nuevo',          color: 'bg-teal-light text-teal' },
  1: { label: 'Entrevista',     color: 'bg-accent-bg text-accent' },
  2: { label: 'Prueba Técnica', color: 'bg-gray-800 text-white' },
  3: { label: 'Oferta',         color: 'bg-green-light text-green' },
};

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-navy font-medium mt-0.5">{value}</p>
    </div>
  );
}

export default function CandidateProfileModal({ postulacion, onClose, onNotasUpdated }) {
  const [notas, setNotas] = useState(postulacion.notasInternas ?? '');
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const isFirstRender = useRef(true);
  const saveTimer = useRef(null);

  const ext = postulacion.cvFileName?.split('.').pop()?.toLowerCase();
  const hasCv = Boolean(postulacion.cvFileName);
  const isPdf = ext === 'pdf';
  const cvUrl = hasCv ? getCvUrl(postulacion.id) : null;

  const estado = ESTADO_LABELS[postulacion.estado] ?? ESTADO_LABELS[0];

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Auto-save notes with 1.5s debounce
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await updateNotas(postulacion.id, notas || null);
        onNotasUpdated(res.data);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('error');
      }
    }, 1500);

    return () => clearTimeout(saveTimer.current);
  }, [notas]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{postulacion.nombreCandidato}</h2>
            <p className="text-sm text-navy font-medium mt-0.5">{postulacion.vacanteTitulo}</p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estado.color}`}>
              {estado.label}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none font-bold"
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">

          {/* Left: CV preview */}
          <div className="flex-1 flex flex-col border-r border-gray-100 min-w-0">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Curriculum Vitae</p>
            </div>

            <div className="flex-1 min-h-0">
              {!hasCv && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No hay CV adjunto</p>
                </div>
              )}

              {hasCv && isPdf && (
                <iframe
                  src={cvUrl}
                  title="CV del candidato"
                  className="w-full h-full border-0"
                  style={{ minHeight: '400px' }}
                />
              )}

              {hasCv && !isPdf && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                  <svg className="w-14 h-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Archivo <span className="uppercase text-navy">.{ext}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">La previsualización no está disponible para este formato</p>
                  </div>
                  <a
                    href={cvUrl}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy-light transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar CV
                  </a>
                </div>
              )}
            </div>

            {/* Download link when PDF */}
            {hasCv && isPdf && (
              <div className="px-5 py-2 border-t border-gray-100 bg-gray-50 flex justify-end">
                <a
                  href={cvUrl}
                  download
                  className="text-xs text-navy hover:text-navy-light font-medium flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar
                </a>
              </div>
            )}
          </div>

          {/* Right: info + notes */}
          <div className="w-72 flex-shrink-0 flex flex-col overflow-y-auto">

            {/* Candidate info */}
            <div className="px-5 py-4 border-b border-gray-100 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Datos del candidato</p>
              <InfoRow label="Correo" value={postulacion.email} />
              <InfoRow label="Teléfono" value={postulacion.telefono} />
              <InfoRow label="Postulado" value={formatRelativeDate(postulacion.createdAt)} />
              <InfoRow label="Vacante" value={postulacion.vacanteTitulo} />
            </div>

            {/* Notes */}
            <div className="flex flex-col flex-1 px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Notas internas
                </p>
                {saveStatus === 'saving' && (
                  <span className="text-xs text-gray-400 animate-pulse">Guardando…</span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-xs text-emerald-500 font-medium">Guardado</span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-xs text-red-500 font-medium">Error al guardar</span>
                )}
              </div>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Agrega observaciones, comentarios del equipo o próximos pasos…"
                className="flex-1 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 text-sm text-navy placeholder-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                style={{ minHeight: '140px' }}
              />
              <p className="text-xs text-gray-400 mt-2">
                Se guarda automáticamente al dejar de escribir.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
