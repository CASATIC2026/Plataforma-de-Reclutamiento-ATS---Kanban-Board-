import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMisPostulaciones } from '../api/candidatoApi';
import { getVacantes } from '../api/vacantesApi';
import { mapVacante } from '../utils/vacanteHelpers';
import {
  getFirstName,
  computeProfileProgress,
  getPreferenceSubtitle,
  getRecommendedJobs,
} from '../utils/dashboardHelpers';
import '../styles/public-theme.css';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardDesktop from '../components/dashboard/DashboardDesktop';
import DashboardMobile from '../components/dashboard/DashboardMobile';
import DashboardApplications from '../components/dashboard/DashboardApplications';
import ApplicationDetailModal from '../components/dashboard/ApplicationDetailModal';
import JobDetailModal from '../components/vacantes/JobDetailModal';
import ApplyModal from '../components/postulaciones/ApplyModal';

const MOBILE_BREAKPOINT = 768;

export default function CandidateDashboard() {
  const { user } = useAuth();
  const applicationsRef = useRef(null);

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [applySuccess, setApplySuccess] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  const loadApplications = useCallback(async () => {
    try {
      const res = await getMisPostulaciones();
      setApplications(res.data);
    } catch {
      setApplications([]);
    } finally {
      setAppsLoading(false);
    }
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      const res = await getVacantes();
      const active = res.data.filter((v) => v.estaActiva);
      setJobs(active.map(mapVacante));
    } catch {
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
    loadJobs();
  }, [loadApplications, loadJobs]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!applySuccess) return;
    const t = setTimeout(() => setApplySuccess(''), 5000);
    return () => clearTimeout(t);
  }, [applySuccess]);

  const jobsMatchingSearch = useMemo(() => {
    const q = jobSearch.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        job.requirements?.some((r) => r.toLowerCase().includes(q))
    );
  }, [jobs, jobSearch]);

  const recommended = useMemo(
    () => getRecommendedJobs(jobsMatchingSearch, applications, 3),
    [jobsMatchingSearch, applications]
  );
  const featuredJob = recommended[0] ?? null;
  const otherJobs = recommended.slice(1);
  const progress = computeProfileProgress(user, applications);
  const firstName = getFirstName(user);
  const preferenceSubtitle = getPreferenceSubtitle(user, featuredJob);

  const scrollToApplications = () => {
    applicationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleOpenJob = (job) => setSelectedJob(job);

  const handleApplyFromDetail = (job) => {
    setSelectedJob(null);
    setApplyJob(job);
  };

  const handleApplySuccess = () => {
    setApplyJob(null);
    setApplySuccess('¡Postulación enviada! Revisa el estado en Mis postulaciones.');
    loadApplications();
    loadJobs();
    scrollToApplications();
  };

  const sharedProps = {
    firstName,
    recommendedCount: recommended.length,
    preferenceSubtitle,
    featuredJob,
    otherJobs,
    progress,
    applicationsCount: applications.length,
    onOpenJob: handleOpenJob,
    onViewApplications: scrollToApplications,
    jobsLoading,
  };

  return (
    <div className="public-theme min-h-screen bg-[#071326] overflow-x-hidden">
      <DashboardHeader searchQuery={jobSearch} onSearchChange={setJobSearch} />

      {applySuccess && (
        <div className="mx-3 sm:mx-4 md:mx-8 mt-4 px-4 py-3 rounded-xl bg-tertiary/15 border border-tertiary/30 text-tertiary text-sm text-center">
          {applySuccess}
        </div>
      )}

      <main className="w-full">
        {isMobile ? <DashboardMobile {...sharedProps} /> : <DashboardDesktop {...sharedProps} />}
      </main>

      <div ref={applicationsRef}>
        <DashboardApplications
          applications={applications}
          loading={appsLoading}
          onSelectApplication={setSelectedApp}
        />
      </div>

      {selectedApp && (
        <ApplicationDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

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
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
}
