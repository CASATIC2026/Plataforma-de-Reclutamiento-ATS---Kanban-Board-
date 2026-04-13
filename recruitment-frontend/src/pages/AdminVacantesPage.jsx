import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVacantes, createVacante, deleteVacante, updateVacante } from '../api/vacantesApi';

export default function AdminVacantesPage() {
  const navigate = useNavigate();
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  const fetchVacantes = async () => {
    try {
      const response = await getVacantes();
      setVacantes(response.data);
    } catch (error) {
      console.error('Error fetching vacantes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacantes();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addRequisito = () => {
    const trimmed = requisitoInput.trim();
    if (trimmed && !formData.requisitos.includes(trimmed)) {
      setFormData({
        ...formData,
        requisitos: [...formData.requisitos, trimmed],
      });
      setRequisitoInput('');
    }
  };

  const removeRequisito = (index) => {
    setFormData({
      ...formData,
      requisitos: formData.requisitos.filter((_, i) => i !== index),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRequisito();
    }
  };

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
        await createVacante(payload);
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

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta vacante y todas sus postulaciones?')) return;
    try {
      await deleteVacante(id);
      await fetchVacantes();
    } catch (error) {
      console.error('Error deleting vacante:', error);
    }
  };

  // Filter vacantes by search query
  const filteredVacantes = vacantes.filter((v) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      v.titulo.toLowerCase().includes(query) ||
      v.descripcion.toLowerCase().includes(query) ||
      v.ubicacion.toLowerCase().includes(query) ||
      v.tipoContrato.toLowerCase().includes(query) ||
      (v.requisitos && v.requisitos.some((r) => r.toLowerCase().includes(query)))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredVacantes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVacantes = filteredVacantes.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const activeCount = vacantes.filter((v) => v.estaActiva).length;
  const totalApplicants = vacantes.reduce((sum, v) => sum + (v.postulacionesCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] to-[#eaedff]">
      {/* Header Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <nav className="flex items-center gap-2 text-[#464555] text-xs mb-2">
              <span>Administración</span>
              <span>›</span>
              <span className="text-[#3525cd] font-medium">Vacantes</span>
            </nav>
            <h1 className="text-4xl md:text-4xl font-extrabold text-[#131b2e] tracking-tight mb-2">
              Vacantes
            </h1>
            <p className="text-[#464555]">
              Gestiona y supervisa {activeCount} posiciones activas en tu organización.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>+</span>
            Nueva Vacante
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-2xl border-none shadow-sm flex flex-col justify-between">
            <span className="text-[#464555] text-xs font-semibold uppercase tracking-wider">
              Total Activas
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-[#131b2e]">{activeCount}</span>
              <span className="text-xs text-green-600 font-bold">
                de {vacantes.length}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-none shadow-sm">
            <span className="text-[#464555] text-xs font-semibold uppercase tracking-wider">
              Postulaciones
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-[#131b2e]">{totalApplicants}</span>
              <span className="text-[#3525cd]">↑</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-none shadow-sm">
            <span className="text-[#464555] text-xs font-semibold uppercase tracking-wider">
              Promedio
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-[#131b2e]">
                {vacantes.length > 0 ? Math.round(totalApplicants / vacantes.length) : 0}
              </span>
              <span className="text-xs text-[#464555]">por vacante</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white p-6 rounded-2xl border-none shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[#e2dfff] text-xs font-semibold uppercase tracking-wider">
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

        {/* Form Modal / Slide-over */}
        {showForm && (
          <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#131b2e]/40 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <div className="relative bg-white shadow-2xl flex flex-col max-w-2xl w-full max-h-screen rounded-2xl overflow-hidden">
              {/* Form Header */}
              <div className="p-8 border-b border-[#c7c4d8]/10 flex justify-between items-center bg-[#faf8ff]">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#131b2e]">
                    {editingId ? 'Editar Vacante' : 'Nueva Vacante'}
                  </h2>
                  <p className="text-[#464555] text-sm">
                    {editingId
                      ? 'Actualiza la información de la posición.'
                      : 'Completa la información técnica de la posición.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-[#eaedff] rounded-full text-[#464555] transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                    Título del Puesto
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 focus:ring-2 focus:ring-[#3525cd]/20 focus:border-transparent outline-none transition-all"
                    placeholder="Ej: Senior Product Designer"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleFormChange}
                    required
                    rows="4"
                    className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 focus:ring-2 focus:ring-[#3525cd]/20 focus:border-transparent outline-none transition-all"
                    placeholder="Estamos buscando un diseñador con visión estratégica..."
                  />
                </div>

                {/* Location & Contract Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 focus:ring-2 focus:ring-[#3525cd]/20 focus:border-transparent outline-none transition-all"
                      placeholder="Ej: San Salvador"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                      Tipo de Contrato
                    </label>
                    <select
                      name="tipoContrato"
                      value={formData.tipoContrato}
                      onChange={handleFormChange}
                      className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 focus:ring-2 focus:ring-[#3525cd]/20 focus:border-transparent outline-none transition-all appearance-none"
                    >
                      <option>Tiempo completo</option>
                      <option>Medio tiempo</option>
                      <option>Freelance</option>
                      <option>Remoto</option>
                      <option>Temporal</option>
                      <option>Prácticas</option>
                      <option>Por proyecto</option>
                    </select>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                      Salario Mínimo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#464555]">
                        $
                      </span>
                      <input
                        type="number"
                        name="salarioMin"
                        value={formData.salarioMin}
                        onChange={handleFormChange}
                        className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 pl-8 focus:ring-2 focus:ring-[#3525cd]/20 focus:border-transparent outline-none transition-all"
                        placeholder="45000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                      Salario Máximo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#464555]">
                        $
                      </span>
                      <input
                        type="number"
                        name="salarioMax"
                        value={formData.salarioMax}
                        onChange={handleFormChange}
                        className="w-full bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 pl-8 focus:ring-2 focus:ring-[#3525cd]/20 focus:border-transparent outline-none transition-all"
                        placeholder="60000"
                      />
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                    Requisitos
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={requisitoInput}
                      onChange={(e) => setRequisitoInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl p-3 focus:ring-2 focus:ring-[#3525cd]/20 focus:border-transparent outline-none transition-all"
                      placeholder="Ej: 5+ años experiencia"
                    />
                    <button
                      type="button"
                      onClick={addRequisito}
                      className="px-4 py-3 bg-[#3525cd] text-white rounded-xl font-bold hover:bg-[#2816b8] transition-colors"
                    >
                      Agregar
                    </button>
                  </div>

                  {formData.requisitos.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.requisitos.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-[#e2dfff] rounded-xl"
                        >
                          <span className="text-[#3525cd]">✓</span>
                          <span className="text-sm text-[#131b2e]">{req}</span>
                          <button
                            type="button"
                            onClick={() => removeRequisito(index)}
                            className="ml-auto text-[#464555] hover:text-[#131b2e] font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Screening Configuration */}
                <details className="space-y-2 p-4 bg-[#f2f3ff]/50 rounded-xl border border-[#dae2fd]">
                  <summary className="cursor-pointer font-bold text-[#464555] uppercase tracking-widest text-xs">
                    ⚙️ Configuración de Screening
                  </summary>
                  <div className="space-y-4 mt-4">
                    {/* Toggle Screening Active */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#464555] font-semibold">
                        Activar screening automático
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="screeningActivo"
                          checked={formData.screeningActivo}
                          onChange={(e) =>
                            setFormData({ ...formData, screeningActivo: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3525cd]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3525cd]" />
                      </label>
                    </div>

                    {/* Threshold Score */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                        Umbral de Aprobación (0-100)
                      </label>
                      <input
                        type="number"
                        name="umbralPuntaje"
                        min="0"
                        max="100"
                        value={formData.umbralPuntaje}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            umbralPuntaje: Math.max(0, Math.min(100, Number(e.target.value))),
                          })
                        }
                        className="w-full bg-white border border-[#dae2fd] rounded-xl p-3 focus:ring-2 focus:ring-[#3525cd]/20 focus:border-transparent outline-none transition-all"
                        placeholder="60"
                      />
                      <p className="text-xs text-[#464555]">
                        Candidatos con puntaje menor serán marcados como rechazados automáticamente.
                      </p>
                    </div>
                  </div>
                </details>
              </form>

              {/* Form Footer */}
              <div className="p-8 border-t border-[#c7c4d8]/10 bg-[#faf8ff] sticky bottom-0 flex gap-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="flex-1 bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-[#4f46e5]/20 transition-all disabled:opacity-50"
                >
                  {submitLoading
                    ? editingId
                      ? 'Actualizando...'
                      : 'Creando...'
                    : editingId
                    ? 'Actualizar Vacante'
                    : 'Crear Vacante'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-[#c7c4d8] text-[#464555] rounded-xl font-bold hover:bg-[#faf8ff] transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Table Container */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between bg-[#f2f3ff]/50 border-b border-[#c7c4d8]/10">
            <h3 className="font-bold text-[#131b2e]">Listado de Vacantes</h3>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Buscar por título, ubicación, requisito..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-white border border-[#c7c4d8] rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#464555]">
                  🔍
                </span>
              </div>
              <button className="p-2 text-[#464555] hover:bg-[#eaedff] rounded-lg transition-colors">
                ⬇
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-[#464555]">Cargando vacantes...</div>
          ) : vacantes.length === 0 ? (
            <div className="p-12 text-center text-[#464555]">
              <p className="text-lg">No hay vacantes creadas</p>
              <p className="text-sm mt-2">Crea la primera presionando el botón "Nueva Vacante"</p>
            </div>
          ) : filteredVacantes.length === 0 ? (
            <div className="p-12 text-center text-[#464555]">
              <p className="text-lg">No se encontraron vacantes</p>
              <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f3ff]/30 border-b border-[#c7c4d8]/10">
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[#464555]">
                      Título
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[#464555]">
                      Ubicación
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[#464555]">
                      Contrato
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[#464555]">
                      Salario
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[#464555]">
                      Postulaciones
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[#464555] text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7c4d8]/5">
                  {paginatedVacantes.map((vacante) => (
                    <tr
                      key={vacante.id}
                      onClick={() => navigate(`/admin/vacantes/${vacante.id}/aplicantes`)}
                      className="hover:bg-[#f2f3ff]/20 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#131b2e]">
                            {vacante.titulo}
                          </span>
                          <span className="text-xs text-[#464555]">ID: #{vacante.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-[#464555]">
                        {vacante.ubicacion}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase bg-[#e2dfff] text-[#3525cd] rounded-full">
                          {vacante.tipoContrato}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-[#131b2e]">
                        {vacante.salarioMin && vacante.salarioMax
                          ? `$${vacante.salarioMin.toLocaleString()} - $${vacante.salarioMax.toLocaleString()}`
                          : '-'}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-[#131b2e]">
                        {vacante.postulacionesCount || 0}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(vacante);
                            }}
                            className="p-2 hover:bg-[#eaedff] rounded-lg text-[#3525cd] transition-colors"
                            title="Editar"
                          >
                            ✎
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(vacante.id);
                            }}
                            className="p-2 hover:bg-[#ffdad6] rounded-lg text-[#ba1a1a] transition-colors"
                            title="Eliminar"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredVacantes.length > 0 && (
            <div className="px-6 py-6 border-t border-[#c7c4d8]/10 flex items-center justify-between">
              <span className="text-sm text-[#464555]">
                Mostrando <span className="font-bold text-[#131b2e]">{startIndex + 1} - {Math.min(endIndex, filteredVacantes.length)}</span> de{' '}
                <span className="font-bold text-[#131b2e]">{filteredVacantes.length}</span>
                {searchQuery && ` (${vacantes.length} total)`}
              </span>
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-[#f2f3ff] text-[#464555] opacity-50 cursor-not-allowed'
                      : 'bg-[#f2f3ff] text-[#3525cd] hover:bg-[#eaedff] cursor-pointer'
                  }`}
                  title="Página anterior"
                >
                  ‹
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo(0, 0);
                      }}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                        page === currentPage
                          ? 'bg-[#3525cd] text-white'
                          : 'bg-[#f2f3ff] text-[#3525cd] hover:bg-[#eaedff]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-[#f2f3ff] text-[#464555] opacity-50 cursor-not-allowed'
                      : 'bg-[#f2f3ff] text-[#3525cd] hover:bg-[#eaedff] cursor-pointer'
                  }`}
                  title="Página siguiente"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
