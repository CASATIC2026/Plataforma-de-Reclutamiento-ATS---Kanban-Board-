import { useState, useEffect, useRef } from 'react';
import { FileText, X } from 'lucide-react';
import { getScreeningQuestions } from '../../api/screeningApi';
import {
  applySectionTitle,
  applyInput,
  applyTextarea,
  applyLabel,
  applyError,
  applyHint,
  applyAvailabilityOn,
  applyAvailabilityOff,
} from './applyFormStyles';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const SLOTS = ['Mañana', 'Tarde', 'Noche'];

export default function ApplyStep3Screening({
  formData,
  onChange,
  vacante,
  errors,
  onScreeningQuestionsLoaded,
}) {
  const [dragging, setDragging] = useState(false);
  const [questions, setQuestions] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!vacante?.id) return;
    getScreeningQuestions(vacante.id)
      .then((res) => {
        const qs = res.data || [];
        setQuestions(qs);
        onScreeningQuestionsLoaded?.(qs);
      })
      .catch(() => {
        setQuestions([]);
        onScreeningQuestionsLoaded?.([]);
      });
  }, [vacante?.id]);

  const handleFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    onChange('cvFile', file);
  };

  const handleResponse = (questionId, responseText) => {
    const prev = formData.screeningResponses || [];
    const exists = prev.find((r) => r.questionId === questionId);
    if (exists) {
      onChange(
        'screeningResponses',
        prev.map((r) => (r.questionId === questionId ? { ...r, responseText } : r))
      );
    } else {
      onChange('screeningResponses', [...prev, { questionId, responseText }]);
    }
  };

  const getResponse = (questionId) =>
    (formData.screeningResponses || []).find((r) => r.questionId === questionId)?.responseText ||
    '';

  const toggleAvailability = (day, slot) => {
    const prev = formData.availability || [];
    const exists = prev.find((a) => a.dayOfWeek === day && a.timeSlot === slot);
    if (exists) {
      onChange(
        'availability',
        prev.map((a) =>
          a.dayOfWeek === day && a.timeSlot === slot
            ? { ...a, isAvailable: !a.isAvailable }
            : a
        )
      );
    } else {
      onChange('availability', [...prev, { dayOfWeek: day, timeSlot: slot, isAvailable: true }]);
    }
  };

  const isAvailable = (day, slot) =>
    (formData.availability || []).some(
      (a) => a.dayOfWeek === day && a.timeSlot === slot && a.isAvailable
    );

  return (
    <div className="space-y-8">
      <div>
        <h3 className={applySectionTitle}>Currículum vitae</h3>

        {formData.cvFile ? (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-outline-variant/20 bg-surface-container">
            <FileText className="w-6 h-6 text-brand-turquoise flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-on-surface font-semibold truncate">{formData.cvFile.name}</p>
              <p className="text-xs text-on-surface-variant">
                {(formData.cvFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange('cvFile', null)}
              className="p-2 text-on-surface-variant hover:text-error"
              aria-label="Quitar archivo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
              dragging
                ? 'border-brand-turquoise bg-brand-turquoise/5'
                : 'border-brand-turquoise/30 hover:border-brand-turquoise/50'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
          >
            <FileText className="w-6 h-6 text-brand-turquoise flex-shrink-0" />
            <div>
              <p className="text-sm text-on-surface font-semibold">Sube tu CV</p>
              <p className="text-xs text-on-surface-variant">PDF, DOC o DOCX (máx. 5 MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) handleFile(e.target.files[0]);
              }}
            />
          </label>
        )}
      </div>

      {questions.length > 0 && (
        <div className="space-y-6">
          <h3 className={applySectionTitle}>Preguntas de evaluación</h3>
          {questions.map((q) => (
            <div key={q.id}>
              <label className={applyLabel}>
                {q.questionText}
                {q.required && <span className="text-error"> *</span>}
              </label>

              {q.questionType === 'text' && (
                <textarea
                  className={applyTextarea}
                  rows={4}
                  value={getResponse(q.id)}
                  onChange={(e) => handleResponse(q.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                />
              )}

              {q.questionType === 'multiple_choice' && (
                <div className="flex flex-col gap-2">
                  {(q.options ? JSON.parse(q.options) : []).map((opt, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 cursor-pointer text-sm text-on-surface-variant"
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={getResponse(q.id) === opt}
                        onChange={() => handleResponse(q.id, opt)}
                        className="accent-brand-turquoise"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === 'boolean' && (
                <div className="flex gap-4">
                  {['Sí', 'No'].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer text-sm text-on-surface-variant"
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={getResponse(q.id) === opt}
                        onChange={() => handleResponse(q.id, opt)}
                        className="accent-brand-turquoise"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === 'scale_1_5' && (
                <div className="flex gap-2 items-center flex-wrap">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleResponse(q.id, String(n))}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                        getResponse(q.id) === String(n)
                          ? 'bg-brand-turquoise text-on-brand-turquoise'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="text-xs text-on-surface-variant">1 = Bajo · 5 = Alto</span>
                </div>
              )}
            </div>
          ))}
          {errors.screeningResponses && (
            <span className={applyError}>{errors.screeningResponses}</span>
          )}
        </div>
      )}

      <div>
        <h3 className={applySectionTitle}>
          Disponibilidad{' '}
          <span className="text-xs font-normal text-on-surface-variant">(opcional)</span>
        </h3>
        <p className={applyHint}>Selecciona tus horarios preferidos</p>
        {SLOTS.map((slot) => (
          <div key={slot} className="mb-4 p-4 rounded-lg bg-surface-container border border-outline-variant/10">
            <p className="text-xs font-bold text-brand-turquoise mb-3 uppercase tracking-widest">
              {slot}
            </p>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => (
                <button
                  key={`${day}-${slot}`}
                  type="button"
                  onClick={() => toggleAvailability(day, slot)}
                  className={isAvailable(day, slot) ? applyAvailabilityOn : applyAvailabilityOff}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
