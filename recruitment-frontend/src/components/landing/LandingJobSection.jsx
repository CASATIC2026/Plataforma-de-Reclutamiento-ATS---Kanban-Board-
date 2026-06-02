import { useMemo } from 'react';
import { Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import LandingJobCard from './LandingJobCard';

function LandingPagination({ currentPage, totalPages, onPageChange }) {
  const pages = useMemo(() => {
    const result = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      result.push(1);
      if (currentPage > 3) result.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        result.push(i);
      }
      if (currentPage < totalPages - 2) result.push('...');
      result.push(totalPages);
    }
    return result;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 md:mt-16 flex justify-center items-center gap-1 md:gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <div className="flex gap-1 md:gap-2">
        {pages.map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center text-on-surface-variant/50 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 md:w-12 md:h-12 rounded-xl font-bold transition-all text-sm ${
                currentPage === page
                  ? 'bg-brand-turquoise text-on-brand-turquoise shadow-lg shadow-brand-turquoise/20'
                  : 'bg-surface-container-low border border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
}

export default function LandingJobSection({
  jobs,
  loading,
  error,
  viewMode,
  onViewModeChange,
  currentPage,
  totalPages,
  onPageChange,
  onJobClick,
  onClearFilters,
}) {
  return (
    <section id="jobs-section" className="max-w-7xl mx-auto px-4 md:px-8 pb-8 md:pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 md:mb-12 gap-4">
        <div>
          <h2 className="text-xl md:text-4xl font-extrabold tracking-tight text-on-surface font-display">
            Oportunidades destacadas
          </h2>
          <p className="text-on-surface-variant mt-1 md:mt-2 font-light text-sm md:text-base">
            Seleccionadas cuidadosamente por nuestro equipo de expertos.
          </p>
        </div>
        <div className="hidden sm:flex gap-2">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
              viewMode === 'grid'
                ? 'bg-surface-container-high text-brand-turquoise border border-outline-variant/20'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/10'
            }`}
            aria-label="Vista en cuadrícula"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
              viewMode === 'list'
                ? 'bg-surface-container-high text-brand-turquoise border border-outline-variant/20'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/10'
            }`}
            aria-label="Vista en lista"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-16 md:py-24 text-base md:text-lg">Cargando vacantes...</p>
      ) : error ? (
        <p className="text-error text-center py-16 md:py-24 text-base md:text-lg">{error}</p>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 md:py-24">
          <p className="text-on-surface-variant text-base md:text-lg">
            No se encontraron vacantes con los filtros seleccionados.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 text-brand-turquoise font-bold hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-4 md:gap-6 grid-cols-1 ${
              viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-1'
            }`}
          >
            {jobs.map((job) => (
              <LandingJobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
            ))}
          </div>
          <LandingPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          {totalPages > 1 && (
            <p className="text-center text-on-surface-variant/70 text-sm mt-4">
              Página {currentPage} de {totalPages}
            </p>
          )}
        </>
      )}
    </section>
  );
}
