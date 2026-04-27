import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { getVacantes } from '../api/vacantesApi';
import { mapVacante } from '../utils/vacanteHelpers';
import { ITEMS_PER_PAGE as PAGE_SIZES } from '../constants';
import JobDetailModal from '../components/vacantes/JobDetailModal';
import JobCardNew from '../components/vacantes/JobCardNew';
import ApplyModal from '../components/postulaciones/ApplyModal';
import Pagination from '../components/common/Pagination';
import '../styles/landing.css';

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

const SALVADORAN_DEPARTMENTS = [
  '',
  'San Salvador',
  'La Libertad',
  'Santa Ana',
  'Cuscatlán',
  'Usulután',
  'Sonsonate',
  'Chalatenango',
  'Cabañas',
  'San Vicente',
  'San Miguel',
  'Morazán',
  'La Unión',
  'Ahuachapán',
];

export default function NewLandingPage() {
  const { setLive } = useOutletContext();
  const location = useLocation();
  const searchInputRef = useRef(null);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Pagination settings
  const ITEMS_PER_PAGE = PAGE_SIZES.LANDING;

  const loadData = useCallback(async () => {
    try {
      const vacantesRes = await getVacantes();
      const activeJobs = vacantesRes.data
        .filter((v) => v.estaActiva)
        .map(mapVacante);
      setJobs(activeJobs);
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

  // Handle hash navigation to search bar
  useEffect(() => {
    if (location.hash !== '#search-bar' || !searchInputRef.current) return;
    const timer = setTimeout(() => {
      searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [location.hash]);

  // Auto-dismiss success banner after 5s
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(''), 5000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  // Apply all active filters
  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return jobs.filter((job) => {
      const matchFilter =
        activeFilter === 'Todos' || job.type.toLowerCase().includes(activeFilter.toLowerCase());
      const matchLocation =
        !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.type.toLowerCase().includes(query) ||
        job.requirements.some((r) => r.toLowerCase().includes(query));
      return matchFilter && matchLocation && matchSearch;
    });
  }, [jobs, searchQuery, locationFilter, activeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = useMemo(
    () =>
      filteredJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredJobs, currentPage, ITEMS_PER_PAGE]
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery, locationFilter]);

  const handleApplyFromDetail = () => {
    setApplyJob(selectedJob);
    setSelectedJob(null);
  };

  const handleSuccess = () => {
    setApplyJob(null);
    setSuccessMsg('¡Tu postulación fue enviada con éxito!');
  };

  const activeJobsCount = jobs.length;
  const eyebrow = loading
    ? 'Cargando vacantes...'
    : error
    ? 'Sin conexión al servidor'
    : `${activeJobsCount} vacante${activeJobsCount !== 1 ? 's' : ''} activa${activeJobsCount !== 1 ? 's' : ''}`;

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* HERO */}
      <section
        className="hero-section"
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

        <p
          className="hero-eyebrow"
          style={{
            color: '#999',
            fontFamily: "'Jersey 25', sans-serif",
            fontSize: '14px',
            margin: '0 0 12px',
            animation: 'fadeUp 0.7s ease both',
          }}
        >
          {eyebrow}
        </p>

        <h1
          className="hero-title"
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
          className="hero-subtitle"
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
          className="hero-description"
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
          className="search-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            maxWidth: '900px',
            margin: '0 auto',
            background: 'rgba(217,217,217,0.12)',
            borderRadius: '10px',
            overflow: 'hidden',
            animation: 'fadeUp 0.7s 0.3s ease both',
          }}
        >
          <input
            className="search-input"
            ref={searchInputRef}
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
          <div className="divider-location" style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />
          <select
            className="search-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{
              width: '200px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontFamily: 'sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              padding: '16px 14px',
              cursor: 'pointer',
            }}
          >
            <option value="" style={{ background: '#131931', color: '#fff' }}>Todas las ciudades</option>
            {SALVADORAN_DEPARTMENTS.filter((d) => d).map((dept) => (
              <option key={dept} value={dept} style={{ background: '#131931', color: '#fff' }}>
                {dept}
              </option>
            ))}
          </select>
          <button
            className="search-button"
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
        className="filter-section"
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
          className="filter-label"
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
            className="filter-button"
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
            onMouseEnter={(e) => {
              if (activeFilter !== f.key) {
                e.target.style.background = 'rgba(19, 30, 77, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== f.key) {
                e.target.style.background = '#F4F4F4';
              }
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* JOB GRID */}
      <section className="jobs-section" style={{ background: '#353535', padding: '48px 40px 60px' }}>
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
              className="job-grid"
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
                  <JobCardNew job={job} onClick={() => setSelectedJob(job)} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              variant="landing"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            {/* Info text */}
            <p
              className="page-info"
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
