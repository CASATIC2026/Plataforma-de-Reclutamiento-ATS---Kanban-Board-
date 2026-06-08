import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDisplayName, getInitials, getRoleLabel } from '../../utils/dashboardHelpers';

const NAV_LINKS = [
  { label: 'Bolsa de empleo', to: '/' },
  { label: 'Empresas', to: '/empresas' },
  { label: 'Precios', to: '/precios' },
  { label: 'Recursos', to: '/recursos' },
];

function profileSubtitle(user) {
  const carrera = user?.carrera?.trim();
  if (carrera) return carrera.toUpperCase();
  return getRoleLabel(user).toUpperCase();
}

export default function DashboardHeader({ searchQuery = '', onSearchChange }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && !searchQuery.trim()) {
      navigate('/');
    }
  };

  return (
    <header className="border-b border-outline-variant/10 bg-surface-container-low sticky top-0 z-40 overflow-hidden">
      <div className="max-w-full px-3 sm:px-4 md:px-8 py-4 flex items-center justify-between gap-3 sm:gap-4 min-w-0">
        <Link
          to="/dashboard"
          className="text-sm sm:text-lg md:text-xl font-bold text-on-surface shrink-0 font-display"
        >
          Talentify <span className="text-brand-turquoise">SV</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 flex-1 min-w-0">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-on-surface-variant hover:text-on-surface transition-colors text-sm whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-6 ml-auto shrink-0 min-w-0">
          <label className="relative hidden sm:block w-48 md:w-64 shrink min-w-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Buscar plazas"
              className="w-full rounded-lg bg-[#030E21] pt-[9px] pr-4 pb-2.5 pl-10 text-sm text-on-surface placeholder:text-on-surface-variant/50 border border-transparent focus:border-brand-turquoise/30 focus:outline-none transition-colors"
              aria-label="Buscar plazas"
            />
          </label>

          <button
            type="button"
            className="relative p-1 flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Notificaciones"
            title="Próximamente"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-on-surface" strokeWidth={1.5} />
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00C4B4] ring-2 ring-[#030E21]"
              aria-hidden="true"
            />
          </button>

          <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-outline-variant/15 shrink-0">
            <div className="hidden md:flex flex-col items-end gap-0.5 min-w-0">
              <p className="text-on-surface text-sm font-bold leading-tight whitespace-nowrap truncate max-w-[140px]">
                {getDisplayName(user)}
              </p>
              <p className="text-on-surface-variant text-[10px] font-medium leading-[15px] tracking-[0.05em] uppercase whitespace-nowrap truncate max-w-[140px]">
                {profileSubtitle(user)}
              </p>
            </div>
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-brand-turquoise/20 bg-brand-turquoise/20 flex items-center justify-center flex-shrink-0 overflow-hidden"
              title={getDisplayName(user)}
            >
              <span className="text-xs sm:text-sm font-bold text-brand-turquoise">
                {getInitials(user)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <label className="relative block sm:hidden px-3 sm:px-4 pb-3">
        <Search
          className="absolute left-6 sm:left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Buscar plazas"
          className="w-full rounded-lg bg-[#030E21] py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 border border-transparent focus:border-brand-turquoise/30 focus:outline-none"
          aria-label="Buscar plazas"
        />
      </label>
    </header>
  );
}
