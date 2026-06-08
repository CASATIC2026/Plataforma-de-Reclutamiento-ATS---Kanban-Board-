import { Link } from 'react-router-dom';

export default function DashboardProgressCard({
  progress,
  applicationsCount,
  onViewApplications,
  compact = false,
}) {
  const progressHint =
    progress >= 100
      ? 'Tu perfil está completo. Sigue postulando para mantenerte visible.'
      : progress >= 65
        ? 'Completa tu carrera en el registro para mejorar tus recomendaciones.'
        : 'Postula a vacantes para desbloquear seguimiento avanzado en el tablero.';

  return (
    <div
      className={`rounded-2xl bg-surface-container border border-outline-variant/10 ${
        compact ? 'p-4' : 'p-6'
      }`}
    >
      <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-4'}`}>
        <h3 className="text-sm font-semibold text-on-surface-variant">Progreso del perfil</h3>
        <span
          className={`font-bold text-brand-turquoise ${compact ? 'text-xl' : 'text-2xl'}`}
        >
          {progress}%
        </span>
      </div>

      <div
        className={`w-full bg-surface-container-high rounded-full overflow-hidden ${
          compact ? 'h-2 mb-3' : 'h-2 mb-4'
        }`}
      >
        <div
          className="bg-brand-turquoise h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className={`text-on-surface-variant ${compact ? 'text-xs mb-4' : 'text-xs mb-4'}`}>
        {progressHint}
      </p>

      <button
        type="button"
        onClick={onViewApplications}
        className={`w-full rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold hover:scale-[1.02] transition-transform ${
          compact ? 'px-4 py-3' : 'px-4 py-3 mb-3'
        }`}
      >
        Mis aplicaciones ({applicationsCount})
      </button>

      {!compact && (
        <Link
          to="/"
          className="block w-full text-center px-4 py-3 rounded-xl border border-outline-variant/20 text-on-surface-variant font-semibold hover:border-brand-turquoise/30 transition-colors text-sm"
        >
          Buscar más empleos
        </Link>
      )}
    </div>
  );
}
