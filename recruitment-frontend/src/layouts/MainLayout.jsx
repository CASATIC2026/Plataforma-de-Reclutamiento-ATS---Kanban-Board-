import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Playwrite IE font
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playwrite+IE:wght@400;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,248,255,0.92) 100%)',
        borderBottom: '1px solid rgba(205,123,79,0.15)',
        boxShadow: '0 2px 8px rgba(19,25,49,0.06)',
        backdropFilter: 'blur(12px)',
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'opacity 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <img
              src="/images/logotalentifysv.png"
              alt="Talentify sv Logo"
              style={{
                height: '40px',
                width: 'auto',
                borderRadius: '8px',
              }}
            />
            <span style={{
              color: '#131931',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              letterSpacing: '-0.01em',
              fontFamily: "'Playwrite IE', serif",
            }}>Talentify sv</span>
          </Link>

          <div className="flex gap-6 items-center">
            <Link
              to="/admin/vacantes"
              style={{
                color: '#131931',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s',
                padding: '6px 14px',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#CD7B4F';
                e.currentTarget.style.background = 'rgba(205,123,79,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#131931';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Vacantes
            </Link>

            <Link
              to="/admin/kanban"
              style={{
                background: 'linear-gradient(135deg, #131931 0%, #1F9DB9 100%)',
                color: 'white',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(19,25,49,0.2)',
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(205,123,79,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(19,25,49,0.2)';
              }}
            >
              Kanban
            </Link>

            {isAdmin && (
              <Link
                to="/admin/usuarios"
                style={{
                  color: '#131931',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  padding: '6px 14px',
                  borderRadius: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#CD7B4F';
                  e.currentTarget.style.background = 'rgba(205,123,79,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#131931';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Usuarios
              </Link>
            )}

            <div style={{
              borderLeft: '1.5px solid rgba(205,123,79,0.2)',
              paddingLeft: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{
                color: '#131931',
                fontSize: '0.9rem',
                fontWeight: '600',
                letterSpacing: '0.3px',
              }}>
                {user?.nombre}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  background: '#fff',
                  border: '1.5px solid #CD7B4F',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  color: '#CD7B4F',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(205,123,79,0.08)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(205,123,79,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fff';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
