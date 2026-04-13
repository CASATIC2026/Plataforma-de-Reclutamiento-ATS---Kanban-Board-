import { useState, useRef, useEffect } from 'react';
import { createPostulacion } from '../../api/postulacionesApi';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const SALVADORAN_DEPARTMENTS = [
  'Ahuachapán',
  'Santa Ana',
  'Sonsonate',
  'Chalatenango',
  'La Libertad',
  'San Salvador',
  'Cuscatlán',
  'La Paz',
  'San Vicente',
  'Cabañas',
  'Morazán',
  'La Unión',
  'Usulután',
  'San Miguel',
];

export default function ApplyModal({ job, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', carrera: '', ubicacion: '' });
  const [cvFile, setCvFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((e) => ({ ...e, cv: 'Solo se permiten archivos PDF, DOC o DOCX.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, cv: 'El archivo no debe superar los 5MB.' }));
      return;
    }
    setCvFile(file);
    setErrors((e) => ({ ...e, cv: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim() || form.name.trim().length < 3)
      next.name = 'Ingresa tu nombre completo.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Ingresa un correo electrónico válido.';
    if (!cvFile)
      next.cv = 'Por favor adjunta tu CV.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('NombreCandidato', form.name.trim());
    formData.append('Email', form.email.trim());
    formData.append('Telefono', form.phone.trim());
    formData.append('VacanteId', job.id);
    if (cvFile) formData.append('CvFile', cvFile);
    if (form.carrera.trim()) formData.append('Carrera', form.carrera.trim());
    if (form.ubicacion) formData.append('Ubicacion', form.ubicacion);

    try {
      await createPostulacion(formData);
      setSubmitted(true);
    } catch {
      setErrors({ submit: 'Hubo un error al enviar tu postulación. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay is-open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal modal--form">
        <button className="modal__close" aria-label="Cerrar" onClick={onClose}>
          &times;
        </button>

        {submitted ? (
          <div className="form-success">
            <div className="success-icon">✓</div>
            <h3 className="success-title">¡Aplicación enviada!</h3>
            <p className="success-text">
              Gracias, {form.name}. Tu aplicación para &quot;{job.title}&quot; ha sido recibida.
              Te contactaremos pronto.
            </p>
            <button className="btn btn--ghost" onClick={onSuccess}>Cerrar</button>
          </div>
        ) : (
          <>
            <div className="form-modal__header">
              <h2 className="modal__title">Aplicar: {job.title}</h2>
              <p className="form-modal__subtitle">{job.location} · {job.type}</p>
            </div>

            <form className="apply-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="apply-name">
                    Nombre completo *
                  </label>
                  <input
                    id="apply-name"
                    className={`form-input${errors.name ? ' error' : ''}`}
                    placeholder="Ej. Ana García López"
                    value={form.name}
                    onChange={setField('name')}
                  />
                  <span className="form-error">{errors.name || ''}</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="apply-phone">Teléfono</label>
                  <input
                    id="apply-phone"
                    type="tel"
                    className="form-input"
                    placeholder="+52 55 1234 5678"
                    value={form.phone}
                    onChange={setField('phone')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="apply-email">
                  Correo electrónico *
                </label>
                <input
                  id="apply-email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={setField('email')}
                />
                <span className="form-error">{errors.email || ''}</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="apply-carrera">
                    Habilidades técnicas (opcional)
                  </label>
                  <input
                    id="apply-carrera"
                    className="form-input"
                    placeholder="Ej: React, TypeScript, Git"
                    value={form.carrera}
                    onChange={setField('carrera')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="apply-ubicacion">
                    Departamento (opcional)
                  </label>
                  <select
                    id="apply-ubicacion"
                    className="form-input"
                    value={form.ubicacion}
                    onChange={setField('ubicacion')}
                  >
                    <option value="">Selecciona un departamento...</option>
                    {SALVADORAN_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">CV / Currículum *</label>
                {cvFile ? (
                  <div className="file-preview">
                    <div className="file-preview__icon">📄</div>
                    <div className="file-preview__name">{cvFile.name}</div>
                    <div className="file-preview__size">
                      {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                    <button
                      type="button"
                      className="file-preview__remove"
                      onClick={() => setCvFile(null)}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className={`dropzone${dragging ? ' drag-over' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <div className="dropzone__icon">📄</div>
                    <p className="dropzone__text">
                      Arrastra tu CV aquí o{' '}
                      <span className="dropzone__link">selecciona un archivo</span>
                    </p>
                    <p className="dropzone__hint">PDF, DOC, DOCX — máx. 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files[0]) handleFile(e.target.files[0]);
                      }}
                    />
                  </div>
                )}
                <span className="form-error">{errors.cv || ''}</span>
              </div>

              {errors.submit && (
                <p className="form-error" style={{ textAlign: 'center' }}>
                  {errors.submit}
                </p>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn--accent btn--lg btn--full"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Aplicación'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
