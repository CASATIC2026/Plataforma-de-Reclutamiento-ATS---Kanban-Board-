import { useEffect } from 'react';

const INFO_ITEMS = (job) => [
  { icon: '📍', label: 'Ubicación', value: job.location },
  { icon: '⏱', label: 'Modalidad', value: job.type },
  { icon: '💰', label: 'Salario mensual', value: job.salary },
  { icon: '📋', label: 'Publicado', value: job.posted },
];

export default function JobDetailModal({ job, onClose, onApply }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay is-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-job-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <button className="modal__close" aria-label="Cerrar" onClick={onClose}>
          &times;
        </button>

        <div className="modal__header">
          <div
            className="modal__company-logo"
            style={{ background: job.logoBg, color: job.logoColor }}
          >
            {job.logoLetters}
          </div>
          <div className="modal__meta">
            <div className="modal__tags-row">
              {job.urgent && <span className="badge badge--urgent">🔥 Nueva</span>}
              <span className="badge badge--category">{job.type}</span>
            </div>
            <h2 className="modal__title" id="modal-job-title">{job.title}</h2>
            <p className="modal__company">{job.company}</p>
          </div>
        </div>

        <div className="modal__info-grid">
          {INFO_ITEMS(job).map((item) => (
            <div key={item.label} className="modal__info-item">
              <span className="modal__info-icon">{item.icon}</span>
              <div className="modal__info-content">
                <span className="modal__info-label">{item.label}</span>
                <span className="modal__info-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="modal__body">
          <h3>Descripción del puesto</h3>
          <p>{job.description}</p>
          {job.requirements.length > 0 && (
            <>
              <h3>Requisitos</h3>
              <ul>
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </>
          )}
        </div>

        <div className="modal__footer">
          <button className="btn btn--accent btn--lg" onClick={onApply}>
            Aplicar a esta vacante
          </button>
          <button className="btn btn--ghost" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
