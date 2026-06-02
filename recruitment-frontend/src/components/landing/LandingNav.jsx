import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Empresas', href: '/empresas' },
  { label: 'Recursos', href: '/recursos' },
];

function MobileSheet({ open, onClose, currentPath }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-0 right-0 z-50 h-full w-[min(100%_-_2rem,18rem)] bg-[#071326] border-l border-outline-variant/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-outline-variant/10 flex-shrink-0">
          <span className="text-base sm:text-lg font-extrabold tracking-tighter text-slate-100 font-display truncate">
            Talentify SV
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col px-4 sm:px-6 py-6 sm:py-8 gap-1 flex-shrink-0">
          {NAV_LINKS.map(({ label, href }) => {
            const active = currentPath === href;
            return (
              <Link
                key={label}
                to={href}
                onClick={onClose}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all font-display tracking-tight truncate ${
                  active
                    ? 'text-brand-turquoise bg-brand-turquoise/10'
                    : 'text-slate-300 hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-2 sm:gap-3 px-4 sm:px-6 pb-6 sm:pb-10 flex-shrink-0">
          <Link
            to="/login"
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-xl border border-outline-variant/20 text-on-surface-variant font-semibold text-xs sm:text-sm hover:border-brand-turquoise hover:text-brand-turquoise transition-all text-center"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/login?mode=register"
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-brand-turquoise text-on-brand-turquoise font-bold text-xs sm:text-sm shadow-lg shadow-brand-turquoise/20 hover:opacity-90 active:scale-95 transition-all text-center"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </>
  );
}

export default function LandingNav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout, isAdminOrManager } = useAuth();

  return (
    <>
      <header className="bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 w-full h-16 md:h-20 shadow-[0_12px_32px_rgba(3,14,33,0.5)]">
        <div className="flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto h-full">
          <Link to="/" className="text-lg md:text-xl font-extrabold tracking-tighter text-slate-100 font-display">
            Talentify SV
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className={`font-display tracking-tight transition-all duration-300 hover:scale-105 ${
                  pathname === href
                    ? 'text-brand-turquoise font-bold border-b-2 border-brand-turquoise pb-1'
                    : 'text-slate-300 font-medium hover:text-brand-turquoise'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden md:inline text-sm text-on-surface-variant truncate max-w-[140px]">
                  {user?.nombre}
                </span>
                {isAdminOrManager && (
                  <Link
                    to="/admin/vacantes"
                    className="hidden md:block text-sm text-brand-turquoise font-semibold hover:underline"
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="hidden md:block text-slate-300 text-sm font-medium hover:text-brand-turquoise px-3 py-2"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block text-slate-300 font-medium font-display tracking-tight px-4 py-2 hover:text-brand-turquoise transition-all"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/login?mode=register"
                  className="hidden md:block bg-brand-turquoise text-on-brand-turquoise font-bold px-6 py-2.5 rounded-xl font-display tracking-tight hover:scale-105 transition-all shadow-lg shadow-brand-turquoise/20"
                >
                  Registrarse
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label="Abrir menú"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} currentPath={pathname} />
    </>
  );
}
