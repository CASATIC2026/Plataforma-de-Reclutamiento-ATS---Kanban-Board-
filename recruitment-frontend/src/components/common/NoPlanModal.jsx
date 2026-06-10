import { useNavigate } from 'react-router-dom';
import { ArrowRight, X, Sparkles } from 'lucide-react';

export default function NoPlanModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToPlans = () => {
    onClose();
    navigate('/precios');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-[#0d1b2e] border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-turquoise/10 border border-brand-turquoise/20 mb-6">
          <Sparkles className="w-7 h-7 text-brand-turquoise" />
        </div>

        {/* Copy */}
        <h2 className="text-xl font-bold text-on-surface mb-2">
          Activa tu plan para publicar vacantes
        </h2>
        <p className="text-sm text-slate leading-relaxed mb-6">
          Tu cuenta aún no está vinculada a una empresa activa. Para publicar vacantes
          y gestionar candidatos necesitas un plan o una demo con nuestro equipo.
        </p>

        {/* Features teaser */}
        <ul className="space-y-2 mb-8">
          {[
            'Publicación ilimitada de vacantes',
            'Screening automático con IA',
            'Kanban de candidatos en tiempo real',
            'Analíticas y reportes de reclutamiento',
          ].map((feat) => (
            <li key={feat} className="flex items-center gap-2 text-sm text-slate">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-turquoise flex-shrink-0" />
              {feat}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoToPlans}
            className="w-full py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-brand-turquoise/20"
          >
            Ver planes y precios
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-white/10 text-slate text-sm hover:bg-white/5 transition-colors"
          >
            Volver al dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
