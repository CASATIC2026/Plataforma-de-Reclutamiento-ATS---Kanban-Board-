import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const LOGIN_COPY = {
  badge: 'Mercado Activo',
  badgeClass: 'border-brand-mint/20 bg-brand-mint/10',
  dotClass: 'bg-brand-mint',
  labelClass: 'text-brand-mint',
  title: 'Curando el futuro del trabajo de alto impacto.',
  description:
    'Únete a un ecosistema de élite donde el talento de primer nivel encuentra oportunidades visionarias.',
};

const REGISTER_COPY = {
  badge: 'Curating Excellence',
  badgeClass: 'border-brand-turquoise/20 bg-brand-turquoise/10',
  dotClass: 'bg-brand-turquoise',
  labelClass: 'text-brand-turquoise',
  title: 'Únete a la élite del talento tecnológico.',
  description:
    'Accede a las oportunidades más exclusivas y conecta con empresas que están definiendo el futuro del trabajo digital.',
};

const FOOTER_LINKS = [
  { label: 'Política de Privacidad', to: '/legal/privacidad' },
  { label: 'Términos de Servicio', to: '/legal/terminos' },
];

export default function AuthLayout({ mode, children }) {
  const copy = mode === 'register' ? REGISTER_COPY : LOGIN_COPY;
  const isRegister = mode === 'register';

  return (
    <div className="public-theme min-h-screen bg-[#071326] flex flex-col">
      <Link
        to="/"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-on-surface-variant hover:text-brand-turquoise transition-colors text-sm font-medium md:top-6 md:left-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Inicio
      </Link>

      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* Left marketing panel — desktop */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#101C2F] to-[#0a0f1b] flex-col justify-end p-12 xl:p-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-[#071326] via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-32 top-20 w-96 h-96 rounded-full bg-brand-turquoise/5 blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-8 max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${copy.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${copy.dotClass}`} />
              <span className={`text-xs font-bold tracking-widest uppercase ${copy.labelClass}`}>
                {copy.badge}
              </span>
            </div>
            <h1
              className={`font-extrabold text-brand-turquoise leading-[1.1] font-display ${
                isRegister ? 'text-5xl xl:text-7xl' : 'text-4xl xl:text-5xl'
              }`}
            >
              {copy.title}
            </h1>
            <p className="text-on-surface-variant text-lg xl:text-xl leading-relaxed max-w-xl">
              {copy.description}
            </p>
          </div>
        </div>

        {/* Mobile hero strip */}
        <div className="lg:hidden relative px-6 pt-16 pb-6 bg-gradient-to-br from-[#101C2F] to-[#0a0f1b] overflow-hidden">
          <div className="absolute -right-20 top-10 w-48 h-48 rounded-full bg-brand-turquoise/5 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 bottom-0 w-40 h-40 rounded-full bg-[#D97862]/5 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4 ${copy.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${copy.dotClass}`} />
              <span className={`text-xs font-bold tracking-widest uppercase ${copy.labelClass}`}>
                {copy.badge}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-brand-turquoise font-display leading-tight">
              {copy.title}
            </h1>
            <p className="text-on-surface-variant text-sm mt-3 leading-relaxed">{copy.description}</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex-1 lg:flex-none lg:w-[min(100%,600px)] xl:w-[640px] flex flex-col justify-center px-6 py-8 md:p-12 bg-[#071326] relative">
          <div className="absolute -left-20 bottom-0 w-56 h-56 rounded-full bg-[#D97862]/5 blur-3xl lg:hidden pointer-events-none" />
          <div className="absolute -right-20 top-1/4 w-48 h-48 rounded-full bg-brand-turquoise/5 blur-3xl md:hidden pointer-events-none" />
          <div className="relative z-10 w-full max-w-md mx-auto">{children}</div>
        </div>
      </div>

      <footer className="hidden md:block border-t border-outline-variant/10 bg-[#071326]">
        <div className="max-w-7xl mx-auto px-8 py-8 xl:py-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-slate-100 font-bold text-lg font-display">Talentify SV</p>
            <p className="text-on-surface-variant text-sm mt-1">
              © 2026 Talentify SV. Curando el futuro del trabajo.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center sm:justify-end">
            {FOOTER_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-on-surface-variant text-sm hover:text-brand-turquoise transition-colors"
              >
                {label}
              </Link>
            ))}
            <span
              className="text-on-surface-variant/50 text-sm cursor-not-allowed"
              title="Próximamente"
            >
              Centro de Ayuda
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
