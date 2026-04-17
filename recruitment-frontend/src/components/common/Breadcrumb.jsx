export default function Breadcrumb({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-[#464555] text-xs mb-4"
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-2">
            {item.onClick && !isLast ? (
              <button
                type="button"
                onClick={item.onClick}
                className="cursor-pointer hover:text-[#3525cd] transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast ? 'text-[#3525cd] font-medium' : ''}>
                {item.label}
              </span>
            )}
            {!isLast && <span aria-hidden="true">›</span>}
          </span>
        );
      })}
    </nav>
  );
}
