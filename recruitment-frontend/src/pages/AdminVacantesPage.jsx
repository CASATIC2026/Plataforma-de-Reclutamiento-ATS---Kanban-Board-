import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVacantes, createVacante, deleteVacante, updateVacante } from '../api/vacantesApi';
import { useAuth } from '../context/AuthContext';
import { ITEMS_PER_PAGE } from '../constants';
import { formatSalaryRange, formatId } from '../utils/vacanteHelpers';
import Breadcrumb from '../components/common/Breadcrumb';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import VacanteFormModal from '../components/vacantes/VacanteFormModal';

export default function AdminVacantesPage() {
  const navigate = useNavigate();
  const { isAdmin, selectedCompanyId, hasPermission } = useAuth();
  const canCreate = hasPermission('jobs:create');
  const canEdit = hasPermission('jobs:update');
  const canDelete = hasPermission('jobs:delete');
  const canManage = canCreate || canEdit || canDelete;
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = ITEMS_PER_PAGE.ADMIN;
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    tipoContrato: 'Tiempo completo',
    salarioMin: '',
    salarioMax: '',
    requisitos: [],
    umbralPuntaje: 60,
    screeningActivo: true,
  });
  const [requisitoInput, setRequisitoInput] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const fetchVacantes = useCallback(async () => {
    try {
      // selectedCompanyId is only honored by the backend for platform-tier callers
      const response = await getVacantes({ companyId: selectedCompanyId });
      setVacantes(response.data);
    } catch (error) {
      console.error('Error fetching vacantes:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    fetchVacantes();
  }, [fetchVacantes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const payload = {
      ...formData,
      salarioMin: formData.salarioMin ? Number(formData.salarioMin) : null,
      salarioMax: formData.salarioMax ? Number(formData.salarioMax) : null,
      umbralPuntaje: Number(formData.umbralPuntaje),
      screeningActivo: formData.screeningActivo,
    };

    try {
      if (editingId) {
        await updateVacante(editingId, payload);
      } else {
        // Platform admins use selectedCompanyId as the target company on POST.
        // For regular users it's ignored (backend stamps from JWT).
        await createVacante(payload, { companyId: selectedCompanyId });
      }
      await fetchVacantes();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      ubicacion: '',
      tipoContrato: 'Tiempo completo',
      salarioMin: '',
      salarioMax: '',
      requisitos: [],
      umbralPuntaje: 60,
      screeningActivo: true,
    });
    setRequisitoInput('');
    setEditingId(null);
  };

  const handleEdit = (vacante) => {
    setFormData({
      titulo: vacante.titulo,
      descripcion: vacante.descripcion,
      ubicacion: vacante.ubicacion,
      tipoContrato: vacante.tipoContrato,
      salarioMin: vacante.salarioMin || '',
      salarioMax: vacante.salarioMax || '',
      requisitos: vacante.requisitos || [],
      umbralPuntaje: vacante.umbralPuntaje ?? 60,
      screeningActivo: vacante.screeningActivo ?? true,
    });
    setEditingId(vacante.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteVacante(pendingDeleteId);
      await fetchVacantes();
    } catch (error) {
      console.error('Error deleting vacante:', error);
    } finally {
      setPendingDeleteId(null);
    }
  };

  // Filter vacantes by search query
  const filteredVacantes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return vacantes;
    return vacantes.filter((v) => (
      v.titulo.toLowerCase().includes(query) ||
      v.descripcion.toLowerCase().includes(query) ||
      v.ubicacion.toLowerCase().includes(query) ||
      v.tipoContrato.toLowerCase().includes(query) ||
      (v.requisitos && v.requisitos.some((r) => r.toLowerCase().includes(query)))
    ));
  }, [vacantes, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVacantes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVacantes = useMemo(
    () => filteredVacantes.slice(startIndex, endIndex),
    [filteredVacantes, startIndex, endIndex]
  );

  // Reset to page 1 when search changes
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const activeCount = useMemo(
    () => vacantes.filter((v) => v.estaActiva).length,
    [vacantes]
  );
  const totalApplicants = useMemo(
    () => vacantes.reduce((sum, v) => sum + (v.postulacionesCount || 0), 0),
    [vacantes]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-accent-bg">
      {/* Header Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Breadcrumb
              items={[
                { label: 'Administración' },
                { label: 'Vacantes' },
              ]}
            />
            <h1 className="text-4xl md:text-4xl font-extrabold text-navy tracking-tight mb-2">
              Vacantes
            </h1>
            <p className="text-slate">
              Gestiona y supervisa {activeCount} posiciones activas en tu organización.
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-gradient-to-br from-brand-turquoise to-tertiary text-on-brand-turquoise px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-[0_8px_24px_rgba(64,224,208,0.25)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>+</span>
              Nueva Vacante
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
            <span className="text-slate text-xs font-semibold uppercase tracking-wider">
              Total Activas
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-navy">{activeCount}</span>
              <span className="text-xs text-green-light font-bold">
                de {vacantes.length}
              </span>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
            <span className="text-slate text-xs font-semibold uppercase tracking-wider">
              Postulaciones
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-navy">{totalApplicants}</span>
              <span className="text-accent">↑</span>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
            <span className="text-slate text-xs font-semibold uppercase tracking-wider">
              Promedio
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-navy">
                {vacantes.length > 0 ? Math.round(totalApplicants / vacantes.length) : 0}
              </span>
              <span className="text-xs text-slate">por vacante</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-turquoise to-tertiary text-on-brand-turquoise p-6 rounded-2xl border-none shadow-[0_8px_24px_rgba(64,224,208,0.25)] relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-on-brand-turquoise/70 text-xs font-semibold uppercase tracking-wider">
                Tasa Activas
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black">
                  {vacantes.length > 0
                    ? Math.round((activeCount / vacantes.length) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        <VacanteFormModal
          isOpen={showForm}
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          requisitoInput={requisitoInput}
          setRequisitoInput={setRequisitoInput}
          submitLoading={submitLoading}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />

        {/* Data Table Container */}
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between bg-accent-bg/50 border-b border-border/10">
            <h3 className="font-bold text-navy">Listado de Vacantes</h3>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Buscar por título, ubicación, requisito..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-[#030e21] text-on-surface border border-border rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-turquoise/30 transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate">
                  🔍
                </span>
              </div>
              <button className="p-2 text-slate hover:bg-accent-bg rounded-lg transition-colors">
                ⬇
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate">Cargando vacantes...</div>
          ) : vacantes.length === 0 ? (
            <div className="p-12 text-center text-slate">
              <p className="text-lg">No hay vacantes creadas</p>
              <p className="text-sm mt-2">Crea la primera presionando el botón "Nueva Vacante"</p>
            </div>
          ) : filteredVacantes.length === 0 ? (
            <div className="p-12 text-center text-slate">
              <p className="text-lg">No se encontraron vacantes</p>
              <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-accent-bg/30 border-b border-border/10">
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate">
                      Título
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate">
                      Ubicación
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate">
                      Contrato
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate">
                      Salario
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate">
                      Postulaciones
                    </th>
                    {canManage && (
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate text-right">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/5">
                  {paginatedVacantes.map((vacante) => (
                    <tr
                      key={vacante.id}
                      onClick={() => navigate(`/admin/vacantes/${vacante.id}/aplicantes`)}
                      className="hover:bg-accent-bg/20 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-navy">
                            {vacante.titulo}
                          </span>
                          <span className="text-xs text-slate">ID: #{formatId(vacante.id)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate">
                        {vacante.ubicacion}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase bg-accent-bg text-navy rounded-full">
                          {vacante.tipoContrato}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-navy">
                        {formatSalaryRange(vacante.salarioMin, vacante.salarioMax)}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-navy">
                        {vacante.postulacionesCount || 0}
                      </td>
                      {canManage && (
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(vacante);
                                }}
                                className="p-2 hover:bg-accent-bg rounded-lg text-navy transition-colors"
                                title="Editar"
                              >
                                ✎
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(vacante.id);
                                }}
                                className="p-2 hover:bg-danger-bg rounded-lg text-danger transition-colors"
                                title="Eliminar"
                              >
                                🗑
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredVacantes.length > 0 && (
            <div className="px-6 py-6 border-t border-border/10 flex items-center justify-between">
              <span className="text-sm text-slate">
                Mostrando <span className="font-bold text-navy">{startIndex + 1} - {Math.min(endIndex, filteredVacantes.length)}</span> de{' '}
                <span className="font-bold text-navy">{filteredVacantes.length}</span>
                {searchQuery && ` (${vacantes.length} total)`}
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={pendingDeleteId !== null}
        title="Eliminar vacante"
        message="¿Eliminar esta vacante y todas sus postulaciones? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
