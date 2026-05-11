import { useEffect, useState } from 'react';
import { createPostulacionStructured } from '../../api/postulacionesApi';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateImpactStatement,
  validateSignature,
  validateSkills,
  validateSoftSkills,
  validateScreeningResponses,
} from '../../utils/validators';
import ApplyFormProgress from './ApplyFormProgress';
import ApplyStep1BasicInfo from './ApplyStep1BasicInfo';
import ApplyStep2Skills from './ApplyStep2Skills';
import ApplyStep3Screening from './ApplyStep3Screening';
import ApplyStep4Review from './ApplyStep4Review';

const STEPS = ['Información', 'Habilidades', 'Preguntas', 'Revisión'];

export default function ApplyModal({ job, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombreCandidato: '',
    email: '',
    telefono: '',
    ubicacion: '',
    skills: [],
    softSkills: [],
    impactStatement: '',
    cvFile: null,
    screeningResponses: [],
    availability: [],
    consentGdpr: false,
    consentMarketing: false,
    attestedTruth: false,
    attestedSignature: '',
    startTime: Date.now(),
    applicationSource: 'direct',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [screeningQuestions, setScreeningQuestions] = useState([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      const nameRes = validateName(formData.nombreCandidato, 'Nombre completo', 3);
      if (!nameRes.valid) newErrors.nombreCandidato = nameRes.error;

      const emailRes = validateEmail(formData.email);
      if (!emailRes.valid) newErrors.email = emailRes.error;

      const phoneRes = validatePhone(formData.telefono);
      if (!phoneRes.valid) newErrors.telefono = phoneRes.error;
    }

    if (step === 2) {
      const skillsRes = validateSkills(formData.skills);
      if (!skillsRes.valid) newErrors.skills = skillsRes.error;

      const softRes = validateSoftSkills(formData.softSkills);
      if (!softRes.valid) newErrors.softSkills = softRes.error;

      const impactRes = validateImpactStatement(formData.impactStatement);
      if (!impactRes.valid) newErrors.impactStatement = impactRes.error;
    }

    if (step === 3 && screeningQuestions.length > 0) {
      const screenRes = validateScreeningResponses(
        formData.screeningResponses,
        screeningQuestions
      );
      if (!screenRes.valid) newErrors.screeningResponses = screenRes.error;
    }

    if (step === 4) {
      if (!formData.consentGdpr) newErrors.consentGdpr = 'Este consentimiento es requerido.';
      if (!formData.attestedTruth) newErrors.attestedTruth = 'Este consentimiento es requerido.';

      const sigRes = validateSignature(formData.attestedSignature, formData.nombreCandidato);
      if (!sigRes.valid) newErrors.attestedSignature = sigRes.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('NombreCandidato', formData.nombreCandidato.trim());
    fd.append('Email', formData.email.trim().toLowerCase());
    if (formData.telefono) fd.append('Telefono', formData.telefono.trim());
    if (formData.ubicacion) fd.append('Ubicacion', formData.ubicacion);
    fd.append('VacanteId', job.id);
    if (formData.cvFile) fd.append('CvFile', formData.cvFile);

    fd.append('SkillsJson', JSON.stringify(formData.skills));
    fd.append('SoftSkillsJson', JSON.stringify(formData.softSkills));
    fd.append('ImpactStatement', formData.impactStatement.trim());
    fd.append(
      'ScreeningResponsesJson',
      JSON.stringify(formData.screeningResponses)
    );
    fd.append(
      'AvailabilityJson',
      JSON.stringify((formData.availability || []).filter((a) => a.isAvailable))
    );

    fd.append('ConsentGdpr', String(formData.consentGdpr));
    fd.append('ConsentMarketing', String(formData.consentMarketing));
    fd.append('AttestedTruth', String(formData.attestedTruth));
    fd.append('AttestedSignature', formData.attestedSignature.trim());
    fd.append('ApplicationSource', 'direct');
    fd.append(
      'CompletionTimeSeconds',
      String(Math.round((Date.now() - formData.startTime) / 1000))
    );
    return fd;
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setLoading(true);
    try {
      const fd = buildFormData();
      const result = await createPostulacionStructured(fd);
      onSuccess?.(result);
    } catch {
      setErrors({ submit: 'Error al enviar la solicitud. Intenta nuevamente.' });
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
      <div className="modal modal--apply-multistep">
        <button className="modal__close" aria-label="Cerrar" onClick={onClose}>
          &times;
        </button>

        <div className="modal__header" style={{ paddingRight: '44px' }}>
          <div>
            <h2 className="modal__title" style={{ fontSize: '1.2rem' }}>
              Aplicar: {job.title}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--clr-muted)', margin: '4px 0 0' }}>
              {job.location} · {job.type}
            </p>
          </div>
        </div>

        <ApplyFormProgress currentStep={currentStep} steps={STEPS} />

        <div className="modal__body" style={{ paddingTop: 0 }}>
          {currentStep === 1 && (
            <ApplyStep1BasicInfo
              formData={formData}
              onChange={handleFieldChange}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <ApplyStep2Skills
              formData={formData}
              onChange={handleFieldChange}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <ApplyStep3Screening
              formData={formData}
              onChange={handleFieldChange}
              vacante={job}
              errors={errors}
              onScreeningQuestionsLoaded={setScreeningQuestions}
            />
          )}
          {currentStep === 4 && (
            <ApplyStep4Review
              formData={formData}
              onChange={handleFieldChange}
              errors={errors}
            />
          )}
        </div>

        {errors.submit && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              margin: '0 0 12px',
            }}
          >
            {errors.submit}
          </div>
        )}

        <div className="modal__footer" style={{ justifyContent: 'flex-end' }}>
          {currentStep > 1 && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleBack}
              disabled={loading}
            >
              ← Atrás
            </button>
          )}
          {currentStep < STEPS.length && (
            <button
              type="button"
              className="btn btn--accent"
              onClick={handleNext}
              disabled={loading}
            >
              Siguiente →
            </button>
          )}
          {currentStep === STEPS.length && (
            <button
              type="button"
              className="btn btn--accent"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
