import { Building2, MapPin, DollarSign } from 'lucide-react';
import { JobIcon } from './landingIcons';

export default function LandingJobCard({ job, onClick }) {
  const badgeType = job.badge;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-surface-container-low hover:bg-surface-container p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-outline-variant/5 hover:border-brand-turquoise/30 transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40 flex flex-col h-full w-full text-left"
    >
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div className="w-11 h-11 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-surface-bright flex items-center justify-center border border-outline-variant/10 shrink-0 text-brand-turquoise">
          <JobIcon iconKey={job.iconKey} />
        </div>
        {badgeType && (
          <span
            className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
              badgeType === 'urgent'
                ? 'bg-error-container/20 text-error border border-error/20'
                : 'bg-tertiary/10 text-tertiary border border-tertiary/20'
            }`}
          >
            <span className={`w-1 h-1 rounded-full ${badgeType === 'urgent' ? 'bg-error' : 'bg-tertiary'}`} />
            {badgeType === 'urgent' ? 'Urgente' : 'Nuevo'}
          </span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-base md:text-xl font-bold text-on-surface group-hover:text-brand-turquoise transition-colors mb-2 line-clamp-2 font-display">
          {job.title}
        </h3>
        <div className="flex items-center gap-2 text-on-surface-variant font-medium text-xs md:text-sm mb-3 md:mb-4">
          <Building2 className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{job.company}</span>
        </div>
        <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
          <div className="flex items-center gap-2 text-on-surface-variant text-xs md:text-sm font-light">
            <MapPin className="w-4 h-4 opacity-60 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-turquoise font-bold text-xs md:text-sm">
            <DollarSign className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-surface-container-highest text-on-surface font-bold py-3 md:py-3.5 rounded-xl group-hover:bg-brand-turquoise group-hover:text-on-brand-turquoise transition-all text-xs md:text-sm text-center">
        Ver detalles
      </div>
    </button>
  );
}
