import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

export default function ArticleCard({ article, variant = 'grid' }) {
  const isList = variant === 'list';

  return (
    <Link
      to={`/recursos/${article.id}`}
      className={`group flex flex-col rounded-2xl border border-outline-variant/5 bg-[#101C2F] overflow-hidden hover:border-brand-turquoise/25 transition-all ${
        isList ? 'w-full' : ''
      }`}
    >
      <div className="relative bg-[#142033] overflow-hidden">
        <img
          src={article.image}
          alt=""
          loading="lazy"
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isList ? 'h-[191px]' : 'h-48 md:h-[284px]'
          }`}
        />
        {isList && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[rgba(7,19,38,0.80)] text-brand-turquoise text-[10px] font-bold tracking-widest uppercase">
            {article.category}
          </span>
        )}
      </div>

      <div className={`flex flex-col flex-1 ${isList ? 'p-5 gap-2' : 'p-0 pt-3 gap-3'}`}>
        {!isList && (
          <div className="flex items-center gap-3 px-0">
            <span className="py-1 px-3 rounded-full bg-[#673F35] text-[#E3AB9F] text-[10px] font-bold tracking-widest uppercase">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-[#DBC1BB] text-xs">
              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              {article.readMin} min
            </span>
          </div>
        )}

        <h3
          className={`font-editorial text-[#D7E3FD] group-hover:text-brand-turquoise transition-colors ${
            isList ? 'text-xl font-bold leading-7' : 'text-2xl leading-8 px-0'
          }`}
        >
          {article.title}
        </h3>

        <p
          className={`text-[#DBC1BB] text-sm leading-relaxed ${
            isList ? 'line-clamp-2' : 'leading-[22.75px] pr-2'
          }`}
        >
          {article.description}
        </p>

        {isList ? (
          <div className="flex pt-2 justify-between items-center">
            <span className="text-[#A38C87] text-[10px] font-medium uppercase tracking-wide">
              {article.readMin} min lectura
            </span>
            <ArrowRight className="w-5 h-3 text-[#FFB4A3] group-hover:translate-x-1 transition-transform" />
          </div>
        ) : null}
      </div>
    </Link>
  );
}
