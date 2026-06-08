import {
  applySectionTitle,
  applyInput,
  applyInputError,
  applyTextarea,
  applyLabel,
  applyHint,
  applyError,
  applySoftSkillSelected,
  applySoftSkillDefault,
} from './applyFormStyles';

const SOFT_SKILLS_OPTIONS = [
  'Comunicación', 'Liderazgo', 'Trabajo en equipo', 'Resolución de problemas',
  'Adaptabilidad', 'Creatividad', 'Gestión del tiempo', 'Empatía',
];

const PROFICIENCY_OPTIONS = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];

function fieldClass(hasError) {
  return `${applyInput}${hasError ? ` ${applyInputError}` : ''}`;
}

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
    <div className="space-y-8">
      <div>
        <h3 className={applySectionTitle}>Habilidades técnicas</h3>

        <div className="space-y-3">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-surface-container border border-outline-variant/10 grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px_auto] gap-3 items-center"
            >
              <input
                className={applyInput}
                placeholder="Ej. React, Python..."
                value={skill.skillName}
                onChange={(e) => updateSkill(idx, 'skillName', e.target.value)}
              />
              <select
                className={applyInput}
                value={skill.proficiencyLevel}
                onChange={(e) => updateSkill(idx, 'proficiencyLevel', e.target.value)}
              >
                <option value="">Nivel</option>
                {PROFICIENCY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className={applyInput}
                placeholder="Años"
                min="0"
                max="50"
                value={skill.yearsExperience}
                onChange={(e) => updateSkill(idx, 'yearsExperience', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="text-on-surface-variant hover:text-error text-xl px-2"
                aria-label="Quitar habilidad"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {errors.skills && <span className={applyError}>{errors.skills}</span>}

        <button
          type="button"
          onClick={addSkill}
          className="mt-4 text-brand-turquoise font-semibold text-sm hover:text-brand-turquoise/80"
        >
          + Agregar habilidad
        </button>
      </div>

      <div>
        <h3 className={applySectionTitle}>
          Habilidades blandas{' '}
          <span className="text-xs font-normal text-on-surface-variant">(máx. 5)</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {SOFT_SKILLS_OPTIONS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSoftSkill(skill)}
              className={
                softSkills.includes(skill) ? applySoftSkillSelected : applySoftSkillDefault
              }
            >
              {skill}
            </button>
          ))}
        </div>
        {errors.softSkills && <span className={`${applyError} mt-2`}>{errors.softSkills}</span>}
      </div>

      <div>
        <label className={applyLabel}>Declaración de impacto *</label>
        <span className={applyHint}>
          ¿Por qué eres el candidato ideal? (30–500 caracteres)
        </span>
        <textarea
          className={`${applyTextarea}${errors.impactStatement ? ` ${applyInputError}` : ''}`}
          rows={6}
          value={formData.impactStatement || ''}
          onChange={(e) => onChange('impactStatement', e.target.value)}
          placeholder="Cuéntanos sobre tus logros más significativos..."
          maxLength={500}
        />
        <div className="text-right text-xs text-on-surface-variant mt-2">
          {(formData.impactStatement || '').length} / 500
        </div>
        {errors.impactStatement && (
          <span className={applyError}>{errors.impactStatement}</span>
        )}
      </div>
    </div>
  );
}
