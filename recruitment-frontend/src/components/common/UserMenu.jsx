import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDisplayName, getInitials, getRoleLabel } from '../../utils/dashboardHelpers';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú de usuario"
        aria-expanded={open}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-brand-turquoise/20 bg-brand-turquoise/20 flex items-center justify-center flex-shrink-0 overflow-hidden hover:border-brand-turquoise/50 transition-colors"
        title={getDisplayName(user)}
      >
        <span className="text-xs sm:text-sm font-bold text-brand-turquoise">
          {getInitials(user)}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-outline-variant/15 bg-surface-container-high shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/10">
            <div className="w-9 h-9 rounded-full border-2 border-brand-turquoise/20 bg-brand-turquoise/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-brand-turquoise">{getInitials(user)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-on-surface text-sm font-bold leading-tight truncate">
                {getDisplayName(user)}
              </p>
              <p className="text-on-surface-variant text-[11px] font-medium leading-[15px] tracking-[0.05em] uppercase truncate">
                {getRoleLabel(user)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-surface-container-highest transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
