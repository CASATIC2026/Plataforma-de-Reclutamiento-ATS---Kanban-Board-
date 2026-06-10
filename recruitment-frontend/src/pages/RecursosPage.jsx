import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Mail,
  Search,
} from 'lucide-react';
import ArticleCard from '../components/recursos/ArticleCard';
import {
  CURATED_POINTS,
  FEATURED_ARTICLE,
  RECURSOS_ARTICLES,
  RECURSOS_FILTERS,
} from '../data/recursosContent';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80';

const CURATED_IMAGE =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80';

function FilterPills({ activeId, onChange, compact }) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto no-scrollbar ${
        compact ? 'px-6 py-1' : 'flex-wrap'
      }`}
    >
      {RECURSOS_FILTERS.map(({ id, label, mobileLabel }) => {
        const active = activeId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              active
                ? 'bg-brand-turquoise text-on-brand-turquoise font-bold'
                : 'bg-[#1F2A3E] text-[#DBC1BB] hover:bg-surface-container-high'
            }`}
          >
            {compact ? mobileLabel : label}
          </button>
        );
      })}
    </div>
  );
}

function matchesFilter(article, filterId) {
  if (filterId === 'all') return true;
  return article.filter === filterId;
}

export default function RecursosPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return RECURSOS_ARTICLES.filter((a) => {
      if (!matchesFilter(a, activeFilter)) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [activeFilter, search]);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail('');
  };

  return (
    <div className="bg-[#071326] w-full max-w-[100vw] overflow-x-hidden">
      {/* ——— Hero (desktop) ——— */}
      <section className="relative hidden md:flex min-h-[480px] lg:min-h-[614px] items-center overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071326] via-[#071326]/80 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
          <div className="max-w-2xl">
            <h1 className="font-editorial text-4xl lg:text-7xl text-[#D7E3FD] leading-tight lg:leading-[72px] mb-6">
              Recursos para impulsar tu carrera
            </h1>
            <p className="text-[#DBC1BB] text-lg lg:text-xl font-light leading-relaxed mb-8">
              Guías, entrevistas y análisis de salarios para profesionales en El Salvador.
              Curaduría editorial para el talento del futuro.
            </p>
            <a
              href="#articulos"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#D97862] text-[#561406] font-bold hover:opacity-90 transition-opacity"
            >
              Explorar Guías
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ——— Hero featured (mobile) ——— */}
      <section className="md:hidden relative px-6 pt-8 pb-6 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-brand-turquoise/20 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4">
          <span className="inline-flex items-center gap-2 w-fit py-1 px-3 rounded-full border border-brand-turquoise/20 bg-brand-turquoise/10">
            <span className="w-2 h-2 rounded-full bg-brand-turquoise" />
            <span className="text-brand-turquoise text-[10px] font-bold tracking-widest uppercase">
              Destacado
            </span>
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-turquoise leading-tight tracking-tight">
            {FEATURED_ARTICLE.title}
          </h1>
          <p className="text-[#DBC1BB] text-lg leading-relaxed max-w-sm">
            {FEATURED_ARTICLE.description}
          </p>
          <Link
            to={`/recursos/${FEATURED_ARTICLE.id}`}
            className="inline-flex items-center gap-2 w-fit px-6 py-3 rounded-xl bg-[#D97862] text-[#561406] text-sm font-bold"
          >
            Leer Artículo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ——— Filters + search ——— */}
      <section className="sticky top-16 md:top-20 z-30 border-b border-outline-variant/10 bg-[rgba(7,19,38,0.92)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="hidden md:block flex-1 min-w-0">
            <FilterPills activeId={activeFilter} onChange={setActiveFilter} />
          </div>
          <div className="md:hidden">
            <FilterPills activeId={activeFilter} onChange={setActiveFilter} compact />
          </div>
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DBC1BB]/60" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar recursos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#030E21] border border-outline-variant/10 text-sm text-on-surface placeholder:text-[rgba(219,193,187,0.5)] focus:outline-none focus:ring-2 focus:ring-brand-turquoise/30"
            />
          </div>
        </div>
      </section>

      {/* ——— Article grid / list ——— */}
      <section id="articulos" className="px-4 md:px-8 py-10 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="grid" />
            ))}
          </div>

          <div className="md:hidden flex flex-col gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="list" />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <p className="text-center text-[#DBC1BB] py-16">
              No encontramos recursos con esos criterios. Prueba otro filtro o término de búsqueda.
            </p>
          )}
        </div>
      </section>

      {/* ——— Salary guide CTA ——— */}
      <section className="px-4 md:px-8 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 rounded-3xl bg-[#1F2A3E] border border-outline-variant/10 p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 opacity-50 bg-[#101C2F] pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <h2 className="font-editorial text-3xl md:text-5xl text-[#D7E3FD] leading-tight mb-4">
                Guía de salarios IT en El Salvador 2025
              </h2>
              <p className="text-[#DBC1BB] text-base md:text-lg leading-relaxed mb-6">
                Accede a datos reales y actualizados sobre bandas salariales, beneficios y tendencias
                de compensación en el mercado tecnológico salvadoreño.
              </p>
              <a
                href="/guia-talentify.pdf"
                download="Guia-Salarios-IT-El-Salvador-2025.pdf"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#D7E3FD] text-[#071326] font-bold hover:opacity-90 transition-opacity"
              >
                <Download className="w-5 h-5" />
                Descargar guía
              </a>
            </div>
            <div className="relative z-10 flex justify-center lg:justify-end shrink-0">
              <div className="w-72 h-96 rounded-2xl border border-outline-variant/20 bg-[#2E394E] shadow-2xl p-6 flex flex-col gap-6">
                <div className="h-40 rounded-lg bg-[#056C70]/20 flex items-center justify-center">
                  <span className="font-display text-3xl font-bold text-[#056C70]">SV</span>
                </div>
                <div className="space-y-4">
                  <div className="h-2 rounded bg-[rgba(215,227,253,0.2)] w-4/5" />
                  <div className="h-2 rounded bg-[rgba(215,227,253,0.1)] w-full" />
                  <div className="h-2 rounded bg-[rgba(215,227,253,0.1)] w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Curated content ——— */}
      <section className="px-4 md:px-8 py-16 md:py-32 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-editorial text-3xl md:text-4xl text-[#D7E3FD] leading-tight mb-4">
                Contenido Curado para Mentes Ambiciosas
              </h2>
              <p className="text-[#DBC1BB] text-lg leading-relaxed">
                Nuestra misión es eliminar el ruido del mercado laboral tradicional. Cada recurso en
                Talentify SV es seleccionado por expertos en reclutamiento técnico y editorial.
              </p>
            </div>
            <ul className="flex flex-col gap-6">
              {CURATED_POINTS.map((point) => (
                <li key={point.title} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#056C70] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#D7E3FD] font-bold text-base">{point.title}</p>
                    <p className="text-[#DBC1BB] text-sm mt-1">{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden h-[280px] md:h-[500px]">
            <img
              src={CURATED_IMAGE}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ——— Newsletter (desktop) ——— */}
      <section className="hidden md:block px-4 md:px-8 py-24 md:py-32 bg-[#101C2F]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-editorial text-4xl md:text-5xl text-[#D7E3FD] mb-4">Mantente Curado.</h2>
          <p className="text-[#DBC1BB] text-lg mb-8">
            Únete a más de 25,000 profesionales suscritos a nuestra dosis semanal de inteligencia
            laboral y oportunidades de alto nivel.
          </p>
          <form
            onSubmit={handleNewsletter}
            className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-[#142033] max-w-2xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico profesional"
              required
              className="flex-1 px-6 py-4 rounded-xl bg-transparent text-on-surface placeholder:text-[rgba(219,193,187,0.4)] focus:outline-none text-base"
            />
            <button
              type="submit"
              className="shrink-0 px-10 py-4 rounded-xl bg-[#056C70] text-white font-bold hover:opacity-90 transition-opacity"
            >
              Suscribirme
            </button>
          </form>
          <p className="text-[rgba(219,193,187,0.5)] text-xs mt-4">
            Respetamos tu privacidad. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </section>

      {/* ——— Newsletter (mobile card) ——— */}
      <section className="md:hidden px-6 pb-24">
        <div className="relative rounded-3xl border border-brand-turquoise/10 bg-[#1F2A3E] p-8 overflow-hidden">
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[rgba(255,180,163,0.10)] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center gap-2">
            <Mail className="w-8 h-8 text-brand-turquoise mb-2" />
            <h2 className="font-display text-2xl font-bold text-[#D7E3FD] pt-2">
              Curaduría Semanal
            </h2>
            <p className="text-[#DBC1BB] text-sm leading-5 max-w-xs">
              Recibe los mejores recursos y ofertas de trabajo directamente en tu bandeja de entrada.
            </p>
            <form onSubmit={handleNewsletter} className="w-full flex flex-col gap-3 pt-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[#030E21] border border-outline-variant/20 text-sm text-on-surface placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-turquoise/30"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold"
              >
                Suscribirme
              </button>
            </form>
            <p className="text-[#A38C87] text-[10px] pt-2">Sin spam. Solo excelencia editorial.</p>
          </div>
        </div>
      </section>

      {/* ——— Quick links strip ——— */}
      <section className="px-4 md:px-8 pb-12 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto py-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
          <Link to="/" className="text-[#DBC1BB] hover:text-brand-turquoise transition-colors">
            Buscar empleos
          </Link>
          <Link
            to="/login?mode=register"
            className="text-[#DBC1BB] hover:text-brand-turquoise transition-colors"
          >
            Crear perfil
          </Link>
          <Link to="/empresas" className="text-[#DBC1BB] hover:text-brand-turquoise transition-colors">
            Publicar vacante
          </Link>
          <Link
            to="/legal/privacidad"
            className="text-[#DBC1BB] hover:text-brand-turquoise transition-colors"
          >
            Privacidad
          </Link>
        </div>
      </section>
    </div>
  );
}
