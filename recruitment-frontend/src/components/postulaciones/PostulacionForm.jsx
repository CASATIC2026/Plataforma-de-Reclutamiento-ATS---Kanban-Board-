import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { createPostulacion } from '../../api/postulacionesApi';

export default function PostulacionForm({ vacanteId, vacanteTitulo, onSuccess, onCancel }) {
  const [form, setForm] = useState({ nombreCandidato: '', email: '', telefono: '' });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('NombreCandidato', form.nombreCandidato);
    formData.append('Email', form.email);
    formData.append('Telefono', form.telefono);
    formData.append('VacanteId', vacanteId);
    if (cvFile) formData.append('CvFile', cvFile);

    try {
      await createPostulacion(formData);
      onSuccess();
    } catch {
      setError('Hubo un error al enviar tu postulación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">
        Postulándote a: <span className="font-semibold text-gray-700">{vacanteTitulo}</span>
      </p>

      <Input
        label="Nombre completo"
        name="nombreCandidato"
        value={form.nombreCandidato}
        onChange={handleChange}
        required
        placeholder="Juan García"
      />

      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        placeholder="juan@email.com"
      />

      <Input
        label="Teléfono"
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Opcional"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CV / Currículum <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setCvFile(e.target.files[0] || null)}
          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar postulación'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
