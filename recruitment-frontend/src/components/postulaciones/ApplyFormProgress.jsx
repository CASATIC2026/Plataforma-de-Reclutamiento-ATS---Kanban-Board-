import React from 'react';

export default function ApplyFormProgress({ currentStep, steps }) {
  return (
    <div className="apply-step-indicator">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const cls = isActive ? ' is-active' : isDone ? ' is-done' : '';
        return (
          <React.Fragment key={stepNum}>
            <div className={`apply-step-indicator__step${cls}`}>
              <div className="apply-step-indicator__circle">
                {isDone ? '✓' : stepNum}
              </div>
              <span className="apply-step-indicator__label">{label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`apply-step-indicator__line${isDone ? ' is-done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
