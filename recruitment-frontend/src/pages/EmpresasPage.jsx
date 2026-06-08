import { Link } from 'react-router-dom';
import { Filter, Shield, LayoutGrid, TrendingUp } from 'lucide-react';

const FEATURES = [
  {
    icon: Filter,
    title: 'Screening Inteligente',
    description: 'Filtra candidatos automáticamente según habilidades, ubicación y completitud del perfil.',
  },
  {
    icon: Shield,
    title: 'Seguridad de Datos',
    description: 'Cumplimiento con buenas prácticas de privacidad y almacenamiento seguro de CVs.',
  },
  {
    icon: LayoutGrid,
    title: 'Kanban Operativo',
    description: 'Gestiona todo tu pipeline de reclutamiento en un tablero visual en tiempo real.',
  },
];

const STEPS = [
  {
    title: 'Crea tu perfil de empresa',
    description: 'Muestra tu cultura y visión para atraer talento alineado a tus valores.',
  },
  {
    title: 'Publica tu primera vacante',
    description: 'Define requisitos y preguntas de screening personalizadas por puesto.',
  },
  {
    title: 'Recibe candidatos calificados',
    description: 'Olvida revisar cientos de CVs irrelevantes. Recibe postulaciones estructuradas.',
  },
];

export default function EmpresasPage() {
  return (
    <div className="min-h-screen bg-[#071326]">
      <section className="relative overflow-hidden px-4 md:px-8 py-16 md:py-24">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-brand-turquoise/5 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-brand-turquoise/10 text-brand-turquoise text-xs font-bold tracking-widest uppercase mb-6">
              Para Empresas
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-100 font-display tracking-tight mb-6">
              Recluta talento <span className="text-brand-turquoise">de élite</span> en El Salvador
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              Publica vacantes, configura screening automático y gestiona candidatos en un ATS diseñado para
              equipos que valoran la calidad sobre el volumen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl bg-brand-turquoise text-on-brand-turquoise font-bold text-center shadow-lg shadow-brand-turquoise/20 hover:opacity-90 transition-all"
              >
                Empezar Ahora
              </Link>
              <Link
                to="/precios"
                className="px-8 py-4 rounded-2xl border border-outline-variant/20 text-on-surface font-semibold text-center hover:border-brand-turquoise hover:text-brand-turquoise transition-all"
              >
                Ver planes
              </Link>
            </div>
          </div>
          <div className="p-8 rounded-3xl border border-outline-variant/10 bg-[#101C2F]">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-brand-turquoise text-4xl font-bold font-display">98%</p>
                <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">Match Rate</p>
              </div>
              <div>
                <p className="text-tertiary text-4xl font-bold font-display">15k+</p>
                <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">Perfiles activos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#030E21] py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-100 font-display text-center mb-12">
            ¿Por qué elegir Talentify SV?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-6 md:p-8 rounded-3xl border border-outline-variant/10 bg-[#101C2F] hover:border-brand-turquoise/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-turquoise/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-brand-turquoise" />
                </div>
                <h3 className="text-slate-100 text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-8" id="planes">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-brand-turquoise font-display mb-4">
              Cómo transformar tu reclutamiento
            </h2>
            <Link
              to="/precios"
              className="text-brand-turquoise font-semibold text-sm hover:underline inline-flex items-center gap-1"
            >
              Ver planes y precios →
            </Link>
          </div>
          <div className="flex flex-col gap-8">
            {STEPS.map((step, idx) => (
              <div key={step.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-brand-turquoise flex items-center justify-center flex-shrink-0 font-bold text-brand-turquoise">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-slate-100 font-bold mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-r from-brand-turquoise/20 to-transparent border border-brand-turquoise/20 text-center">
          <TrendingUp className="w-10 h-10 text-brand-turquoise mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 font-display mb-4">
            ¿Listo para publicar tu primera vacante?
          </h2>
          <Link
            to="/login"
            className="inline-block px-10 py-4 rounded-2xl bg-brand-turquoise text-on-brand-turquoise font-bold hover:opacity-90 transition-all"
          >
            Crear cuenta de empresa
          </Link>
        </div>
      </section>
    </div>
  );
}
