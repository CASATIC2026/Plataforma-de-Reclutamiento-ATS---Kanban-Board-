import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';
import '../styles/admin-theme.css';

const NAV_ITEMS = [
  { to: '/platform',           label: 'Dashboard',    icon: '◉', exact: true, permission: null },
  { to: '/platform/companies', label: 'Empresas',     icon: '🏢',             permission: 'companies:read' },
  { to: '/platform/users',     label: 'Usuarios',     icon: '👥',             permission: 'users:read' },
  { to: '/platform/roles',     label: 'Roles',        icon: '🔑',             permission: 'roles:read' },
  { to: '/platform/audit',     label: 'Auditoría',    icon: '📋',             permission: 'audit:read' },
  { to: '/platform/config',    label: 'Config',       icon: '⚙️',             permission: 'platform:configure' },
];

const OPS_ITEMS = [
  { to: '/platform/ops', label: 'Operaciones', icon: '🛠️', permission: null },
];

function NavItem({ to, label, icon, exact, onClick }) {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 14px',
        borderRadius: 8,
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: isActive ? 600 : 400,
        fontFamily: 'var(--font-body)',
        color: isActive ? 'var(--color-accent)' : 'rgba(215,227,253,0.75)',
        background: isActive ? 'rgba(64,224,208,0.15)' : 'transparent',
        transition: 'all 0.18s ease',
      })}
    >
      <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </NavLink>
  );
}

function PermissionedNavItem({ item, onClick }) {
  const allowed = usePermission(item.permission ?? '');
  if (item.permission && !allowed) return null;
  return <NavItem {...item} onClick={onClick} />;
}

export default function PlatformLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const close = () => setOpen(false);

  return (
    <div className="admin-theme" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <style>{`
        /* ── Sidebar responsive ── */
        .pl-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: #0b1424;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 200;
          transition: transform 0.22s ease;
        }
        .pl-main {
          margin-left: 220px;
          flex: 1;
          min-height: 100vh;
          background: var(--color-bg);
          overflow-x: hidden;
        }
        .pl-topbar { display: none; }
        .pl-backdrop { display: none; }

        @media (max-width: 768px) {
          .pl-sidebar {
            transform: translateX(-100%);
          }
          .pl-sidebar.open {
            transform: translateX(0);
          }
          .pl-main {
            margin-left: 0;
            padding-top: 52px;
          }
          .pl-topbar {
            display: flex;
            align-items: center;
            gap: 10px;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 52px;
            background: #0b1424;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 0 14px;
            z-index: 190;
          }
          .pl-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.55);
            z-index: 199;
          }
        }

        @media (max-width: 400px) {
          .pl-sidebar { width: min(200px, 85vw); }
        }
      `}</style>

      {/* Mobile top bar */}
      <div className="pl-topbar">
        <button
          onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: 4 }}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'white' }}>
          Talentify Platform
        </span>
      </div>

      {/* Backdrop */}
      {open && <div className="pl-backdrop" onClick={close} />}

      {/* Sidebar */}
      <aside className={`pl-sidebar${open ? ' open' : ''}`}>
        {/* Brand */}
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/images/logotalentifysv.png"
            alt="Logo"
            style={{ width: 30, height: 30, objectFit: 'contain', borderRadius: 6, flexShrink: 0 }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Talentify sv
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Platform Admin</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', padding: '8px 14px 4px', margin: 0 }}>
            Plataforma
          </p>
          {NAV_ITEMS.map(item => (
            <PermissionedNavItem key={item.to} item={item} onClick={close} />
          ))}

          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', padding: '14px 14px 4px', margin: 0 }}>
            Operaciones
          </p>
          {OPS_ITEMS.map(item => (
            <PermissionedNavItem key={item.to} item={item} onClick={close} />
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'white', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.nombre} {user?.apellido}
          </p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </p>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', fontSize: 12, cursor: 'pointer', textAlign: 'left' }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="pl-main">
        <Outlet />
      </main>
    </div>
  );
}
