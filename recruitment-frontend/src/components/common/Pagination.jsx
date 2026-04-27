function AdminPagination({ currentPage, totalPages, onPageChange }) {
  const handlePrev = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-bg text-slate opacity-50 cursor-not-allowed'
            : 'bg-bg text-navy hover:bg-accent-bg cursor-pointer'
        }`}
        title="Página anterior"
        aria-label="Página anterior"
      >
        ‹
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => {
              onPageChange(page);
              window.scrollTo(0, 0);
            }}
            className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
              page === currentPage
                ? 'bg-navy text-white'
                : 'bg-bg text-navy hover:bg-accent-bg'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? 'bg-bg text-slate opacity-50 cursor-not-allowed'
            : 'bg-bg text-navy hover:bg-accent-bg cursor-pointer'
        }`}
        title="Página siguiente"
        aria-label="Página siguiente"
      >
        ›
      </button>
    </div>
  );
}

function LandingPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div
      className="pagination-controls"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        marginTop: '48px',
      }}
    >
      <button
        type="button"
        className="nav-button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{
          background: currentPage === 1 ? '#555' : 'var(--color-accent)',
          border: 'none',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          transition: 'background 0.2s',
          opacity: currentPage === 1 ? 0.6 : 1,
        }}
        onMouseEnter={(e) => currentPage !== 1 && (e.target.style.background = 'var(--color-accent-lt)')}
        onMouseLeave={(e) => currentPage !== 1 && (e.target.style.background = 'var(--color-accent)')}
      >
        ← Anterior
      </button>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            type="button"
            className="page-button"
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            style={{
              background: currentPage === page ? 'var(--color-accent)' : 'transparent',
              border: currentPage === page ? 'none' : '1px solid #666',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              color: '#fff',
              fontFamily: "'Maven Pro', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) =>
              currentPage !== page &&
              (e.target.style.background = 'rgba(205,123,79,0.2)')
            }
            onMouseLeave={(e) =>
              currentPage !== page && (e.target.style.background = 'transparent')
            }
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="nav-button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{
          background: currentPage === totalPages ? '#555' : 'var(--color-accent)',
          border: 'none',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          transition: 'background 0.2s',
          opacity: currentPage === totalPages ? 0.6 : 1,
        }}
        onMouseEnter={(e) => currentPage !== totalPages && (e.target.style.background = 'var(--color-accent-lt)')}
        onMouseLeave={(e) => currentPage !== totalPages && (e.target.style.background = 'var(--color-accent)')}
      >
        Siguiente →
      </button>
    </div>
  );
}

export default function Pagination({ variant = 'admin', currentPage, totalPages, onPageChange }) {
  if (variant === 'landing') {
    return <LandingPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />;
  }
  return <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />;
}
