import { useEffect } from 'react';
import { X, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';

export default function JobDetailModal({ job, onClose, onApply }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!job) return null;

  const metaCards = [
    { icon: MapPin, label: 'Ubicación', value: job.location || 'Remoto' },
    { icon: Clock, label: 'Modalidad', value: job.type || 'Tiempo completo' },
    { icon: DollarSign, label: 'Salario', value: job.salary || 'A convenir' },
    { icon: Calendar, label: 'Publicado', value: job.posted || '—' },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-job-title"
          className="pointer-events-auto flex flex-col w-full md:max-w-2xl max-h-[92vh] md:max-h-[90vh] rounded-t-3xl md:rounded-3xl border border-outline-variant/10 bg-[#101C2F] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between p-6 md:p-8 border-b border-outline-variant/10">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 font-display font-bold text-xl"
                style={{ background: job.logoBg, color: job.logoColor }}
              >
                {job.logoLetters}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  {job.badge === 'new' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-tertiary/10 text-tertiary border border-tertiary/20">
                      Nuevo
                    </span>
                  )}
                  {job.badge === 'urgent' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-error-container/20 text-error border border-error/20">
                      Urgente
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-container-high text-on-surface-variant">
                    {job.type}
                  </span>
                </div>
                <h2
                  id="modal-job-title"
                  className="text-xl md:text-2xl font-bold text-brand-turquoise font-display mb-1 line-clamp-2"
                >
                  {job.title}
                </h2>
                <p className="text-on-surface-variant text-sm truncate">{job.company}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all ml-2"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 p-6 md:p-8 border-b border-outline-variant/10">
            {metaCards.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-4 rounded-2xl border border-outline-variant/5 bg-[#142033]"
              >
                <Icon className="w-5 h-5 text-brand-turquoise flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-on-surface truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
            <h3 className="text-lg font-bold text-on-surface font-display mb-3">Descripción del puesto</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm whitespace-pre-wrap">
              {job.description}
            </p>
            {job.requirements?.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-on-surface font-display mt-8 mb-3">Requisitos</h3>
                <ul className="space-y-2">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-on-surface-variant">
                      <span className="text-brand-turquoise">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-6 border-t border-outline-variant/10 bg-[#142033]">
            <button
              type="button"
              onClick={onApply}
              className="flex-1 px-6 py-3 rounded-2xl bg-brand-turquoise text-on-brand-turquoise font-bold text-sm shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all"
            >
              Aplicar a esta vacante
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl border border-outline-variant/20 text-on-surface-variant font-semibold text-sm hover:border-brand-turquoise hover:text-brand-turquoise transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
