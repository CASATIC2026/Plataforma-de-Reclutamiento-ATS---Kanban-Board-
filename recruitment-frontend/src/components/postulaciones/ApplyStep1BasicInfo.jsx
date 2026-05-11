const DEPARTAMENTOS_SV = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad',
  'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador',
  'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután',
];

export default function ApplyStep1BasicInfo({ formData, onChange, errors }) {
  return (
    <div>
      <div className="form-group">
        <label className="form-label">Nombre Completo *</label>
        <input
          className={`form-input${errors.nombreCandidato ? ' error' : ''}`}
          value={formData.nombreCandidato || ''}
          onChange={(e) => onChange('nombreCandidato', e.target.value)}
          placeholder="Ej. Ana García López"
        />
        {errors.nombreCandidato && (
          <span className="form-error">{errors.nombreCandidato}</span>
        )}
      </div>

      <div className="form-group" style={{ marginTop: '16px' }}>
        <label className="form-label">Correo Electrónico *</label>
        <input
          type="email"
          className={`form-input${errors.email ? ' error' : ''}`}
          value={formData.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="tu@correo.com"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group" style={{ marginTop: '16px' }}>
        <label className="form-label">Teléfono (Opcional)</label>
        <input
          type="tel"
          className={`form-input${errors.telefono ? ' error' : ''}`}
          value={formData.telefono || ''}
          onChange={(e) => onChange('telefono', e.target.value)}
          placeholder="+503 7777-1234"
        />
        {errors.telefono && <span className="form-error">{errors.telefono}</span>}
        {!errors.telefono && !formData.telefono && (
          <span className="form-hint">Opcional — mín. 10 dígitos si se ingresa</span>
        )}
      </div>

      <div className="form-group" style={{ marginTop: '16px' }}>
        <label className="form-label">Departamento (Opcional)</label>
        <select
          className={`form-input${errors.ubicacion ? ' error' : ''}`}
          value={formData.ubicacion || ''}
          onChange={(e) => onChange('ubicacion', e.target.value)}
        >
          <option value="">Selecciona tu departamento…</option>
          {DEPARTAMENTOS_SV.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <span className="form-hint">Mejora la puntuación si coincide con la ubicación de la vacante</span>
      </div>
    </div>
  );
}
