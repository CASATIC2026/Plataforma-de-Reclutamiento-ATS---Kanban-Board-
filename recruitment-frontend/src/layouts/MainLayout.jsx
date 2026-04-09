import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow" style={{ borderBottom: '2px solid #CD7B4F' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/images/logotalentifysv.png"
              alt="Talentify SV Logo"
              style={{ height: '40px', width: 'auto' }}
            />
            <span style={{ color: '#131931', fontSize: '1.1rem', fontWeight: 'bold' }}>Talentify SV</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              to="/"
              style={{ color: '#464646', transition: 'color 0.3s' }}
              onMouseEnter={(e) => (e.target.style.color = '#131931')}
              onMouseLeave={(e) => (e.target.style.color = '#464646')}
            >
              Vacantes
            </Link>
            <Link
              to="/admin/vacantes"
              style={{ color: '#464646', transition: 'color 0.3s' }}
              onMouseEnter={(e) => (e.target.style.color = '#131931')}
              onMouseLeave={(e) => (e.target.style.color = '#464646')}
            >
              Admin Vacantes
            </Link>
<Link
              to="/admin/kanban"
              style={{
                background: '#CD7B4F',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.background = '#b5673d')}
              onMouseLeave={(e) => (e.target.style.background = '#CD7B4F')}
            >
              Kanban
            </Link>
            <span style={{ color: '#8a8fa3', fontSize: '0.8rem', borderLeft: '1px solid #ddd', paddingLeft: '16px' }}>
              {user?.nombre}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                color: '#666',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = '#dc2626'; e.target.style.color = '#dc2626'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.color = '#666'; }}
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
