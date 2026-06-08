export default function AuthDivider({ label }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="h-px bg-outline-variant/20 flex-1" />
      <span className="text-on-surface-variant/80 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-center shrink-0">
        {label}
      </span>
      <div className="h-px bg-outline-variant/20 flex-1" />
    </div>
  );
}
