const SOFT_SKILLS_OPTIONS = [
  'Comunicación', 'Liderazgo', 'Trabajo en equipo', 'Resolución de problemas',
  'Adaptabilidad', 'Creatividad', 'Gestión del tiempo', 'Empatía',
];

const PROFICIENCY_OPTIONS = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];

export default function ApplyStep2Skills({ formData, onChange, errors }) {
  const skills = formData.skills || [];
  const softSkills = formData.softSkills || [];

  const addSkill = () => {
    onChange('skills', [...skills, { skillName: '', proficiencyLevel: '', yearsExperience: '' }]);
  };

  const removeSkill = (idx) => {
    onChange('skills', skills.filter((_, i) => i !== idx));
  };

  const updateSkill = (idx, field, value) => {
    onChange('skills', skills.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const toggleSoftSkill = (skill) => {
    if (softSkills.includes(skill)) {
      onChange('softSkills', softSkills.filter((s) => s !== skill));
    } else if (softSkills.length < 5) {
      onChange('softSkills', [...softSkills, skill]);
    }
  };

  return (
    <div>
      <p className="apply-section-title">Habilidades Técnicas</p>

      {skills.map((skill, idx) => (
        <div key={idx} className="skill-row">
          <input
            className="form-input"
            placeholder="Ej. React, Python, SQL..."
            value={skill.skillName}
            onChange={(e) => updateSkill(idx, 'skillName', e.target.value)}
          />
          <select
            className="form-input"
            value={skill.proficiencyLevel}
            onChange={(e) => updateSkill(idx, 'proficiencyLevel', e.target.value)}
          >
            <option value="">Nivel</option>
            {PROFICIENCY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input
            type="number"
            className="form-input"
            placeholder="Años"
            min="0"
            max="50"
            value={skill.yearsExperience}
            onChange={(e) => updateSkill(idx, 'yearsExperience', e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeSkill(idx)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--clr-muted)', fontSize: '20px', padding: '0', lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      ))}

      {errors.skills && (
        <span className="form-error" style={{ display: 'block', marginBottom: '8px' }}>
          {errors.skills}
        </span>
      )}

      <button
        type="button"
        className="btn btn--ghost"
        style={{ marginTop: '4px', fontSize: '13px', padding: '6px 14px' }}
        onClick={addSkill}
      >
        + Agregar habilidad
      </button>

      <p className="apply-section-title" style={{ marginTop: '24px' }}>
        Habilidades Blandas{' '}
        <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--clr-muted)' }}>
          (máx. 5)
        </span>
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {SOFT_SKILLS_OPTIONS.map((skill) => (
          <button
            key={skill}
            type="button"
            className={`soft-skill-pill${softSkills.includes(skill) ? ' is-selected' : ''}`}
            onClick={() => toggleSoftSkill(skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      {errors.softSkills && (
        <span className="form-error" style={{ display: 'block', marginTop: '6px' }}>
          {errors.softSkills}
        </span>
      )}

      <div className="form-group" style={{ marginTop: '24px' }}>
        <label className="form-label">Declaración de Impacto *</label>
        <span className="form-hint" style={{ marginBottom: '6px' }}>
          ¿Por qué eres el candidato ideal? (30–500 caracteres)
        </span>
        <textarea
          className={`form-textarea${errors.impactStatement ? ' error' : ''}`}
          rows={4}
          value={formData.impactStatement || ''}
          onChange={(e) => onChange('impactStatement', e.target.value)}
          placeholder="Describe tu experiencia, logros y por qué encajas perfectamente en este rol..."
          maxLength={500}
        />
        <span className="form-hint" style={{ textAlign: 'right', display: 'block' }}>
          {(formData.impactStatement || '').length} / 500
        </span>
        {errors.impactStatement && (
          <span className="form-error">{errors.impactStatement}</span>
        )}
      </div>
    </div>
  );
}
