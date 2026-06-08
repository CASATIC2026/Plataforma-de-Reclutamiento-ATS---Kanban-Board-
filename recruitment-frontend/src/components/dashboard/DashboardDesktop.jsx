import { Link } from 'react-router-dom';
import DashboardProgressCard from './DashboardProgressCard';
import { DashboardFeaturedJobCard, DashboardCompactJobCard } from './DashboardJobCard';

export default function DashboardDesktop({
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
    <div className="pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high mb-6">
              <div className="w-2 h-2 rounded-full bg-brand-turquoise" />
              <span className="text-xs font-bold text-brand-turquoise tracking-widest uppercase">
                Activo en el mercado
              </span>
            </div>

            <h1 className="text-5xl font-extrabold text-brand-turquoise leading-tight mb-6 font-display">
              Bienvenido, {firstName}.
              <br />
              Tu próximo salto espera.
            </h1>

            <p className="text-on-surface-variant text-base leading-relaxed mb-8 max-w-xl">
              {recommendedCount > 0
                ? `Hemos encontrado ${recommendedCount} vacante${recommendedCount === 1 ? '' : 's'} que podrían encajar contigo.`
                : 'Explora nuevas vacantes o revisa el estado de tus postulaciones activas.'}
            </p>

            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-on-surface font-display">
                  Recomendado para ti
                </h2>
                <Link
                  to="/"
                  className="text-brand-turquoise font-semibold text-sm hover:text-brand-turquoise/80"
                >
                  VER TODOS
                </Link>
              </div>
              <p className="text-on-surface-variant text-sm mb-6">{preferenceSubtitle}</p>

              {jobsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 rounded-2xl bg-surface-container animate-pulse border border-outline-variant/10"
                    />
                  ))}
                </div>
              ) : featuredJob || otherJobs.length > 0 ? (
                <div className="space-y-4">
                  {featuredJob && (
                    <DashboardFeaturedJobCard job={featuredJob} onOpen={onOpenJob} />
                  )}
                  {otherJobs.map((job) => (
                    <DashboardCompactJobCard key={job.id} job={job} onOpen={onOpenJob} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-outline-variant/20 p-10 text-center">
                  <p className="text-on-surface-variant mb-4">
                    No hay vacantes nuevas para recomendar. Ya aplicaste a las disponibles o no hay
                    publicaciones activas.
                  </p>
                  <Link
                    to="/"
                    className="inline-block px-6 py-2 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-sm"
                  >
                    Explorar bolsa de empleo
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <DashboardProgressCard
              progress={progress}
              applicationsCount={applicationsCount}
              onViewApplications={onViewApplications}
            />

            <div className="rounded-xl bg-surface-container border border-outline-variant/10 p-6">
              <h3 className="font-bold text-on-surface mb-4 font-display">Accesos rápidos</h3>
              <div className="space-y-3">
                <Link
                  to="/"
                  className="block p-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                >
                  <p className="text-sm font-semibold text-on-surface-variant">Bolsa de empleo</p>
                  <p className="text-xs text-on-surface-variant/80">Ver todas las vacantes</p>
                </Link>
                <button
                  type="button"
                  onClick={onViewApplications}
                  className="w-full text-left p-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                >
                  <p className="text-sm font-semibold text-on-surface-variant">Mis postulaciones</p>
                  <p className="text-xs text-on-surface-variant/80">
                    {applicationsCount} en seguimiento
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
