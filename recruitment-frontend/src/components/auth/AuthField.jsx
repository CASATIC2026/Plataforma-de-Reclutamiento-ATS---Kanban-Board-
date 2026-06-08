import { useState } from 'react';

export default function AuthField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  hint,
  icon: Icon,
  rightSlot,
  autoComplete,
}) {
  const [focused, setFocused] = useState(false);
  const borderClass = error
    ? 'border-red-400/50 focus:border-red-400'
    : focused
      ? 'border-brand-turquoise'
      : 'border-outline-variant/15';

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 pointer-events-none" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} ${rightSlot ? 'pr-12' : 'pr-4'} py-3.5 md:py-[18px] rounded-lg border bg-[#030E21] text-slate-100 placeholder:text-on-surface-variant/40 text-base focus:outline-none transition-all ${borderClass}`}
        />
        {rightSlot}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {!error && hint && <p className="text-xs text-brand-turquoise/80">{hint}</p>}
    </div>
  );
}

export function AuthSelect({ label, name, value, onChange, options, icon: Icon }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 pointer-events-none z-10" />
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-10 py-3.5 md:py-[18px] rounded-lg border bg-[#030E21] text-slate-100 text-base focus:outline-none transition-all appearance-none cursor-pointer ${
            focused ? 'border-brand-turquoise' : 'border-outline-variant/15'
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#101C2F]">
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
