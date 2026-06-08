import { Check } from 'lucide-react';

const STEP_LABELS = ['INFORMACIÓN', 'HABILIDADES', 'PREGUNTAS', 'REVISIÓN'];

export default function ApplyFormProgress({ currentStep, steps }) {
  const total = steps.length;

  return (
    <div className="px-6 pt-6 pb-8 border-b border-outline-variant/10">
      <div className="flex items-center justify-between gap-1">
        {Array.from({ length: total }).map((_, idx) => {
          const step = idx + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={steps[idx] ?? step} className="flex items-center flex-1 min-w-0">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-sm transition-all flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? 'bg-brand-turquoise text-on-brand-turquoise shadow-lg shadow-brand-turquoise/20'
                    : isCompleted
                      ? 'bg-brand-turquoise/40 text-brand-turquoise'
                      : 'bg-surface-container text-on-surface-variant border-2 border-on-surface-variant/20'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step}
              </div>
              {idx < total - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full transition-all ${
                    isCompleted ? 'bg-brand-turquoise/40' : 'bg-on-surface-variant/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-on-surface-variant uppercase tracking-widest text-center sm:text-left">
        Paso {currentStep} de {total}: {STEP_LABELS[currentStep - 1] ?? steps[currentStep - 1]}
      </p>
    </div>
  );
}
