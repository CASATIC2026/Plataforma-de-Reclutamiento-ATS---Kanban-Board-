export default function ApplyFormProgress({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-between gap-1 mb-6 px-1">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <div key={label} className="flex items-center flex-1 min-w-0 last:flex-none">
            <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  isActive
                    ? 'bg-brand-turquoise border-brand-turquoise text-on-brand-turquoise'
                    : isDone
                      ? 'bg-brand-turquoise/20 border-brand-turquoise text-brand-turquoise'
                      : 'bg-surface-container-high border-outline-variant/20 text-on-surface-variant'
                }`}
              >
                {isDone ? '✓' : stepNum}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide truncate max-w-full hidden sm:block ${
                  isActive ? 'text-brand-turquoise' : 'text-on-surface-variant'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 min-w-[8px] rounded ${
                  isDone ? 'bg-brand-turquoise' : 'bg-outline-variant/30'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
