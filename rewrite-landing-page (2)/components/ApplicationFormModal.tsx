"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, FileText, Edit2, Check } from "lucide-react";

interface ApplicationFormModalProps {
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationFormModal({
  jobTitle,
  isOpen,
  onClose,
}: ApplicationFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: "",
    email: "",
    phone: "",
    location: "",
    // Step 2: Skills
    skills: [] as Array<{ skill: string; level: string; years: number }>,
    softSkills: [] as string[],
    impactStatement: "",
    // Step 3: Evaluation & Availability
    cvFile: null as File | null,
    answers: {} as Record<string, string>,
    selectedDays: {
      MAÑANA: [] as string[],
      TARDE: [] as string[],
      NOCHE: [] as string[],
    },
    availability: "Remoto",
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalSteps = 4;
  const stepTitles = ["INFORMACIÓN", "HABILIDADES", "PREGUNTAS", "REVISIÓN"];
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const daysFull = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  const handleNextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const toggleDaySelection = (period: string, day: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: {
        ...prev.selectedDays,
        [period]: prev.selectedDays[period as keyof typeof prev.selectedDays].includes(day)
          ? prev.selectedDays[period as keyof typeof prev.selectedDays].filter((d) => d !== day)
          : [...prev.selectedDays[period as keyof typeof prev.selectedDays], day],
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#0F1B28] rounded-2xl border border-outline-variant/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-outline-variant/10 p-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-1">
              Postulación: {jobTitle}
            </h1>
            <p className="text-sm text-on-surface-variant">
              Paso {currentStep} de {totalSteps}: {stepTitles[currentStep - 1]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator with connecting lines */}
        <div className="px-6 pt-6 pb-8 border-b border-outline-variant/10">
          <div className="flex items-center justify-between gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const step = idx + 1;
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;

              return (
                <div key={step} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`w-12 h-12 rounded-full font-bold text-base transition-all flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? "bg-brand-turquoise text-white shadow-lg shadow-brand-turquoise/20"
                        : isCompleted
                        ? "bg-brand-turquoise/40 text-brand-turquoise"
                        : "bg-surface-container text-on-surface-variant border-2 border-on-surface-variant/20"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : step}
                  </button>
                  {idx < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        isCompleted
                          ? "bg-brand-turquoise/40"
                          : "bg-on-surface-variant/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {currentStep === 1 && <Step1Form formData={formData} setFormData={setFormData} />}
          {currentStep === 2 && <Step2Form formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && (
            <Step3Form
              formData={formData}
              setFormData={setFormData}
              daysFull={daysFull}
              toggleDaySelection={toggleDaySelection}
            />
          )}
          {currentStep === 4 && (
            <Step4Review
              formData={formData}
              jobTitle={jobTitle}
              onEditSection={setEditingSection}
              editingSection={editingSection}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-outline-variant/10 p-6 bg-[#142033] flex items-center justify-between gap-4">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 text-on-surface-variant font-semibold hover:text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Atrás
          </button>
          <button
            onClick={() => {
              if (currentStep === totalSteps) {
                alert("Solicitud enviada exitosamente");
                onClose();
              } else {
                handleNextStep();
              }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-semibold hover:scale-105 active:scale-95 transition-all"
          >
            {currentStep === totalSteps ? "Enviar Solicitud" : "Siguiente"}
            {currentStep !== totalSteps && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 1: Personal Information
function Step1Form({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-100">Información Personal</h2>
      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Nombre Completo"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-slate-100 placeholder-on-surface-variant focus:border-brand-turquoise focus:outline-none transition-colors"
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-slate-100 placeholder-on-surface-variant focus:border-brand-turquoise focus:outline-none transition-colors"
        />
        <input
          type="tel"
          placeholder="+503 0000 0000"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-slate-100 placeholder-on-surface-variant focus:border-brand-turquoise focus:outline-none transition-colors"
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-slate-100 placeholder-on-surface-variant focus:border-brand-turquoise focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
}

// Step 2: Skills & Experience
function Step2Form({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  const softSkillOptions = [
    "Comunicación",
    "Liderazgo",
    "Trabajo en equipo",
    "Resolución de problemas",
    "Adaptabilidad",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-4">
          Habilidades Técnicas
        </h2>
        <div className="space-y-3">
          {formData.skills.map((skill: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-surface-container border border-outline-variant/10 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-on-surface-variant uppercase tracking-widest">
                  SKILL
                </p>
                <p className="text-base font-bold text-slate-100">{skill.skill}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-on-surface-variant uppercase tracking-widest">
                  NIVEL
                </p>
                <p className="text-base font-bold text-slate-100">{skill.level}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-on-surface-variant uppercase tracking-widest">
                  AÑOS
                </p>
                <p className="text-base font-bold text-slate-100">{skill.years}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 text-brand-turquoise font-semibold hover:text-brand-turquoise/80 transition-colors">
          + Agregar habilidad
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-4">
          Habilidades Blandas
        </h2>
        <p className="text-sm text-on-surface-variant mb-4">
          (Selecciona hasta un máximo de 5)
        </p>
        <div className="flex flex-wrap gap-3">
          {softSkillOptions.map((skill) => (
            <button
              key={skill}
              onClick={() => {
                if (formData.softSkills.includes(skill)) {
                  setFormData({
                    ...formData,
                    softSkills: formData.softSkills.filter((s: string) => s !== skill),
                  });
                } else {
                  setFormData({
                    ...formData,
                    softSkills: [...formData.softSkills, skill],
                  });
                }
              }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                formData.softSkills.includes(skill)
                  ? "bg-orange-600/60 text-white"
                  : "bg-surface-container text-on-surface-variant border border-outline-variant/10 hover:border-brand-turquoise/30"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-2">
          Declaración de Impacto
        </h2>
        <p className="text-xs text-on-surface-variant mb-4">
          * Tu declaración de impacto es lo primero que verán los reclutadores.
          Destaca métricas y resultados concretos.
        </p>
        <textarea
          placeholder="Cuéntanos sobre tus logros más significativos..."
          value={formData.impactStatement}
          onChange={(e) =>
            setFormData({ ...formData, impactStatement: e.target.value })
          }
          maxLength={500}
          className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-slate-100 placeholder-on-surface-variant focus:border-brand-turquoise focus:outline-none transition-colors resize-none"
          rows={6}
        />
        <div className="text-right text-xs text-on-surface-variant mt-2">
          {formData.impactStatement.length} / 500
        </div>
      </div>
    </div>
  );
}

// Step 3: Evaluation Questions & Availability
function Step3Form({
  formData,
  setFormData,
  daysFull,
  toggleDaySelection,
}: {
  formData: any;
  setFormData: (data: any) => void;
  daysFull: string[];
  toggleDaySelection: (period: string, day: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-4">Currículum Vitae</h2>
        <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-brand-turquoise/30 cursor-pointer hover:border-brand-turquoise/50 transition-colors">
          <FileText className="w-6 h-6 text-brand-turquoise flex-shrink-0" />
          <div>
            {formData.cvFile ? (
              <p className="text-sm text-slate-100 font-semibold">
                {formData.cvFile.name}
              </p>
            ) : (
              <>
                <p className="text-sm text-slate-100 font-semibold">Sube tu CV</p>
                <p className="text-xs text-on-surface-variant">
                  PDF, DOC o DOCX (máx. 5 MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFormData({ ...formData, cvFile: file });
            }}
            className="hidden"
          />
        </label>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-4">
          Preguntas de Evaluación
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-slate-100 font-semibold mb-2">
              ¿Cuántos años de experiencia tienes con React?
            </label>
            <textarea
              placeholder="Escribe tu respuesta aquí..."
              value={formData.answers.react || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  answers: { ...formData.answers, react: e.target.value },
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-slate-100 placeholder-on-surface-variant focus:border-brand-turquoise focus:outline-none transition-colors resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-slate-100 font-semibold mb-2">
              ¿Estás disponible para modalidad remota?
            </label>
            <div className="flex gap-4">
              {["Remoto", "Híbrido", "Presencial"].map((mode) => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    value={mode}
                    checked={formData.availability === mode}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                    className="w-4 h-4 accent-brand-turquoise"
                  />
                  <span className="text-slate-300">{mode}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-2">
          Disponibilidad (Opcional)
        </h2>
        <p className="text-xs text-on-surface-variant mb-4">
          Selecciona tus horarios preferidos de lunes a viernes
        </p>
        <div className="space-y-4">
          {["MAÑANA", "TARDE", "NOCHE"].map((period) => (
            <div key={period} className="p-4 rounded-lg bg-surface-container border border-outline-variant/10">
              <p className="text-xs font-bold text-brand-turquoise mb-3 uppercase tracking-widest">
                {period}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {daysFull.slice(0, 5).map((day, idx) => (
                  <button
                    key={day}
                    onClick={() => toggleDaySelection(period, day)}
                    className={`aspect-square rounded font-bold text-xs transition-all ${
                      formData.selectedDays[period as keyof typeof formData.selectedDays]?.includes(day)
                        ? "bg-brand-turquoise text-on-brand-turquoise"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 4: Review
function Step4Review({
  formData,
  jobTitle,
  onEditSection,
  editingSection,
}: {
  formData: any;
  jobTitle: string;
  onEditSection: (section: string | null) => void;
  editingSection: string | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Revisa tu solicitud</h1>
        <p className="text-on-surface-variant">
          Confirma que todos los detalles sean correctos antes del envío final.
        </p>
      </div>

      {/* Datos Personales */}
      <div className="rounded-lg bg-surface-container border border-outline-variant/10 overflow-hidden">
        <div className="p-4 bg-surface-container-high flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold text-slate-100">
            <span className="text-brand-turquoise">👤</span>
            Datos Personales
          </h3>
          <button
            onClick={() => onEditSection("personal")}
            className="flex items-center gap-2 text-brand-turquoise font-semibold hover:text-brand-turquoise/80 transition-colors text-sm"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
              Nombre Completo
            </p>
            <p className="text-slate-100 font-semibold">{formData.fullName || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
              Email
            </p>
            <p className="text-slate-100 font-semibold">{formData.email || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
              Teléfono
            </p>
            <p className="text-slate-100 font-semibold">{formData.phone || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
              Currículum Vitae
            </p>
            <p className="text-slate-100 font-semibold text-green-400">
              {formData.cvFile ? "✓ " + formData.cvFile.name : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Habilidades y Perfil */}
      <div className="rounded-lg bg-surface-container border border-outline-variant/10 overflow-hidden">
        <div className="p-4 bg-surface-container-high flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold text-slate-100">
            <span>📍</span>
            Habilidades y Perfil
          </h3>
          <button
            onClick={() => onEditSection("skills")}
            className="flex items-center gap-2 text-brand-turquoise font-semibold hover:text-brand-turquoise/80 transition-colors text-sm"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">
              Puesto Solicitado
            </p>
            <p className="text-slate-100 font-semibold">{jobTitle}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">
              Habilidades Técnicas
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.skills.length > 0 ? (
                formData.skills.map((skill: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-orange-600/40 text-orange-300 text-sm"
                  >
                    {skill.skill}
                  </span>
                ))
              ) : (
                <span className="text-on-surface-variant">-</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">
              Habilidades Blandas
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.softSkills.length > 0 ? (
                formData.softSkills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-on-surface-variant">-</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="rounded-lg bg-surface-container border border-outline-variant/10 overflow-hidden">
        <div className="p-4 bg-surface-container-high flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold text-slate-100">
            <span>📅</span>
            Disponibilidad
          </h3>
          <button
            onClick={() => onEditSection("availability")}
            className="flex items-center gap-2 text-brand-turquoise font-semibold hover:text-brand-turquoise/80 transition-colors text-sm"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
              Fecha de Inicio
            </p>
            <p className="text-slate-100 font-semibold">Inmediata</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
              Modalidad
            </p>
            <p className="text-slate-100 font-semibold">
              {formData.availability === "Remoto"
                ? "🟢 Remoto / Híbrido"
                : formData.availability}
            </p>
          </div>
          {Object.entries(formData.selectedDays).some(([_, days]: any) => days.length > 0) && (
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">
                Horarios Disponibles
              </p>
              <div className="space-y-1">
                {Object.entries(formData.selectedDays).map(([period, days]: [string, any]) =>
                  days.length > 0 ? (
                    <p key={period} className="text-slate-100 text-sm">
                      {period}: {days.join(", ")}
                    </p>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="p-4 rounded-lg bg-brand-turquoise/10 border border-brand-turquoise/20">
        <p className="text-sm text-slate-100">
          Al hacer clic en Enviar Solicitud, confirmas que toda la información proporcionada es verídica y aceptas nuestros términos de servicio.
        </p>
      </div>
    </div>
  );
}
