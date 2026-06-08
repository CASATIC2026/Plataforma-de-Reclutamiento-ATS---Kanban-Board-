import {
  applySectionTitle,
  applyInput,
  applyInputError,
  applyLabel,
  applyHint,
  applyError,
  applyReviewCard,
  applyReviewCardHeader,
} from './applyFormStyles';

function fieldClass(hasError) {
  return `${applyInput}${hasError ? ` ${applyInputError}` : ''}`;
}

export default function ApplyStep4Review({ formData, jobTitle, onChange, errors }) {
  const skills = formData.skills || [];
  const softSkills = formData.softSkills || [];
  const availability = (formData.availability || []).filter((a) => a.isAvailable);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-on-surface font-display mb-2">Revisa tu solicitud</h3>
        <p className="text-on-surface-variant text-sm">
          Confirma que todos los detalles sean correctos antes del envío final.
        </p>
      </div>

      <div className={applyReviewCard}>
        <div className={applyReviewCardHeader}>
          <h4 className="font-bold text-on-surface text-sm">Datos personales</h4>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Nombre</p>
            <p className="text-on-surface font-semibold">{formData.nombreCandidato || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Email</p>
            <p className="text-on-surface font-semibold">{formData.email || '—'}</p>
          </div>
          {formData.telefono && (
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Teléfono</p>
              <p className="text-on-surface font-semibold">{formData.telefono}</p>
            </div>
          )}
          {formData.cvFile && (
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">CV</p>
              <p className="text-tertiary font-semibold">✓ {formData.cvFile.name}</p>
            </div>
          )}
        </div>
      </div>

      <div className={applyReviewCard}>
        <div className={applyReviewCardHeader}>
          <h4 className="font-bold text-on-surface text-sm">Habilidades y perfil</h4>
        </div>
        <div className="p-4 space-y-4 text-sm">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
              Puesto solicitado
            </p>
            <p className="text-on-surface font-semibold">{jobTitle}</p>
          </div>
          {skills.length > 0 && (
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                Habilidades técnicas
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-orange-600/40 text-orange-300 text-xs font-medium"
                  >
                    {s.skillName}
                    {s.proficiencyLevel ? ` · ${s.proficiencyLevel}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          {softSkills.length > 0 && (
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                Habilidades blandas
              </p>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {formData.impactStatement && (
            <p className="text-on-surface-variant italic text-sm border-l-2 border-brand-turquoise/30 pl-3">
              &ldquo;{formData.impactStatement}&rdquo;
            </p>
          )}
        </div>
      </div>

      {availability.length > 0 && (
        <div className={applyReviewCard}>
          <div className={applyReviewCardHeader}>
            <h4 className="font-bold text-on-surface text-sm">Disponibilidad</h4>
          </div>
          <div className="p-4 flex flex-wrap gap-2">
            {availability.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-brand-turquoise/15 text-brand-turquoise text-xs font-medium"
              >
                {a.dayOfWeek} · {a.timeSlot}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 pt-2 border-t border-outline-variant/10">
        <label className="flex items-start gap-3 cursor-pointer text-sm text-on-surface-variant">
          <input
            type="checkbox"
            checked={formData.consentGdpr || false}
            onChange={(e) => onChange('consentGdpr', e.target.checked)}
            className="mt-1 accent-brand-turquoise"
          />
          <span>
            Acepto el tratamiento de mis datos personales conforme a la política de privacidad.{' '}
            <strong className="text-on-surface">*</strong>
          </span>
        </label>
        {errors.consentGdpr && <span className={applyError}>{errors.consentGdpr}</span>}

        <label className="flex items-start gap-3 cursor-pointer text-sm text-on-surface-variant">
          <input
            type="checkbox"
            checked={formData.consentMarketing || false}
            onChange={(e) => onChange('consentMarketing', e.target.checked)}
            className="mt-1 accent-brand-turquoise"
          />
          <span>Acepto recibir comunicaciones sobre oportunidades laborales.</span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer text-sm text-on-surface-variant">
          <input
            type="checkbox"
            checked={formData.attestedTruth || false}
            onChange={(e) => onChange('attestedTruth', e.target.checked)}
            className="mt-1 accent-brand-turquoise"
          />
          <span>
            Certifico que la información proporcionada es verídica.{' '}
            <strong className="text-on-surface">*</strong>
          </span>
        </label>
        {errors.attestedTruth && <span className={applyError}>{errors.attestedTruth}</span>}
      </div>

      <div>
        <label className={applyLabel}>Firma digital *</label>
        <span className={applyHint}>Escribe tu nombre completo como en el paso 1</span>
        <input
          className={fieldClass(errors.attestedSignature)}
          value={formData.attestedSignature || ''}
          onChange={(e) => onChange('attestedSignature', e.target.value)}
          placeholder={formData.nombreCandidato || 'Tu nombre completo'}
        />
        {errors.attestedSignature && (
          <span className={applyError}>{errors.attestedSignature}</span>
        )}
      </div>

      <div className="p-4 rounded-lg bg-brand-turquoise/10 border border-brand-turquoise/20">
        <p className="text-sm text-on-surface">
          Al enviar, confirmas que toda la información es verídica y aceptas nuestros términos de
          servicio.
        </p>
      </div>
    </div>
  );
}
