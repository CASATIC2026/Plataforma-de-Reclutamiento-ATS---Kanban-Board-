const PROVIDERS = [
  { id: 'google', label: 'Google' },
  { id: 'linkedin', label: 'LinkedIn' },
];

export default function AuthOAuthRow() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {PROVIDERS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          disabled
          title="Próximamente"
          className="py-3 px-4 rounded-xl border border-outline-variant/15 bg-surface-container-high text-slate-200 text-sm font-semibold transition-all opacity-70 cursor-not-allowed"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
