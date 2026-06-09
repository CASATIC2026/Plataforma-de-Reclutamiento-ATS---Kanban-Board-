import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';
import { getReviewStats } from '../api/reviewApi';
import CompanySwitcher from '../components/common/CompanySwitcher';
import '../styles/admin-theme.css';

export default function MainLayout() {
  const { user, logout, isAdmin, isPlatformTier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const canViewAnalytics = usePermission('reports:read');
  const canAccessPlatform = isPlatformTier;
  const canReview = usePermission('applications:review');
  const [pendingReviewCount, setPendingReviewCount] = useState(0);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!canReview) return;
    const load = async () => {
      try {
        const stats = await getReviewStats();
        setPendingReviewCount(stats.pendingCount ?? 0);
      } catch {}
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [canReview]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass =
    'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap';

  const mobileNavLinkClass =
    'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium px-3 py-3 rounded-lg block w-full text-left';

  const kanbanLinkClass =
    'bg-brand-turquoise text-on-brand-turquoise px-4 py-2 rounded-lg font-bold text-sm hover:scale-[1.03] transition-transform shadow-[0_4px_14px_rgba(64,224,208,0.25)]';

  const kanbanMobileClass = `${kanbanLinkClass} block w-full text-center my-1`;

  const navItems = (
    <>
      <Link to="/admin/dashboard" className={navLinkClass}>
        Dashboard
      </Link>
      <Link to="/admin/vacantes" className={navLinkClass}>
        Vacantes
      </Link>
      {canReview && (
        <Link to="/admin/review" className={`${navLinkClass} flex items-center gap-2`}>
          Review
          {pendingReviewCount > 0 && (
            <span className="bg-error text-[#3a0a06] rounded-full text-[0.7rem] font-bold px-1.5 leading-[1.4]">
              {pendingReviewCount}
            </span>
          )}
        </Link>
      )}
      <Link to="/admin/kanban" className={`${kanbanLinkClass} mx-1`}>
        Kanban
      </Link>
      {canViewAnalytics && (
        <Link to="/admin/analytics" className={navLinkClass}>
          Analíticas
        </Link>
      )}
      {canAccessPlatform && (
        <Link to="/platform" className={navLinkClass}>
          Platform
        </Link>
      )}
    </>
  );

  const mobileNavItems = (
    <>
      <Link to="/admin/dashboard" className={mobileNavLinkClass}>
        Dashboard
      </Link>
      <Link to="/admin/vacantes" className={mobileNavLinkClass}>
        Vacantes
      </Link>
      {canReview && (
        <Link to="/admin/review" className={`${mobileNavLinkClass} flex items-center gap-2`}>
          Review
          {pendingReviewCount > 0 && (
            <span className="bg-error text-[#3a0a06] rounded-full text-[0.7rem] font-bold px-1.5 leading-[1.4]">
              {pendingReviewCount}
            </span>
          )}
        </Link>
      )}
      <Link to="/admin/kanban" className={kanbanMobileClass}>
        Kanban
      </Link>
      {canViewAnalytics && (
        <Link to="/admin/analytics" className={mobileNavLinkClass}>
          Analíticas
        </Link>
      )}
      {canAccessPlatform && (
        <Link to="/platform" className={mobileNavLinkClass}>
          Platform
        </Link>
      )}
    </>
  );

  return (
    <div className="admin-theme min-h-screen bg-bg w-full max-w-[100vw] overflow-x-hidden">
      <nav className="sticky top-0 z-40 border-b border-outline-variant/10 bg-surface-container-low/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 hover:opacity-85 transition-opacity"
          >
            <img
              src="/images/logotalentifysv.png"
              alt="Talentify SV"
              className="h-9 w-auto rounded-lg shrink-0"
            />
            <span className="text-base sm:text-lg font-bold text-on-surface font-display truncate">
              Talentify <span className="text-brand-turquoise">SV</span>
            </span>
          </Link>

          <div className="hidden min-[1080px]:flex gap-1 items-center min-w-0 shrink">
            {navItems}
            <CompanySwitcher />
            <div className="flex items-center gap-3 pl-4 ml-2 border-l border-outline-variant/15 shrink-0">
              <span className="text-on-surface text-sm font-semibold tracking-wide max-w-[120px] truncate">
                {user?.nombre}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-transparent border border-brand-turquoise/50 rounded-lg px-4 py-2 text-sm text-brand-turquoise font-bold cursor-pointer transition-colors hover:bg-brand-turquoise/10 whitespace-nowrap"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <button
            type="button"
            className="min-[1080px]:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant/20 text-on-surface shrink-0"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className="text-lg leading-none" aria-hidden>
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>

        {menuOpen && (
          <div
            className="min-[1080px]:hidden border-t border-outline-variant/10 bg-surface-container-low px-4 py-4 flex flex-col gap-1"
          >
            {mobileNavItems}
            <div className="pt-2 mt-1 border-t border-outline-variant/10 flex flex-col gap-3">
              <CompanySwitcher />
              <div className="flex flex-col gap-2">
                <span className="text-on-surface text-sm font-semibold">{user?.nombre}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full bg-transparent border border-brand-turquoise/50 rounded-lg px-4 py-2.5 text-sm text-brand-turquoise font-bold cursor-pointer transition-colors hover:bg-brand-turquoise/10"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 w-full min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
