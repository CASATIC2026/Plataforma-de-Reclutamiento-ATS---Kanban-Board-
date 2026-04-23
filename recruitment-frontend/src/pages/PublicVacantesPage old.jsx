import { useState, useEffect, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getVacantes } from '../api/vacantesApi';
import { getPostulaciones } from '../api/postulacionesApi';
import { mapVacante } from '../utils/vacanteHelpers';
import JobCard from '../components/vacantes/JobCard';
import JobDetailModal from '../components/vacantes/JobDetailModal';
import ApplyModal from '../components/postulaciones/ApplyModal';

const POLL_INTERVAL = 30000;

const CONTRACT_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'Tiempo completo', label: 'Tiempo completo' },
  { key: 'Medio tiempo', label: 'Medio tiempo' },
  { key: 'Freelance', label: 'Freelance' },
  { key: 'Remoto', label: 'Remoto' },
  { key: 'Contrato temporal', label: 'Temporal' },
  { key: 'Prácticas', label: 'Prácticas' },
];

export default function PublicVacantesPage() {
  const { setLive } = useOutletContext();

  const [jobs, setJobs] = useState([]);
  const [candidatosCount, setCandidatosCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

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
      setError('No se pudo conectar al servidor. Verifica que el servidor esté corriendo en localhost:5223.');
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

  // Hero tags: top 8 most-frequent requisitos across all vacantes
  const heroTags = useMemo(() => {
    const freq = {};
    jobs.forEach((job) => {
      job.requirements.forEach((r) => { freq[r] = (freq[r] || 0) + 1; });
    });
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
    return sorted.length > 0
      ? sorted
      : ['Remoto', 'Tiempo completo', 'Freelance', 'Junior', 'Senior'];
  }, [jobs]);

  // Apply all active filters
  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return jobs.filter((job) => {
      const matchContract =
        activeFilter === 'all' ||
        job.type.toLowerCase().includes(activeFilter.toLowerCase());
      const matchLocation =
        !locationFilter ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchQuery =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.type.toLowerCase().includes(query) ||
        job.requirements.some((r) => r.toLowerCase().includes(query));
      return matchContract && matchLocation && matchQuery;
    });
  }, [jobs, searchQuery, locationFilter, activeFilter]);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  const eyebrow = loading
    ? 'Cargando vacantes...'
    : error
    ? 'Sin conexión al servidor'
    : `${jobs.length} vacante${jobs.length !== 1 ? 's' : ''} activa${jobs.length !== 1 ? 's' : ''}`;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__bg-shapes">
          <div className="shape shape--1" />
          <div className="shape shape--2" />
          <div className="shape shape--3" />
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow">{eyebrow}</p>
          <h1 className="hero__title">
            Encuentra el trabajo<br /><em>que mereces</em>
          </h1>
          <p className="hero__subtitle">
            Conectamos talento excepcional con las empresas más innovadoras de México y Latinoamérica.
          </p>

          <div className="hero__search">
            <input
              type="text"
              className="search-input"
              placeholder="Puesto, ubicación o requisito..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter')
                  document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <select
              className="search-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">Todas las ciudades</option>
              <option value="Ciudad de México">CDMX</option>
              <option value="Monterrey">Monterrey</option>
              <option value="Guadalajara">Guadalajara</option>
              <option value="Querétaro">Querétaro</option>
              <option value="Remoto">Remoto</option>
            </select>
            <button
              className="btn btn--accent"
              onClick={() =>
                document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Buscar
            </button>
          </div>

          <div className="hero__tags">
            {heroTags.map((tag) => (
              <button key={tag} className="hero__tag" onClick={() => handleTagClick(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="hero__stats">
          <div className="stat">
            <span className="stat__num">{loading ? '—' : jobs.length}</span>
            <span className="stat__label">Vacantes activas</span>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            {/* Real candidatos count from /api/postulaciones */}
            <span className="stat__num">{candidatosCount === null ? '—' : candidatosCount}</span>
            <span className="stat__label">Candidatos</span>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <span className="stat__num">89%</span>
            <span className="stat__label">Tasa de éxito</span>
          </div>
        </div>
      </section>

      {/* ===== SUCCESS BANNER ===== */}
      {successMsg && (
        <div
          style={{
            background: 'var(--clr-green-bg)',
            color: 'var(--clr-green)',
            border: '1px solid rgba(46,125,82,0.25)',
            padding: '14px 24px',
            textAlign: 'center',
            fontSize: '0.95rem',
            fontWeight: 600,
            fontFamily: 'var(--ff-body)',
          }}
        >
          {successMsg}
        </div>
      )}

      {/* ===== FILTERS ===== */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-bar">
            <div className="filters-bar__left">
              <span className="filters-label">Filtrar por:</span>
              <div className="filter-pills">
                {CONTRACT_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    className={`pill${activeFilter === f.key ? ' pill--active' : ''}`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="filters-bar__right">
              <span className="results-count">
                {loading
                  ? 'Cargando...'
                  : `Mostrando ${filteredJobs.length} ${filteredJobs.length === 1 ? 'vacante' : 'vacantes'}`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== JOBS GRID ===== */}
      <main className="jobs-section" id="jobs-section">
        <div className="container">
          <div className="jobs-grid">
            {loading ? (
              <div className="loading-state" style={{ gridColumn: '1/-1' }}>
                <div className="loading-spinner" />
                <p>Cargando vacantes...</p>
              </div>
            ) : error ? (
              <div className="error-state" style={{ gridColumn: '1/-1' }}>
                <div className="error-state__icon">⚠️</div>
                <h3>No se pudo conectar al servidor</h3>
                <p>{error}</p>
                <button className="btn btn--accent" onClick={loadData}>
                  Reintentar
                </button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="no-results">
                <div className="no-results__icon">🔍</div>
                <h3>Sin resultados</h3>
                <p>Intenta con otros filtros o términos de búsqueda.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
              ))
            )}
          </div>
        </div>
      </main>

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
    </>
  );
}
