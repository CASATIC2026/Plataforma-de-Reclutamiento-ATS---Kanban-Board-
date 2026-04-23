export default function JobCard({ job, onClick }) {
  return (
    <div
      className={`job-card${job.urgent ? ' job-card--urgent' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Ver vacante: ${job.title}`}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <div className="job-card__header">
        <div
          className="job-card__logo"
          style={{ background: job.logoBg, color: job.logoColor }}
        >
          {job.logoLetters}
        </div>
        <div className="job-card__badges">
          {job.urgent && <span className="badge badge--urgent">🔥 Nueva</span>}
          <span className="badge badge--category">{job.type}</span>
        </div>
      </div>

      <h3 className="job-card__title">{job.title}</h3>
      <p className="job-card__company">{job.company}</p>

      <div className="job-card__details">
        <div className="job-card__detail">
          <span className="detail-icon">📍</span>
          <span>{job.location}</span>
        </div>
        <div className="job-card__detail">
          <span className="detail-icon">⏱</span>
          <span>{job.type}</span>
        </div>
        <div className="job-card__salary">
          <span>💰</span> {job.salary}
        </div>
        <div className="job-card__detail">
          <span className="detail-icon">📋</span>
          <span>
            {job.requirements.length > 0
              ? `${job.requirements.length} requisito${job.requirements.length !== 1 ? 's' : ''}`
              : 'Ver detalles'}
          </span>
        </div>
      </div>

      <p className="job-card__desc">{job.description}</p>

      <div className="job-card__footer">
        <span className="job-card__time">{job.posted}</span>
        <span className="job-card__cta">Ver detalles →</span>
      </div>
    </div>
  );
}
