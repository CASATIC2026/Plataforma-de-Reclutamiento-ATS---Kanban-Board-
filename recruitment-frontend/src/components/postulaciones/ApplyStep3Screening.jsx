import { useState, useEffect, useRef } from 'react';
import { getScreeningQuestions } from '../../api/screeningApi';

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
    (formData.screeningResponses || []).find((r) => r.questionId === questionId)
      ?.responseText || '';

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
    <div>
      {/* CV Upload */}
      <p className="apply-section-title">Currículum Vitae</p>

      {formData.cvFile ? (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', border: '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-sm)', marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '1.6rem' }}>📄</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{formData.cvFile.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--clr-muted)' }}>
              {(formData.cvFile.size / (1024 * 1024)).toFixed(2)} MB
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('cvFile', null)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--clr-muted)', fontSize: '20px',
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className={`dropzone${dragging ? ' drag-over' : ''}`}
          style={{ marginBottom: '24px' }}
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          <div className="dropzone__icon">📄</div>
          <p className="dropzone__text">
            Arrastra tu CV aquí o{' '}
            <span className="dropzone__link">selecciona un archivo</span>
          </p>
          <p className="dropzone__hint">PDF, DOC, DOCX — máx. 5MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
          />
        </div>
      )}

      {/* Screening Questions */}
      {questions.length > 0 && (
        <>
          <p className="apply-section-title">Preguntas de Evaluación</p>
          {questions.map((q) => (
            <div key={q.id} className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">
                {q.questionText}
                {q.required && (
                  <span style={{ color: 'var(--color-danger)' }}> *</span>
                )}
              </label>

              {q.questionType === 'text' && (
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={getResponse(q.id)}
                  onChange={(e) => handleResponse(q.id, e.target.value)}
                  placeholder="Tu respuesta..."
                />
              )}

              {q.questionType === 'multiple_choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(q.options ? JSON.parse(q.options) : []).map((opt, i) => (
                    <label
                      key={i}
                      style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={getResponse(q.id) === opt}
                        onChange={() => handleResponse(q.id, opt)}
                        style={{ accentColor: 'var(--clr-accent)' }}
                      />
                      <span style={{ fontSize: '14px' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === 'boolean' && (
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['Sí', 'No'].map((opt) => (
                    <label
                      key={opt}
                      style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={getResponse(q.id) === opt}
                        onChange={() => handleResponse(q.id, opt)}
                        style={{ accentColor: 'var(--clr-accent)' }}
                      />
                      <span style={{ fontSize: '14px' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === 'scale_1_5' && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`scale-dot${getResponse(q.id) === String(n) ? ' is-selected' : ''}`}
                      onClick={() => handleResponse(q.id, String(n))}
                    >
                      {n}
                    </button>
                  ))}
                  <span style={{ fontSize: '12px', color: 'var(--clr-muted)', marginLeft: '4px' }}>
                    1 = Bajo · 5 = Alto
                  </span>
                </div>
              )}
            </div>
          ))}
          {errors.screeningResponses && (
            <span className="form-error">{errors.screeningResponses}</span>
          )}
        </>
      )}

      {/* Availability */}
      <p className="apply-section-title" style={{ marginTop: '8px' }}>
        Disponibilidad{' '}
        <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--clr-muted)' }}>
          (opcional)
        </span>
      </p>

      {SLOTS.map((slot) => (
        <div key={slot} style={{ marginBottom: '12px' }}>
          <p
            style={{
              fontSize: '12px', fontWeight: 600, color: 'var(--clr-muted)',
              marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            {slot}
          </p>
          <div className="availability-grid">
            {DAYS.map((day) => (
              <button
                key={`${day}-${slot}`}
                type="button"
                className={`availability-cell${isAvailable(day, slot) ? ' is-checked' : ''}`}
                onClick={() => toggleAvailability(day, slot)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
