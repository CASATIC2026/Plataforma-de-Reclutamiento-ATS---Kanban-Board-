import { CONTRACT_TYPES } from '../../constants';

export default function VacanteFormModal({
  isOpen,
  editingId,
  formData,
  setFormData,
  requisitoInput,
  setRequisitoInput,
  submitLoading,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white shadow-2xl flex flex-col max-w-2xl w-full max-h-screen rounded-2xl overflow-hidden">
        {/* Form Header */}
        <div className="p-8 border-b border-border/10 flex justify-between items-center bg-bg">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy">
              {editingId ? 'Editar Vacante' : 'Nueva Vacante'}
            </h2>
            <p className="text-slate text-sm">
              {editingId
                ? 'Actualiza la información de la posición.'
                : 'Completa la información técnica de la posición.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-accent-bg rounded-full text-slate transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="vac-titulo"
              className="text-xs font-bold uppercase tracking-widest text-slate"
            >
              Título del Puesto
            </label>
            <input
              id="vac-titulo"
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleFormChange}
              required
              className="w-full bg-accent-bg border border-border rounded-xl p-3 focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all"
              placeholder="Ej: Senior Product Designer"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="vac-descripcion"
              className="text-xs font-bold uppercase tracking-widest text-slate"
            >
              Descripción
            </label>
            <textarea
              id="vac-descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleFormChange}
              required
              rows="4"
              className="w-full bg-accent-bg border border-border rounded-xl p-3 focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all"
              placeholder="Estamos buscando un diseñador con visión estratégica..."
            />
          </div>

          {/* Location & Contract Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="vac-ubicacion"
                className="text-xs font-bold uppercase tracking-widest text-slate"
              >
                Ubicación
              </label>
              <input
                id="vac-ubicacion"
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleFormChange}
                required
                className="w-full bg-accent-bg border border-border rounded-xl p-3 focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all"
                placeholder="Ej: San Salvador"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="vac-tipoContrato"
                className="text-xs font-bold uppercase tracking-widest text-slate"
              >
                Tipo de Contrato
              </label>
              <select
                id="vac-tipoContrato"
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleFormChange}
                className="w-full bg-accent-bg border border-border rounded-xl p-3 focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all appearance-none"
              >
                {CONTRACT_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="vac-salarioMin"
                className="text-xs font-bold uppercase tracking-widest text-slate"
              >
                Salario Mínimo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate">
                  $
                </span>
                <input
                  id="vac-salarioMin"
                  type="number"
                  name="salarioMin"
                  value={formData.salarioMin}
                  onChange={handleFormChange}
                  className="w-full bg-accent-bg border border-border rounded-xl p-3 pl-8 focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all"
                  placeholder="45000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="vac-salarioMax"
                className="text-xs font-bold uppercase tracking-widest text-slate"
              >
                Salario Máximo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate">
                  $
                </span>
                <input
                  id="vac-salarioMax"
                  type="number"
                  name="salarioMax"
                  value={formData.salarioMax}
                  onChange={handleFormChange}
                  className="w-full bg-accent-bg border border-border rounded-xl p-3 pl-8 focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all"
                  placeholder="60000"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <label
              htmlFor="vac-requisito"
              className="text-xs font-bold uppercase tracking-widest text-slate"
            >
              Requisitos
            </label>
            <div className="flex gap-2">
              <input
                id="vac-requisito"
                type="text"
                value={requisitoInput}
                onChange={(e) => setRequisitoInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-accent-bg border border-border rounded-xl p-3 focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all"
                placeholder="Ej: 5+ años experiencia"
              />
              <button
                type="button"
                onClick={addRequisito}
                className="px-4 py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy-light transition-colors"
              >
                Agregar
              </button>
            </div>

            {formData.requisitos.length > 0 && (
              <div className="space-y-2 mt-3">
                {formData.requisitos.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-accent-bg rounded-xl"
                  >
                    <span className="text-navy">✓</span>
                    <span className="text-sm text-navy">{req}</span>
                    <button
                      type="button"
                      onClick={() => removeRequisito(index)}
                      className="ml-auto text-slate hover:text-navy font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Screening Configuration */}
          <details className="space-y-2 p-4 bg-accent-bg/50 rounded-xl border border-border">
            <summary className="cursor-pointer font-bold text-slate uppercase tracking-widest text-xs">
              ⚙️ Configuración de Screening
            </summary>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="vac-screeningActivo"
                  className="text-sm text-slate font-semibold"
                >
                  Activar screening automático
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="vac-screeningActivo"
                    type="checkbox"
                    name="screeningActivo"
                    checked={formData.screeningActivo}
                    onChange={(e) =>
                      setFormData({ ...formData, screeningActivo: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy" />
                </label>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="vac-umbralPuntaje"
                  className="text-xs font-bold uppercase tracking-widest text-slate"
                >
                  Umbral de Aprobación (0-100)
                </label>
                <input
                  id="vac-umbralPuntaje"
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
                  className="w-full bg-white border border-border rounded-xl p-3 focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all"
                  placeholder="60"
                />
                <p className="text-xs text-slate">
                  Candidatos con puntaje menor serán marcados como rechazados automáticamente.
                </p>
              </div>
            </div>
          </details>
        </form>

        {/* Form Footer */}
        <div className="p-8 border-t border-border/10 bg-bg sticky bottom-0 flex gap-4">
          <button
            type="submit"
            onClick={onSubmit}
            disabled={submitLoading}
            className="flex-1 bg-gradient-to-br from-navy to-navy-light text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-navy-light/20 transition-all disabled:opacity-50"
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
            onClick={onClose}
            className="px-6 py-3 border border-border text-slate rounded-xl font-bold hover:bg-bg transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
