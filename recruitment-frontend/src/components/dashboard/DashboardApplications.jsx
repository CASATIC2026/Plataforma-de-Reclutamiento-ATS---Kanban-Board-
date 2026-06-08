import { Link } from 'react-router-dom';
import { getPuntajeStyle } from '../../utils/vacanteHelpers';

const COLUMNS = [
  { estado: 0, label: 'Pendiente', dot: 'bg-sky-400', header: 'border-sky-500/30 bg-sky-500/10' },
  { estado: 1, label: 'En Revisión', dot: 'bg-brand-turquoise', header: 'border-brand-turquoise/30 bg-brand-turquoise/10' },
  { estado: 2, label: 'Prueba Técnica', dot: 'bg-slate-400', header: 'border-outline-variant/20 bg-surface-container-high' },
  { estado: 3, label: 'Oferta', dot: 'bg-tertiary', header: 'border-tertiary/30 bg-tertiary/10' },
];

export default function DashboardApplications({
  applications,
  loading,
  onSelectApplication,
}) {
  const active = applications.filter((a) => a.estado >= 0);
  const rechazados = applications.filter((a) => a.estado === -1);

  if (loading) {
    return (
      <section id="mis-aplicaciones" className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COLUMNS.map((c) => (
            <div
              key={c.estado}
              className="h-48 rounded-xl bg-surface-container animate-pulse border border-outline-variant/10"
            />
          ))}
        </div>
      </section>
    );
  }

  if (applications.length === 0) {
    return (
      <section
        id="mis-aplicaciones"
        className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 pb-16 text-center"
      >
        <div className="rounded-2xl border border-outline-variant/10 bg-surface-container p-12">
          <p className="text-4xl mb-4" aria-hidden="true">
            📭
          </p>
          <h2 className="text-2xl font-bold text-on-surface mb-3 font-display">
            Aún no has aplicado a ninguna vacante
          </h2>
          <p className="text-on-surface-variant mb-6 text-sm max-w-md mx-auto">
            Explora las oportunidades disponibles y da el primer paso en tu carrera.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-sm"
          >
            Buscar empleos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="mis-aplicaciones" className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 pb-16">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-display">
          Mis postulaciones
        </h2>
        <p className="text-on-surface-variant text-sm mt-2">
          Seguimiento de tus aplicaciones activas
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-start">
        {COLUMNS.map((col) => {
          const cards = active.filter((a) => a.estado === col.estado);
          return (
            <div key={col.estado} className="min-w-0">
              <div
                className={`rounded-lg border px-3 py-2 mb-3 flex items-center gap-2 ${col.header}`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${col.dot}`} />
                <span className="font-semibold text-xs md:text-sm text-on-surface truncate">
                  {col.label}
                </span>
                <span className="ml-auto text-xs font-bold text-brand-turquoise">{cards.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {cards.length === 0 ? (
                  <p className="text-center text-xs text-on-surface-variant/70 py-6">
                    Sin postulaciones
                  </p>
                ) : (
                  cards.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => onSelectApplication(app)}
                      className="text-left rounded-xl bg-surface-container border border-outline-variant/10 p-3 hover:border-brand-turquoise/30 transition-colors w-full"
                    >
                      <p className="font-semibold text-sm text-on-surface line-clamp-2 mb-1">
                        {app.vacanteTitulo}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(app.createdAt).toLocaleDateString('es-SV')}
                      </p>
                      {app.puntaje != null && (
                        <span
                          className="mt-2 inline-block px-2 py-0.5 rounded text-xs font-bold"
                          style={getPuntajeStyle(app.puntaje)}
                        >
                          {Math.round(app.puntaje)}/100
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {rechazados.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-error mb-4">
            Postulaciones no seleccionadas ({rechazados.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rechazados.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => onSelectApplication(app)}
                className="text-left rounded-xl border border-error/30 bg-error-container/20 p-3 opacity-90 hover:opacity-100"
              >
                <p className="font-semibold text-sm text-error line-clamp-2 mb-1">
                  {app.vacanteTitulo}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {new Date(app.createdAt).toLocaleDateString('es-SV')}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
