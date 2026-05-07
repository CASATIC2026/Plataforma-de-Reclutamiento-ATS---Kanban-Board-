export default function ApplyStep4Review({ formData, onChange, errors }) {
  const skills = formData.skills || [];
  const softSkills = formData.softSkills || [];
  const availability = (formData.availability || []).filter((a) => a.isAvailable);

  return (
    <div>
      <p className="apply-section-title">Revisa tu solicitud</p>

      {/* Personal info */}
      <div className="review-card">
        <h4>Información Personal</h4>
        <p><strong>Nombre:</strong> {formData.nombreCandidato || '—'}</p>
        <p><strong>Correo:</strong> {formData.email || '—'}</p>
        {formData.telefono && <p><strong>Teléfono:</strong> {formData.telefono}</p>}
        {formData.cvFile && <p><strong>CV:</strong> {formData.cvFile.name}</p>}
      </div>

      {/* Skills */}
      <div className="review-card">
        <h4>Habilidades ({skills.length} técnicas · {softSkills.length} blandas)</h4>
        {skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: softSkills.length ? '10px' : 0 }}>
            {skills.map((s, i) => (
              <span
                key={i}
                style={{
                  padding: '3px 10px', borderRadius: '4px', fontSize: '12px',
                  fontWeight: 600, backgroundColor: 'var(--clr-accent-bg)',
                  color: 'var(--clr-accent)',
                }}
              >
                {s.skillName}{s.proficiencyLevel ? ` · ${s.proficiencyLevel}` : ''}
              </span>
            ))}
          </div>
        )}
        {softSkills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {softSkills.map((s) => (
              <span
                key={s}
                style={{
                  padding: '3px 10px', borderRadius: '4px', fontSize: '12px',
                  backgroundColor: 'var(--clr-surface-2)', color: 'var(--clr-slate)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
        {formData.impactStatement && (
          <p style={{ marginTop: '10px', fontSize: '13px', fontStyle: 'italic', color: 'var(--clr-slate)' }}>
            "{formData.impactStatement}"
          </p>
        )}
      </div>

      {/* Availability */}
      {availability.length > 0 && (
        <div className="review-card">
          <h4>Disponibilidad ({availability.length} franjas)</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {availability.map((a, i) => (
              <span
                key={i}
                style={{
                  padding: '3px 10px', borderRadius: '4px', fontSize: '12px',
                  backgroundColor: 'var(--clr-green-bg, #dcfce7)', color: 'var(--clr-green)',
                }}
              >
                {a.dayOfWeek} · {a.timeSlot}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* GDPR & Consents */}
      <div style={{ margin: '20px 0 16px', borderTop: '1px solid var(--clr-border)', paddingTop: '20px' }}>
        <div className="consent-row">
          <input
            type="checkbox"
            id="consent-gdpr"
            checked={formData.consentGdpr || false}
            onChange={(e) => onChange('consentGdpr', e.target.checked)}
          />
          <label htmlFor="consent-gdpr">
            Acepto el tratamiento de mis datos personales conforme a la política de privacidad. <strong>*</strong>
          </label>
        </div>
        {errors.consentGdpr && (
          <span className="form-error" style={{ display: 'block', marginBottom: '8px', marginLeft: '26px' }}>
            {errors.consentGdpr}
          </span>
        )}

        <div className="consent-row">
          <input
            type="checkbox"
            id="consent-marketing"
            checked={formData.consentMarketing || false}
            onChange={(e) => onChange('consentMarketing', e.target.checked)}
          />
          <label htmlFor="consent-marketing">
            Acepto recibir comunicaciones sobre oportunidades laborales.
          </label>
        </div>

        <div className="consent-row">
          <input
            type="checkbox"
            id="attested-truth"
            checked={formData.attestedTruth || false}
            onChange={(e) => onChange('attestedTruth', e.target.checked)}
          />
          <label htmlFor="attested-truth">
            Certifico que la información proporcionada es verídica y exacta. <strong>*</strong>
          </label>
        </div>
        {errors.attestedTruth && (
          <span className="form-error" style={{ display: 'block', marginBottom: '8px', marginLeft: '26px' }}>
            {errors.attestedTruth}
          </span>
        )}
      </div>

      {/* Digital Signature */}
      <div className="form-group">
        <label className="form-label">Firma Digital *</label>
        <span className="form-hint" style={{ marginBottom: '6px' }}>
          Escribe tu nombre completo exactamente como lo ingresaste en el paso 1
        </span>
        <input
          className={`form-input${errors.attestedSignature ? ' error' : ''}`}
          value={formData.attestedSignature || ''}
          onChange={(e) => onChange('attestedSignature', e.target.value)}
          placeholder={formData.nombreCandidato || 'Tu nombre completo'}
        />
        {errors.attestedSignature && (
          <span className="form-error">{errors.attestedSignature}</span>
        )}
      </div>
    </div>
  );
}
