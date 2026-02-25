import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRequisito = () => {
    const trimmed = requisitoInput.trim();
    if (trimmed && !requisitos.includes(trimmed)) {
      setRequisitos([...requisitos, trimmed]);
      setRequisitoInput('');
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      salarioMin: form.salarioMin ? Number(form.salarioMin) : null,
      salarioMax: form.salarioMax ? Number(form.salarioMax) : null,
      requisitos,
    };

    try {
      await onSubmit(payload);
      // Reset form
      setForm({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        tipoContrato: 'Tiempo completo',
        salarioMin: '',
        salarioMax: '',
      });
      setRequisitos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Nueva Vacante</h2>

      <Input label="Título" name="titulo" value={form.titulo} onChange={handleChange} required />

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows={3}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Ubicación" name="ubicacion" value={form.ubicacion} onChange={handleChange} required />
        <div>
          <label htmlFor="tipoContrato" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Contrato
          </label>
          <select
            id="tipoContrato"
            name="tipoContrato"
            value={form.tipoContrato}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
        <Input label="Salario Mínimo" name="salarioMin" type="number" value={form.salarioMin} onChange={handleChange} placeholder="Opcional" />
        <Input label="Salario Máximo" name="salarioMax" type="number" value={form.salarioMax} onChange={handleChange} placeholder="Opcional" />
      </div>

      {/* Requisitos / Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={requisitoInput}
            onChange={(e) => setRequisitoInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: C#, Junior, Inglés..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Button type="button" onClick={addRequisito}>
            Agregar
          </Button>
        </div>

        {requisitos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {requisitos.map((req, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {req}
                <button
                  type="button"
                  onClick={() => removeRequisito(index)}
                  className="text-indigo-400 hover:text-indigo-700 font-bold"
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