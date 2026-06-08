import {
  applySectionTitle,
  applyInput,
  applyInputError,
  applyLabel,
  applyHint,
  applyError,
} from './applyFormStyles';

const DEPARTAMENTOS_SV = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad',
  'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador',
  'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután',
];

function fieldClass(hasError) {
  return `${applyInput}${hasError ? ` ${applyInputError}` : ''}`;
}

export default function ApplyStep1BasicInfo({ formData, onChange, errors }) {
  return (
    <div className="space-y-6">
      <h3 className={applySectionTitle}>Información personal</h3>
      <div className="grid gap-4">
        <div>
          <label className={applyLabel}>Nombre completo *</label>
          <input
            className={fieldClass(errors.nombreCandidato)}
            value={formData.nombreCandidato || ''}
            onChange={(e) => onChange('nombreCandidato', e.target.value)}
            placeholder="Ej. Ana García López"
          />
          {errors.nombreCandidato && <span className={applyError}>{errors.nombreCandidato}</span>}
        </div>

        <div>
          <label className={applyLabel}>Correo electrónico *</label>
          <input
            type="email"
            className={fieldClass(errors.email)}
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="tu@correo.com"
          />
          {errors.email && <span className={applyError}>{errors.email}</span>}
        </div>

        <div>
          <label className={applyLabel}>Teléfono (opcional)</label>
          <input
            type="tel"
            className={fieldClass(errors.telefono)}
            value={formData.telefono || ''}
            onChange={(e) => onChange('telefono', e.target.value)}
            placeholder="+503 7777-1234"
          />
          {errors.telefono && <span className={applyError}>{errors.telefono}</span>}
          {!errors.telefono && !formData.telefono && (
            <span className={applyHint}>Opcional — mín. 10 dígitos si se ingresa</span>
          )}
        </div>

        <div>
          <label className={applyLabel}>Departamento (opcional)</label>
          <select
            className={fieldClass(errors.ubicacion)}
            value={formData.ubicacion || ''}
            onChange={(e) => onChange('ubicacion', e.target.value)}
          >
            <option value="">Selecciona tu departamento…</option>
            {DEPARTAMENTOS_SV.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <span className={applyHint}>Mejora la puntuación si coincide con la ubicación de la vacante</span>
        </div>
      </div>
    </div>
  );
}
