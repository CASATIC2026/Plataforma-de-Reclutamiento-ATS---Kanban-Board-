import { Bookmark } from 'lucide-react';

function SkillTags({ skills, compact }) {
  if (!skills?.length) return null;
  return (
    <div className={`flex gap-2 flex-wrap ${compact ? 'mb-2' : 'mb-4'}`}>
      {skills.map((skill, i) => (
        <span
          key={`${skill}-${i}`}
          className={`rounded-full font-semibold bg-surface-container-highest text-on-surface-variant ${
            compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
          } ${i === 0 && !compact ? 'bg-orange-600/30 text-orange-300' : ''}`}
        >
          {String(skill).toUpperCase()}
        </span>
      ))}
    </div>
  );
}

function JobCardShell({ job, onOpen, className, children }) {
  const open = () => onOpen(job);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={handleKeyDown}
      className={className}
    >
      {children}
    </div>
  );
}

export function DashboardFeaturedJobCard({ job, onOpen, onBookmark, variant = 'desktop' }) {
  const skills = (job.requirements ?? []).slice(0, 3);
  const mobile = variant === 'mobile';

  return (
    <JobCardShell
      job={job}
      onOpen={onOpen}
      className={`w-full text-left rounded-2xl bg-surface-container border border-outline-variant/10 hover:border-brand-turquoise/30 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise/50 ${
        mobile ? 'p-4' : 'p-6'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          {job.badge && (
            <span className="inline-block px-2 py-1 rounded text-xs font-bold text-on-surface-variant bg-surface-container-high mb-3 uppercase tracking-wider">
              {job.badge === 'urgent' ? 'Destacado urgente' : 'Nuevo'}
            </span>
          )}
          <h3
            className={`font-bold text-on-surface mb-2 font-display ${
              mobile ? 'text-lg' : 'text-2xl'
            }`}
          >
            {job.title}
          </h3>
          <p className="text-on-surface-variant text-sm">
            {job.company} • {job.location}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.(job);
          }}
          className="p-2 hover:bg-surface-container-high rounded transition-colors"
          aria-label="Guardar vacante"
        >
          <Bookmark className="w-6 h-6 text-on-surface-variant" />
        </button>
      </div>

      <SkillTags skills={skills} />

      <div
        className={`pt-4 border-t border-outline-variant/10 ${
          mobile ? 'space-y-3' : 'flex items-center justify-between'
        }`}
      >
        <div>
          <p className="text-xs text-on-surface-variant font-semibold mb-1 uppercase tracking-wide">
            {mobile ? 'Salario' : 'Salario estimado'}
          </p>
          <p className={`font-bold text-on-surface ${mobile ? 'text-lg mb-0' : 'text-xl'}`}>
            {job.salary}
          </p>
        </div>
        <span
          className={`rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-center ${
            mobile ? 'block w-full px-4 py-2 text-sm' : 'px-6 py-2'
          }`}
        >
          {mobile ? 'Postular' : 'Ver vacante'}
        </span>
      </div>
    </JobCardShell>
  );
}

export function DashboardCompactJobCard({ job, onOpen, onBookmark }) {
  const skills = (job.requirements ?? []).slice(0, 2);

  return (
    <JobCardShell
      job={job}
      onOpen={onOpen}
      className="w-full text-left rounded-xl bg-surface-container border border-outline-variant/10 p-4 hover:border-brand-turquoise/30 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-on-surface mb-1 font-display">{job.title}</h4>
          <p className="text-sm text-on-surface-variant mb-3">{job.company}</p>
          <SkillTags skills={skills} compact />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.(job);
          }}
          className="p-2 hover:bg-surface-container-high rounded transition-colors flex-shrink-0"
          aria-label="Guardar vacante"
        >
          <Bookmark className="w-5 h-5 text-on-surface-variant" />
        </button>
      </div>
      <p className="text-lg font-bold text-on-surface pt-2">{job.salary}</p>
    </JobCardShell>
  );
}
