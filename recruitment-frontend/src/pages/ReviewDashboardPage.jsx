import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getPendingReviews,
  approveApplication,
  rejectApplication,
  bulkApprove,
  bulkReject,
} from '../api/reviewApi';
import { sendEmailNow, cancelEmail, restartEmailTimer } from '../api/postulacionesApi';
import ReviewCard from '../components/review/ReviewCard';

let toastId = 0;
const MAX_TOASTS = 10;

export default function ReviewDashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filters, setFilters] = useState({ vacanteId: '', scoreMin: 0, scoreMax: 100 });
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTargetIds, setRejectTargetIds] = useState([]);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
    });
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const data = await getPendingReviews(filters);
      setApplications(data);
    } catch {
      showToast('Error al cargar candidatos pendientes', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  // Initial fetch + 30s polling
  useEffect(() => {
    setLoading(true);
    fetchReviews();
    const interval = setInterval(fetchReviews, 30000);
    return () => clearInterval(interval);
  }, [fetchReviews]);

  // Derive unique vacante list for filter dropdown
  const vacanteOptions = useMemo(() => {
    const seen = new Map();
    applications.forEach((a) => {
      const titulo = a.vacantetitulo ?? a.vacanteTitulo;
      if (a.vacanteId && titulo) seen.set(a.vacanteId, titulo);
    });
    return Array.from(seen.entries()).map(([id, titulo]) => ({ id, titulo }));
  }, [applications]);

  // Client-side score filter
  const filtered = useMemo(() =>
    applications.filter((a) => {
      if (filters.vacanteId && a.vacanteId !== filters.vacanteId) return false;
      if (a.puntaje != null && (a.puntaje < filters.scoreMin || a.puntaje > filters.scoreMax)) return false;
      return true;
    }),
    [applications, filters]
  );

  const allSelected = filtered.length > 0 && filtered.every((a) => selectedIds.has(a.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const handleSelect = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleApprove = async (id) => {
    const prev = applications;
    setApplications((a) => a.filter((x) => x.id !== id));
    setSelectedIds((s) => { const n = new Set(s); n.delete(id); return n; });
    try {
      await approveApplication(id);
      showToast('Candidato aprobado', 'success');
    } catch {
      setApplications(prev);
      showToast('Error al aprobar candidato', 'error');
    }
  };

  const handleReject = (id) => {
    setRejectTargetIds([id]);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleBulkApprove = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const prev = applications;
    setApplications((a) => a.filter((x) => !selectedIds.has(x.id)));
    setSelectedIds(new Set());
    try {
      await bulkApprove(ids);
      showToast(`${ids.length} candidatos aprobados`, 'success');
    } catch {
      setApplications(prev);
      showToast('Error en aprobación masiva', 'error');
    }
  };

  const handleBulkReject = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setRejectTargetIds(ids);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    const ids = rejectTargetIds;
    const prev = applications;
    setApplications((a) => a.filter((x) => !ids.includes(x.id)));
    setSelectedIds((s) => { const n = new Set(s); ids.forEach((id) => n.delete(id)); return n; });
    setShowRejectModal(false);
    try {
      if (ids.length === 1) {
        await rejectApplication(ids[0], rejectReason || undefined);
      } else {
        await bulkReject(ids, rejectReason || undefined);
      }
      showToast(`${ids.length} candidato${ids.length > 1 ? 's' : ''} rechazado${ids.length > 1 ? 's' : ''}`, 'success');
    } catch {
      setApplications(prev);
      showToast('Error al rechazar candidatos', 'error');
    }
  };

  const handleEmailAction = useCallback(async (id, action, opts) => {
    try {
      if (action === 'send-now') await sendEmailNow(id);
      if (action === 'cancel')   await cancelEmail(id);
      if (action === 'restart')  await restartEmailTimer(id, opts?.minutes);
      const nextStatus = action === 'send-now' ? 'sending' : action === 'cancel' ? 'cancelled' : 'pending';
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, emailStatus: nextStatus } : a))
      );
      showToast('Email actualizado', 'success');
    } catch {
      showToast('Error al actualizar email', 'error');
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-accent-bg">
      {/* Toasts */}
      <div className="fixed right-6 z-50" style={{ top: '5rem' }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="mb-2 px-5 py-3 rounded-lg shadow-lg text-sm font-semibold"
            style={{
              backgroundColor: t.type === 'error' ? '#3a0f0c' : '#0f2e2a',
              color: t.type === 'error' ? '#ffb4ab' : '#6ad9c0',
              border: t.type === 'error' ? '1px solid rgba(255,180,171,0.4)' : '1px solid rgba(106,217,192,0.4)',
              animation: 'fadeUp 0.25s ease',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-navy tracking-tight mb-2">
            Revisión de candidatos
          </h1>
          <p className="text-slate">
            Aprueba o rechaza candidatos antes de que se envíen los emails automáticos.
          </p>
        </div>

        {/* Filters + bulk actions */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-4 mb-6 flex flex-wrap items-end gap-4">
          {/* Vacancy filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate uppercase tracking-wide">Vacante</label>
            <select
              value={filters.vacanteId}
              onChange={(e) => setFilters((f) => ({ ...f, vacanteId: e.target.value }))}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-white text-navy min-w-[180px]"
            >
              <option value="">Todas</option>
              {vacanteOptions.map((v) => (
                <option key={v.id} value={v.id}>{v.titulo}</option>
              ))}
            </select>
          </div>

          {/* Score range */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate uppercase tracking-wide">
              Puntaje mín
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={filters.scoreMin}
              onChange={(e) => setFilters((f) => ({ ...f, scoreMin: Number(e.target.value) }))}
              className="text-sm border border-border rounded-lg px-3 py-2 w-20 text-navy"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate uppercase tracking-wide">
              Puntaje máx
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={filters.scoreMax}
              onChange={(e) => setFilters((f) => ({ ...f, scoreMax: Number(e.target.value) }))}
              className="text-sm border border-border rounded-lg px-3 py-2 w-20 text-navy"
            />
          </div>

          {/* Select all + bulk actions */}
          <div className="flex items-center gap-3 ml-auto">
            <label className="flex items-center gap-2 text-sm text-slate cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="accent-accent"
              />
              Todos ({filtered.length})
            </label>
            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={handleBulkApprove}
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-green-bg text-green hover:bg-tertiary/25 border border-green/30 transition-colors"
                >
                  Aprobar {selectedIds.size}
                </button>
                <button
                  onClick={handleBulkReject}
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-error-container/30 text-error hover:bg-error-container/50 border border-error/30 transition-colors"
                >
                  Rechazar {selectedIds.size}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl border border-border p-4 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-2 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded mb-2" />
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-gray-200 rounded" />
                  <div className="flex-1 h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'var(--color-accent-bg)' }}
            >
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-bold text-navy mb-1">Todo al día</h3>
            <p className="text-slate text-sm">No hay candidatos pendientes de revisión.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((app) => (
              <ReviewCard
                key={app.id}
                application={app}
                isSelected={selectedIds.has(app.id)}
                onSelect={handleSelect}
                onApprove={handleApprove}
                onReject={handleReject}
                onEmailAction={handleEmailAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject reason modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-surface border border-border rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-navy mb-4">
              Rechazar {rejectTargetIds.length > 1 ? `${rejectTargetIds.length} candidatos` : 'candidato'}
            </h2>
            <label className="block text-sm font-semibold text-slate mb-2">
              Razón (opcional)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ej: No cumple los requisitos mínimos…"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm text-navy resize-none h-24 focus:outline-none focus:border-accent"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 text-sm font-semibold py-2 rounded-lg border border-border text-slate hover:bg-surface-2 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 text-sm font-semibold py-2 rounded-lg bg-error-container/30 text-error hover:bg-error-container/50 border border-error/30 transition-colors"
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
