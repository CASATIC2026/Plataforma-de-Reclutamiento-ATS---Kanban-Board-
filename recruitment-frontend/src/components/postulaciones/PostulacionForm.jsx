import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { createPostulacion } from '../../api/postulacionesApi';
import { validateName, validateEmail, validatePhone } from '../../utils/validators';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function PostulacionForm({ vacanteId, vacanteTitulo, onSuccess, onCancel }) {
  const [form, setForm] = useState({ nombreCandidato: '', email: '', telefono: '' });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hints, setHints] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    switch (field) {
      case 'nombreCandidato':
        return validateName(value, 'Nombre completo', 3).error;
      case 'email': {
        const res = validateEmail(value);
        setHints((h) => ({ ...h, email: res.suggestion || '' }));
        return res.error;
      }
      case 'telefono':
        return validatePhone(value).error;
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Live re-validation for touched fields
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((errs) => ({ ...errs, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const err = validateField(name, value);
    setErrors((errs) => ({ ...errs, [name]: err }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    if (!file) { setCvFile(null); return; }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((errs) => ({ ...errs, cv: 'Solo se permiten archivos PDF, DOC o DOCX.' }));
      setCvFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((errs) => ({ ...errs, cv: 'El archivo no debe superar los 5MB.' }));
      setCvFile(null);
      return;
    }
    setCvFile(file);
    setErrors((errs) => ({ ...errs, cv: '' }));
  };

  const validateAll = () => {
    const fields = ['nombreCandidato', 'email', 'telefono'];
    const newErrors = {};
    fields.forEach((f) => {
      newErrors[f] = validateField(f, form[f]);
    });
    setErrors(newErrors);
    setTouched({ nombreCandidato: true, email: true, telefono: true });
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setErrors((errs) => ({ ...errs, submit: '' }));

    const formData = new FormData();
    formData.append('NombreCandidato', form.nombreCandidato.trim());
    formData.append('Email', form.email.trim());
    formData.append('Telefono', form.telefono.trim());
    formData.append('VacanteId', vacanteId);
    if (cvFile) formData.append('CvFile', cvFile);

    try {
      await createPostulacion(formData);
      onSuccess();
    } catch {
      setErrors((errs) => ({ ...errs, submit: 'Hubo un error al enviar tu postulación. Intenta de nuevo.' }));
    } finally {
      setLoading(false);
    }
  };

  const isValid = (field) => touched[field] && !errors[field] && form[field].trim();

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <p className="text-sm text-gray-500">
        Postulándote a: <span className="font-semibold text-gray-700">{vacanteTitulo}</span>
      </p>

      <Input
        label="Nombre completo"
        name="nombreCandidato"
        value={form.nombreCandidato}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        placeholder="Juan García"
        error={errors.nombreCandidato || ''}
        success={isValid('nombreCandidato')}
      />

      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        placeholder="juan@email.com"
        error={errors.email || ''}
        success={isValid('email')}
        hint={!errors.email ? hints.email : ''}
      />

      <Input
        label="Teléfono"
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Ej: 7777-1234"
        error={errors.telefono || ''}
        success={isValid('telefono')}
        hint={!errors.telefono && !form.telefono ? 'Opcional — mín. 10 dígitos si se ingresa' : ''}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CV / Currículum <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-accent-bg file:text-accent hover:file:bg-accent/10"
        />
        {errors.cv && <p className="text-xs text-red-600 mt-1">{errors.cv}</p>}
        {cvFile && !errors.cv && (
          <p className="text-xs text-green-600 mt-1">
            {cvFile.name} ({(cvFile.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
      </div>

      {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

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
