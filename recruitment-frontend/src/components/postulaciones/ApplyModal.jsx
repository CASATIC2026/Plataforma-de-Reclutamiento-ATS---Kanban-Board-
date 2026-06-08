import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const e = { ...prev };
        delete e[field];
        return e;
      });
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

    fd.append(
      'SkillsJson',
      JSON.stringify(
        formData.skills.map((s) => ({
          ...s,
          yearsExperience:
            s.yearsExperience !== '' && s.yearsExperience != null
              ? Number(s.yearsExperience)
              : null,
        }))
      )
    );
    fd.append('SoftSkillsJson', JSON.stringify(formData.softSkills));
    fd.append('ImpactStatement', formData.impactStatement.trim());
    fd.append('ScreeningResponsesJson', JSON.stringify(formData.screeningResponses));
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
      className="public-theme fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-[#0F1B28] rounded-2xl border border-outline-variant/10 flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-outline-variant/10 p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface font-display mb-1 line-clamp-2">
              Postulación: {job.title}
            </h2>
            <p className="text-sm text-on-surface-variant truncate">
              {job.company} · {job.location}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ApplyFormProgress currentStep={currentStep} steps={STEPS} />

        <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
          {currentStep === 1 && (
            <ApplyStep1BasicInfo formData={formData} onChange={handleFieldChange} errors={errors} />
          )}
          {currentStep === 2 && (
            <ApplyStep2Skills formData={formData} onChange={handleFieldChange} errors={errors} />
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
              jobTitle={job.title}
              onChange={handleFieldChange}
              errors={errors}
            />
          )}
        </div>

        {errors.submit && (
          <div className="mx-6 mb-2 px-4 py-3 rounded-xl bg-error-container/30 border border-error/30 text-error text-sm">
            {errors.submit}
          </div>
        )}

        <div className="border-t border-outline-variant/10 p-6 bg-[#142033] flex items-center justify-between gap-4 shrink-0">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 text-on-surface-variant font-semibold hover:text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Atrás
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
