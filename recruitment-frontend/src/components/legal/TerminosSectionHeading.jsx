export default function TerminosSectionHeading({ number, title, compact }) {
  if (compact) {
    return (
      <h2 className="font-display text-lg font-bold text-[#D7E3FD] leading-9">{title}</h2>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-[#056C70] text-sm font-bold opacity-50 font-mono">
        {String(number).padStart(2, '0')}.
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-[#D7E3FD] leading-9">{title}</h2>
    </div>
  );
}
