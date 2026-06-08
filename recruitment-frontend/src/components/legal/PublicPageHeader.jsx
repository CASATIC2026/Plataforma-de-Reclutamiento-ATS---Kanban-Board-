import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function PublicPageHeader({ title }) {
  return (
    <header className="border-b border-outline-variant/10 bg-[#0F1B28] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver al inicio</span>
        </Link>
        <Link to="/" className="text-xl font-bold text-slate-100 font-display">
          Talentify <span className="text-brand-turquoise">SV</span>
        </Link>
        <div className="w-24 hidden sm:block" aria-hidden="true" />
        {title && (
          <span className="sr-only">{title}</span>
        )}
      </div>
    </header>
  );
}
