import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';
import '../styles/admin-theme.css';

const NAV_ITEMS = [
  { to: '/platform',           label: 'Dashboard',      icon: '◉', exact: true,     permission: null },
  { to: '/platform/companies', label: 'Empresas',        icon: '🏢',                 permission: 'companies:read' },
  { to: '/platform/users',     label: 'Usuarios',        icon: '👥',                 permission: 'users:read' },
  { to: '/platform/roles',     label: 'Roles',           icon: '🔑',                 permission: 'roles:read' },
  { to: '/platform/audit',     label: 'Auditoría',       icon: '📋',                 permission: 'audit:read' },
  { to: '/platform/config',    label: 'Configuración',   icon: '⚙️',                 permission: 'platform:configure' },
];

const OPS_ITEMS = [
  { to: '/platform/ops', label: 'Operaciones', icon: '🛠️', permission: null },
];

function NavItem({ to, label, icon, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
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
      onMouseEnter={e => {
        if (!e.currentTarget.classList.contains('active'))
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      }}
      onMouseLeave={e => {
        if (!e.currentTarget.style.background.includes('rgba(64, 224, 208') &&
            !e.currentTarget.style.background.includes('rgba(64,224,208'))
          e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{icon}</span>
      {label}
    </NavLink>
  );
}

function PermissionedNavItem({ item }) {
  const allowed = usePermission(item.permission ?? '');
  if (item.permission && !allowed) return null;
  return <NavItem {...item} />;
}

export default function PlatformLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-theme" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: '#0b1424',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
          zIndex: 100,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/images/logotalentifysv.png"
              alt="Logo"
              style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  color: 'white',
                  lineHeight: 1.2,
                }}
              >
                Talentify sv
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
                Platform Admin
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.35)',
              padding: '8px 14px 4px',
            }}
          >
            Plataforma
          </p>
          {NAV_ITEMS.map(item => (
            <PermissionedNavItem key={item.to} item={item} />
          ))}

          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.35)',
              padding: '16px 14px 4px',
            }}
          >
            Operaciones
          </p>
          {OPS_ITEMS.map(item => (
            <PermissionedNavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* User + Logout */}
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'white', margin: 0 }}>
              {user?.nombre} {user?.apellido}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '7px 12px',
              borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        style={{
          marginLeft: 240,
          flex: 1,
          minHeight: '100vh',
          background: 'var(--color-bg)',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
