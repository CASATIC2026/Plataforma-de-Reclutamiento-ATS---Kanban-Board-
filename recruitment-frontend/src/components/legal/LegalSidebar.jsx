export default function LegalSidebar({
  nav,
  activeId,
  onNavigate,
  ariaLabel = 'Secciones del documento',
  variant = 'privacy',
}) {
  const activeStyles =
    variant === 'terms'
      ? 'border-[#056C70] bg-[rgba(5,108,112,0.08)] text-[#6AD9C0]'
      : 'border-[#FFB4A3] bg-[rgba(217,120,98,0.05)] text-[#FFB4A3]';

  return (
    <nav aria-label={ariaLabel} className="hidden lg:block sticky top-28 self-start w-[280px] shrink-0">
      <p className="text-[#A38C87] text-xs font-bold tracking-[0.1em] uppercase mb-4 pl-6">Contenido</p>
      <ul className="flex flex-col gap-1 border-l border-[rgba(85,67,62,0.15)]">
        {nav.map(({ id, label }) => {
          const active = activeId === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                className={`w-full text-left py-2 pl-4 text-base font-medium leading-6 transition-colors border-l-2 -ml-px ${
                  active ? activeStyles : 'border-transparent text-[#DBC1BB] hover:text-[#D7E3FD]'
                }`}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
