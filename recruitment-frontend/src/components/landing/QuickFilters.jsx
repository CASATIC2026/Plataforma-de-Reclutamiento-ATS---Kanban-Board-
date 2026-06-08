import { SlidersHorizontal } from 'lucide-react';

export default function QuickFilters({ filters, activeFilter, onFilterChange }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-8 md:mb-16">
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        <span className="text-on-surface-variant font-medium mr-2">Filtros rápidos:</span>
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => onFilterChange(filter.key)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
              activeFilter === filter.key
                ? 'bg-brand-turquoise text-on-brand-turquoise border border-transparent shadow-lg shadow-brand-turquoise/20'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex md:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => onFilterChange(filter.key)}
            className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-semibold text-xs transition-all ${
              activeFilter === filter.key
                ? 'bg-brand-turquoise text-on-brand-turquoise shadow-lg shadow-brand-turquoise/20'
                : 'bg-surface-container-high text-on-surface border border-outline-variant/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
        <button
          type="button"
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/10 bg-surface-container-high text-brand-turquoise"
          aria-label="Todos los filtros"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
