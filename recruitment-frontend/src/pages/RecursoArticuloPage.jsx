import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { getArticleBySlug } from '../data/recursosArticlesContent';
import NotFoundPage from './NotFoundPage';

export default function RecursoArticuloPage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-[#071326] w-full max-w-[100vw] overflow-x-hidden min-h-screen">
      <header className="border-b border-outline-variant/10 bg-[rgba(7,19,38,0.95)] sticky top-16 md:top-20 z-30">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-4">
          <Link
            to="/recursos"
            className="inline-flex items-center gap-2 text-[#DBC1BB] hover:text-brand-turquoise transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Recursos
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="rounded-2xl overflow-hidden mb-8 h-48 md:h-72">
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="py-1 px-3 rounded-full bg-[#673F35] text-[#E3AB9F] text-[10px] font-bold tracking-widest uppercase">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-[#DBC1BB] text-sm">
            <Clock className="w-4 h-4" />
            {article.readMin} min de lectura
          </span>
        </div>

        <h1 className="font-editorial text-3xl md:text-5xl text-[#D7E3FD] leading-tight mb-6">
          {article.title}
        </h1>

        <p className="text-[#DBC1BB] text-lg leading-relaxed mb-10 border-l-2 border-brand-turquoise/40 pl-5">
          {article.intro}
        </p>

        <div className="flex flex-col gap-10">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl md:text-2xl font-bold text-[#D7E3FD] mb-4">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-4">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-[#DBC1BB] text-base leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-[#A38C87] text-sm">
            Publicado por el equipo editorial de Talentify SV
          </p>
          <Link
            to="/recursos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Ver más recursos
          </Link>
        </footer>
      </article>
    </div>
  );
}
