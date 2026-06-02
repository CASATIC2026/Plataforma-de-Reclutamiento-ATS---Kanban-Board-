import { useState } from 'react';
import { Clock, FileText, ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    category: 'Guías',
    title: 'Cómo negociar tu salario en tecnología',
    description: 'Estrategias basadas en datos del mercado salvadoreno para profesionales IT.',
    readTime: 8,
  },
  {
    id: 2,
    category: 'Carrera',
    title: 'De Junior a Senior: hoja de ruta 2025',
    description: 'Las habilidades que más demandan las empresas locales y remotas.',
    readTime: 12,
  },
  {
    id: 3,
    category: 'Entrevistas',
    title: 'Preparación para entrevistas técnicas',
    description: 'Qué esperar en pruebas de código, system design y cultura.',
    readTime: 10,
  },
  {
    id: 4,
    category: 'Tendencias',
    title: 'Stack más demandado en El Salvador',
    description: 'React, .NET y cloud lideran las vacantes activas este trimestre.',
    readTime: 6,
  },
];

const FILTERS = ['Todos los Recursos', 'Guías para Candidatos', 'Entrevistas', 'Carrera & Salarios', 'Tendencias IT'];

export default function RecursosPage() {
  const [activeFilter, setActiveFilter] = useState('Todos los Recursos');

  const filtered =
    activeFilter === 'Todos los Recursos'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category.toLowerCase().includes(activeFilter.split(' ')[0].toLowerCase()));

  return (
    <div className="min-h-screen bg-[#071326]">
      <section className="px-4 md:px-8 py-16 md:py-24 border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-turquoise/10 text-brand-turquoise text-xs font-bold tracking-widest uppercase mb-6">
            Centro de Recursos
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100 font-display mb-4">
            Impulsa tu carrera <span className="text-brand-turquoise">IT</span>
          </h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-base md:text-lg">
            Guías, entrevistas y datos del mercado laboral tecnológico en El Salvador.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeFilter === f
                  ? 'bg-brand-turquoise text-on-brand-turquoise'
                  : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <article
              key={article.id}
              className="flex flex-col rounded-2xl border border-outline-variant/5 bg-[#101C2F] overflow-hidden hover:border-brand-turquoise/20 transition-all group"
            >
              <div className="relative bg-[#142033] aspect-video flex items-center justify-center">
                <FileText className="w-12 h-12 text-brand-turquoise/40" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[rgba(7,19,38,0.80)] text-brand-turquoise text-[10px] font-bold tracking-widest uppercase">
                  {article.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-on-surface group-hover:text-brand-turquoise transition-colors mb-2 font-display line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed flex-1 mb-4">{article.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <Clock className="w-3 h-3" />
                    {article.readTime} min
                  </span>
                  <span className="flex items-center gap-1 text-brand-turquoise text-sm font-semibold">
                    Leer <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto p-8 md:p-12 rounded-3xl border border-outline-variant/10 bg-[#101C2F] text-center">
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 font-display mb-2">
            Recibe recursos exclusivos
          </h2>
          <p className="text-on-surface-variant text-sm mb-6">Sin spam. Solo contenido útil para tu carrera.</p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/10 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-brand-turquoise/30"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold hover:opacity-90 transition-all"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
