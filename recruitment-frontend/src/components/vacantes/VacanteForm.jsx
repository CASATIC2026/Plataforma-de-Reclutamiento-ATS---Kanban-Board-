import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateName, validateSalary, validateRequirementTag } from '../../utils/validators';

export default function VacanteForm({ onSubmit }) {
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    tipoContrato: 'Tiempo completo',
    salarioMin: '',
    salarioMax: '',
  });

  const [requisitoInput, setRequisitoInput] = useState('');
  const [requisitos, setRequisitos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const RESTRICTED_FIELDS = ['titulo', 'descripcion', 'ubicacion'];

  const validateField = (name, value) => {
    switch (name) {
      case 'titulo':
        return validateName(value, 'Título', 3).error;
      case 'descripcion': {
        const trimmed = (value || '').trim();
        if (!trimmed) return 'La descripción es requerida.';
        if (trimmed.length < 10) return `Descripción muy corta (${trimmed.length} de 10 caracteres mín.)`;
        return '';
      }
      case 'ubicacion':
        return validateName(value, 'Ubicación', 3).error;
      case 'salarioMin':
      case 'salarioMax':
        return validateSalary(
          name === 'salarioMin' ? value : form.salarioMin,
          name === 'salarioMax' ? value : form.salarioMax
        ).error;
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleaned = RESTRICTED_FIELDS.includes(name)
      ? value.replace(/^[\s.:;]+/, '')
      : value;
    setForm((f) => ({ ...f, [name]: cleaned }));
    if (touched[name]) {
      setErrors((errs) => ({ ...errs, [name]: validateField(name, cleaned) }));
    }
    // Cross-validate salary when the other field changes
    if (name === 'salarioMin' || name === 'salarioMax') {
      const otherKey = name === 'salarioMin' ? 'salarioMax' : 'salarioMin';
      if (touched[otherKey]) {
        const otherValue = name === 'salarioMin' ? form.salarioMax : form.salarioMax;
        const salErr = validateSalary(
          name === 'salarioMin' ? cleaned : form.salarioMin,
          name === 'salarioMax' ? cleaned : form.salarioMax
        ).error;
        setErrors((errs) => ({ ...errs, salarioMin: salErr, salarioMax: salErr }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((errs) => ({ ...errs, [name]: validateField(name, value) }));
  };

  const [tagError, setTagError] = useState('');

  const addRequisito = () => {
    const res = validateRequirementTag(requisitoInput, requisitos);
    if (!res.valid) {
      setTagError(res.error);
      return;
    }
    setRequisitos([...requisitos, requisitoInput.trim()]);
    setRequisitoInput('');
    setTagError('');
  };

  const removeRequisito = (index) => {
    setRequisitos(requisitos.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRequisito();
    }
  };

  const validateAll = () => {
    const fields = ['titulo', 'descripcion', 'ubicacion', 'salarioMin', 'salarioMax'];
    const newErrors = {};
    fields.forEach((f) => {
      newErrors[f] = validateField(f, form[f]);
    });
    setErrors(newErrors);
    setTouched({ titulo: true, descripcion: true, ubicacion: true, salarioMin: true, salarioMax: true });
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);

    const payload = {
      ...form,
      salarioMin: form.salarioMin ? Number(form.salarioMin) : null,
      salarioMax: form.salarioMax ? Number(form.salarioMax) : null,
      requisitos,
    };

    try {
      await onSubmit(payload);
      setForm({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        tipoContrato: 'Tiempo completo',
        salarioMin: '',
        salarioMax: '',
      });
      setRequisitos([]);
      setErrors({});
      setTouched({});
    } finally {
      setLoading(false);
    }
  };

  const isValid = (field) => touched[field] && !errors[field] && form[field].toString().trim();

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl shadow p-6 space-y-4 border-l-4 border-accent">
      <h2 className="text-lg font-bold text-navy">Nueva Vacante</h2>

      <Input
        label="Título"
        name="titulo"
        value={form.titulo}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        error={errors.titulo || ''}
        success={isValid('titulo')}
      />

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
          required
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.descripcion
              ? 'border-red-400 focus:ring-red-300'
              : isValid('descripcion')
              ? 'border-green-400 focus:ring-green-300'
              : 'border-gray-300 focus:ring-indigo-500'
          }`}
        />
        {errors.descripcion && (
          <p className="text-xs text-red-600 mt-1">{errors.descripcion}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Ubicación"
          name="ubicacion"
          value={form.ubicacion}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={errors.ubicacion || ''}
          success={isValid('ubicacion')}
        />
        <div>
          <label htmlFor="tipoContrato" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Contrato
          </label>
          <select
            id="tipoContrato"
            name="tipoContrato"
            value={form.tipoContrato}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option>Tiempo completo</option>
            <option>Medio tiempo</option>
            <option>Freelance</option>
            <option>Contrato temporal</option>
            <option>Prácticas</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Salario Mínimo"
          name="salarioMin"
          type="number"
          value={form.salarioMin}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Opcional"
          error={errors.salarioMin || ''}
        />
        <Input
          label="Salario Máximo"
          name="salarioMax"
          type="number"
          value={form.salarioMax}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Opcional"
          error={errors.salarioMax || ''}
        />
      </div>

      {/* Requisitos / Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={requisitoInput}
            onChange={(e) => { setRequisitoInput(e.target.value); setTagError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="Ej: C#, Junior, Inglés..."
            className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
              tagError ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-accent'
            }`}
          />
          <Button type="button" onClick={addRequisito}>
            Agregar
          </Button>
        </div>
        {tagError && <p className="text-xs text-red-600 mt-1">{tagError}</p>}

        {requisitos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {requisitos.map((req, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-accent-bg text-accent px-3 py-1 rounded-full text-sm"
              >
                {req}
                <button
                  type="button"
                  onClick={() => removeRequisito(index)}
                  className="text-accent hover:text-accent-light font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Vacante'}
      </Button>
    </form>
  );
}
