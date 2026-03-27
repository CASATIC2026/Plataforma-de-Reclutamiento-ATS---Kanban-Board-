import { useState, useEffect, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getVacantes } from '../api/vacantesApi';
import { getPostulaciones } from '../api/postulacionesApi';
import { mapVacante } from '../utils/vacanteHelpers';
import JobDetailModal from '../components/vacantes/JobDetailModal';
import ApplyModal from '../components/postulaciones/ApplyModal';

const POLL_INTERVAL = 30000;

const CONTRACT_FILTERS = [
  { key: 'Todos', label: 'Todos' },
  { key: 'Tiempo completo', label: 'Tiempo Completo' },
  { key: 'Medio tiempo', label: 'Medio Tiempo' },
  { key: 'Remoto', label: 'Remoto' },
  { key: 'Freelance', label: 'Freelance' },
  { key: 'Contrato temporal', label: 'Temporal' },
  { key: 'Prácticas', label: 'Prácticas' },
];

const CATEGORY_COLORS = {
  'Tecnología': '#334CAF',
  'Diseño': '#9B34AF',
  'Datos': '#AF5F34',
  'Gestión': '#2E8B57',
};

function JobCardNew({ job, hovered, setHovered, onClick }) {
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: hovered ? '#1a2040' : '#F4F4F4',
        border: `1.5px solid ${hovered ? '#CD7B4F' : '#131931'}`,
        borderRadius: '12px',
        padding: '22px 20px 18px 20px',
        boxShadow: hovered ? '0 8px 32px rgba(205,123,79,0.18)' : '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '260px',
      }}
    >
      {/* Title row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div
          style={{
            background: hovered ? '#CD7B4F' : '#131931',
            borderRadius: '8px',
            padding: '4px 12px',
            transition: 'background 0.25s',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontFamily: "'Maven Pro', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {job.title}
          </span>
        </div>
        <span
          style={{
            color: hovered ? '#aab0cc' : '#323232',
            fontFamily: 'sans-serif',
            fontSize: '11px',
            fontWeight: 700,
          }}
        >
          {job.type}
        </span>
      </div>

      {/* Category */}
      <span
        style={{
          color: '#334CAF',
          fontFamily: 'sans-serif',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {job.requirements && job.requirements[0] ? job.requirements[0] : 'General'}
      </span>

      {/* Location & Date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>📍</span>
          <span
            style={{
              color: hovered ? '#ccc' : '#333',
              fontFamily: 'sans-serif',
              fontSize: '11px',
            }}
          >
            {job.location}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '13px' }}>🕐</span>
          <span
            style={{
              color: hovered ? '#aaa' : '#555',
              fontFamily: 'sans-serif',
              fontSize: '11px',
            }}
          >
            {job.posted}
          </span>
        </div>
      </div>

      {/* Salary & Requirements */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>💵</span>
          <span
            style={{
              color: hovered ? '#ccc' : '#333',
              fontFamily: 'sans-serif',
              fontSize: '11px',
            }}
          >
            {job.salary}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '13px' }}>📋</span>
          <span
            style={{
              color: hovered ? '#aaa' : '#555',
              fontFamily: 'sans-serif',
              fontSize: '11px',
            }}
          >
            {job.requirements?.length || 0} Requisitos
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: hovered ? '#334' : '#D2D1D1', margin: '4px 0' }} />

      {/* Description */}
      <p
        style={{
          color: hovered ? '#ccd' : '#222',
          fontFamily: 'sans-serif',
          fontSize: '13px',
          lineHeight: '1.5',
          flex: 1,
          margin: 0,
        }}
      >
        {job.description}
      </p>

      {/* CTA */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          style={{
            background: '#319E85',
            border: '1px solid #BDBDBD',
            borderRadius: '8px',
            padding: '6px 16px',
            color: '#F3F3F3',
            fontFamily: 'sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#267a68')}
          onMouseLeave={(e) => (e.target.style.background = '#319E85')}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}

export default function NewLandingPage() {
  const { setLive } = useOutletContext();

  const [jobs, setJobs] = useState([]);
  const [candidatosCount, setCandidatosCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Local hover state for cards
  const [hoveredCard, setHoveredCard] = useState(null);

  // Pagination settings
  const ITEMS_PER_PAGE = 6;

  const loadData = useCallback(async () => {
    try {
      const [vacantesRes, postulacionesRes] = await Promise.all([
        getVacantes(),
        getPostulaciones(),
      ]);
      const activeJobs = vacantesRes.data
        .filter((v) => v.estaActiva)
        .map(mapVacante);
      setJobs(activeJobs);
      setCandidatosCount(postulacionesRes.data.length);
      setLive(true);
      setError('');
    } catch {
      setError(
        'No se pudo conectar al servidor. Verifica que el servidor esté corriendo en localhost:5223.'
      );
    } finally {
      setLoading(false);
    }
  }, [setLive]);

  // Initial load + real-time polling every 30s
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  // Apply all active filters
  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return jobs.filter((job) => {
      const matchFilter =
        activeFilter === 'Todos' || job.type.toLowerCase().includes(activeFilter.toLowerCase());
      const matchSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.requirements.some((r) => r.toLowerCase().includes(query));
      return matchFilter && matchSearch;
    });
  }, [jobs, searchQuery, activeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIdx, endIdx);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const handleApplyFromDetail = () => {
    setApplyJob(selectedJob);
    setSelectedJob(null);
  };

  const handleSuccess = () => {
    setApplyJob(null);
    setSuccessMsg('¡Tu postulación fue enviada con éxito!');
    setCandidatosCount((c) => (c !== null ? c + 1 : 1));
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@400;700&family=Maven+Pro:wght@400;700&family=Jersey+25&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #CD7B4F; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pulse { 0%,100% { opacity:0.7; } 50% { opacity:1; } }
      `}</style>

      {/* HERO */}
      <section
        style={{
          background: '#131931',
          padding: '80px 40px 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(205,123,79,0.06)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-40px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(31,157,185,0.05)',
            pointerEvents: 'none',
          }}
        />

        <h1
          style={{
            color: '#fff',
            fontFamily: "'Kaisei Decol', serif",
            fontSize: '40px',
            margin: '0 0 4px',
            animation: 'fadeUp 0.7s ease both',
          }}
        >
          Encuentra el trabajo
        </h1>
        <p
          style={{
            color: '#1F9DB9',
            fontFamily: "'Kaisei Decol', serif",
            fontSize: '40px',
            fontWeight: 700,
            margin: '0 0 20px',
            animation: 'fadeUp 0.7s 0.1s ease both',
          }}
        >
          que mereces
        </p>
        <p
          style={{
            color: '#fff',
            fontFamily: "'Jersey 25', sans-serif",
            fontSize: '18px',
            opacity: 0.8,
            maxWidth: '640px',
            margin: '0 auto 36px',
            animation: 'fadeUp 0.7s 0.2s ease both',
          }}
        >
          Conectamos talento excepcional con las empresas más innovadoras de El Salvador
        </p>

        {/* Search bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            maxWidth: '680px',
            margin: '0 auto',
            background: 'rgba(217,217,217,0.12)',
            borderRadius: '10px',
            overflow: 'hidden',
            animation: 'fadeUp 0.7s 0.3s ease both',
          }}
        >
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Puesto, ubicación, requisito..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontFamily: 'sans-serif',
              fontSize: '15px',
              padding: '16px 18px',
            }}
          />
          <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />
          <input
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            placeholder="Departamento"
            style={{
              width: '160px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontFamily: 'sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              padding: '16px 14px',
            }}
          />
          <button
            style={{
              background: '#CD7B4F',
              border: 'none',
              padding: '16px 24px',
              color: '#fff',
              fontFamily: 'sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#b5673d')}
            onMouseLeave={(e) => (e.target.style.background = '#CD7B4F')}
            onClick={() =>
              document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Buscar
          </button>
        </div>

        <div style={{ height: '1px', background: 'rgba(189,189,189,0.3)', margin: '48px auto 0', maxWidth: '1200px' }} />
      </section>

      {/* SUCCESS BANNER */}
      {successMsg && (
        <div
          style={{
            background: '#E8F5E9',
            color: '#2E7D32',
            border: '1px solid rgba(46,125,82,0.25)',
            padding: '14px 24px',
            textAlign: 'center',
            fontSize: '0.95rem',
            fontWeight: 600,
            fontFamily: 'sans-serif',
          }}
        >
          {successMsg}
        </div>
      )}

      {/* FILTER BAR */}
      <div
        style={{
          background: '#FFF5F5',
          padding: '18px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          borderBottom: '1px solid #eee',
        }}
      >
        <span
          style={{
            color: '#5B5959',
            fontFamily: "'Jersey 25', sans-serif",
            fontSize: '18px',
            marginRight: '8px',
          }}
        >
          Filtrar por:
        </span>
        {CONTRACT_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              background: activeFilter === f.key ? '#131E4D' : '#F4F4F4',
              border: '1px solid #BDBDBD',
              borderRadius: '10px',
              padding: '6px 18px',
              color: activeFilter === f.key ? '#F3F3F3' : '#464646',
              fontFamily: 'sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* JOB GRID */}
      <section style={{ background: '#353535', padding: '48px 40px 60px' }}>
        {loading ? (
          <p
            style={{
              color: '#aaa',
              textAlign: 'center',
              fontFamily: 'sans-serif',
              fontSize: '18px',
              padding: '60px 0',
            }}
          >
            Cargando vacantes...
          </p>
        ) : error ? (
          <p
            style={{
              color: '#ff6b6b',
              textAlign: 'center',
              fontFamily: 'sans-serif',
              fontSize: '18px',
              padding: '60px 0',
            }}
          >
            {error}
          </p>
        ) : filteredJobs.length === 0 ? (
          <p
            style={{
              color: '#aaa',
              textAlign: 'center',
              fontFamily: 'sans-serif',
              fontSize: '18px',
              padding: '60px 0',
            }}
          >
            No se encontraron empleos con este filtro.
          </p>
        ) : (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '28px',
                maxWidth: '1200px',
                margin: '0 auto',
              }}
              id="jobs-section"
            >
              {paginatedJobs.map((job, i) => (
                <div key={job.id} style={{ animation: `fadeUp 0.5s ${i * 0.07}s ease both` }}>
                  <JobCardNew
                    job={job}
                    hovered={hoveredCard === job.id}
                    setHovered={(val) => setHoveredCard(val ? job.id : null)}
                    onClick={() => setSelectedJob(job)}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '48px',
                }}
              >
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    background: currentPage === 1 ? '#555' : '#CD7B4F',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    transition: 'background 0.2s',
                    opacity: currentPage === 1 ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => currentPage !== 1 && (e.target.style.background = '#b5673d')}
                  onMouseLeave={(e) => currentPage !== 1 && (e.target.style.background = '#CD7B4F')}
                >
                  ← Anterior
                </button>

                {/* Page Numbers */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        background: currentPage === page ? '#CD7B4F' : 'transparent',
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

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    background: currentPage === totalPages ? '#555' : '#CD7B4F',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    transition: 'background 0.2s',
                    opacity: currentPage === totalPages ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => currentPage !== totalPages && (e.target.style.background = '#b5673d')}
                  onMouseLeave={(e) => currentPage !== totalPages && (e.target.style.background = '#CD7B4F')}
                >
                  Siguiente →
                </button>
              </div>
            )}

            {/* Info text */}
            <p
              style={{
                textAlign: 'center',
                color: '#aaa',
                marginTop: '24px',
                fontSize: '14px',
              }}
            >
              Página {currentPage} de {totalPages}
            </p>
          </div>
        )}
      </section>

      {/* ===== MODALS ===== */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyFromDetail}
        />
      )}

      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
