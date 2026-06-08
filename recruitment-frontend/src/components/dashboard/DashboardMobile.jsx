import { Link } from 'react-router-dom';
import DashboardProgressCard from './DashboardProgressCard';
import { DashboardFeaturedJobCard, DashboardCompactJobCard } from './DashboardJobCard';

export default function DashboardMobile({
  firstName,
  recommendedCount,
  preferenceSubtitle,
  featuredJob,
  otherJobs,
  progress,
  applicationsCount,
  onOpenJob,
  onViewApplications,
  jobsLoading,
}) {
  return (
    <div className="pb-8 overflow-x-hidden">
      <div className="space-y-6 pt-6 px-3 sm:px-4 max-w-full overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high">
          <div className="w-2 h-2 rounded-full bg-brand-turquoise" />
          <span className="text-xs font-bold text-brand-turquoise tracking-widest uppercase">
            Activo en el mercado
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-on-surface leading-tight font-display">
            Bienvenido de
            <br />
            nuevo, {firstName}.
          </h1>
          <h2 className="text-3xl font-extrabold text-brand-turquoise leading-tight mt-1 font-display">
            Tu próximo gran
            <br />
            salto te espera.
          </h2>
        </div>

        <p className="text-on-surface-variant text-sm leading-relaxed">
          {recommendedCount > 0
            ? `Hemos encontrado ${recommendedCount} vacante${recommendedCount === 1 ? '' : 's'} para ti.`
            : 'Revisa tus postulaciones o explora la bolsa de empleo.'}
        </p>

        <DashboardProgressCard
          progress={progress}
          applicationsCount={applicationsCount}
          onViewApplications={onViewApplications}
          compact
        />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-on-surface font-display">Recomendado para ti</h2>
            <Link to="/" className="text-brand-turquoise font-semibold text-xs">
              VER TODOS
            </Link>
          </div>
          <p className="text-on-surface-variant text-xs mb-4">{preferenceSubtitle}</p>

          {jobsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-surface-container animate-pulse border border-outline-variant/10"
                />
              ))}
            </div>
          ) : featuredJob || otherJobs.length > 0 ? (
            <div className="space-y-3">
              {featuredJob && (
                <DashboardFeaturedJobCard
                  job={featuredJob}
                  onOpen={onOpenJob}
                  variant="mobile"
                />
              )}
              {otherJobs.map((job) => (
                <DashboardCompactJobCard key={job.id} job={job} onOpen={onOpenJob} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-outline-variant/20 p-6 text-center text-sm text-on-surface-variant">
              <p className="mb-3">Sin recomendaciones nuevas por ahora.</p>
              <Link to="/" className="text-brand-turquoise font-semibold text-xs">
                Ir a la bolsa
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-surface-container border border-outline-variant/10 p-4">
          <h3 className="font-bold text-on-surface mb-3 font-display">Accesos rápidos</h3>
          <div className="space-y-2">
            <Link
              to="/"
              className="block p-2 rounded-lg bg-surface-container-high text-xs font-semibold text-on-surface-variant"
            >
              Bolsa de empleo
            </Link>
            <button
              type="button"
              onClick={onViewApplications}
              className="w-full text-left p-2 rounded-lg bg-surface-container-high text-xs font-semibold text-on-surface-variant"
            >
              Mis postulaciones ({applicationsCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
