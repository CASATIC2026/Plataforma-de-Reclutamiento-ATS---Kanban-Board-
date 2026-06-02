import { useState, useEffect, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getVacantes } from '../api/vacantesApi';
import { mapVacante, computeAverageSalary, countNewThisWeek } from '../utils/vacanteHelpers';
import { ITEMS_PER_PAGE as PAGE_SIZES } from '../constants';
import JobDetailModal from '../components/vacantes/JobDetailModal';
import ApplyModal from '../components/postulaciones/ApplyModal';
import LandingHero from '../components/landing/LandingHero';
import QuickFilters from '../components/landing/QuickFilters';
import LandingJobSection from '../components/landing/LandingJobSection';

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

  const [rawJobs, setRawJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const ITEMS_PER_PAGE = PAGE_SIZES.LANDING;

  const loadData = useCallback(async () => {
    try {
      const vacantesRes = await getVacantes();
      const active = vacantesRes.data.filter((v) => v.estaActiva);
      setRawJobs(active);
      setJobs(active.map(mapVacante));
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

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(''), 5000);
    return () => clearTimeout(timer);
  }, [successMsg]);

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
        job.company.toLowerCase().includes(query) ||
        job.requirements.some((r) => r.toLowerCase().includes(query));
      return matchFilter && matchLocation && matchSearch;
    });
  }, [jobs, searchQuery, locationFilter, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const paginatedJobs = useMemo(
    () => filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredJobs, currentPage, ITEMS_PER_PAGE]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery, locationFilter]);

  const handleSearch = () => {
    document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplyFromDetail = () => {
    setApplyJob(selectedJob);
    setSelectedJob(null);
  };

  const handleSuccess = () => {
    setApplyJob(null);
    setSuccessMsg('¡Tu postulación fue enviada con éxito!');
  };

  const newThisWeek = countNewThisWeek(rawJobs);
  const averageSalary = computeAverageSalary(rawJobs);

  const eyebrow = loading
    ? 'Cargando vacantes...'
    : error
      ? 'Sin conexión al servidor'
      : newThisWeek > 0
        ? `${newThisWeek} nueva${newThisWeek !== 1 ? 's' : ''} vacante${newThisWeek !== 1 ? 's' : ''} esta semana`
        : `${jobs.length} vacante${jobs.length !== 1 ? 's' : ''} activa${jobs.length !== 1 ? 's' : ''}`;

  return (
    <div className="min-h-screen bg-background">
      {successMsg && (
        <div className="bg-tertiary/10 border-b border-tertiary/20 text-tertiary text-center py-3 text-sm font-semibold">
          {successMsg}
        </div>
      )}

      <LandingHero
        eyebrow={eyebrow}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        locationFilter={locationFilter}
        onLocationFilterChange={setLocationFilter}
        departments={SALVADORAN_DEPARTMENTS}
        onSearch={handleSearch}
        averageSalary={averageSalary}
      />

      <QuickFilters filters={CONTRACT_FILTERS} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <LandingJobSection
        jobs={paginatedJobs}
        loading={loading}
        error={error}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onJobClick={setSelectedJob}
        onClearFilters={() => {
          setSearchQuery('');
          setLocationFilter('');
          setActiveFilter('Todos');
        }}
      />

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyFromDetail}
        />
      )}

      {applyJob && (
        <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
