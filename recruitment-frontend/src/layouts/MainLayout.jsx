import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow" style={{ borderBottom: '2px solid #CD7B4F' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" style={{ color: '#131931', fontSize: '1.25rem', fontWeight: 'bold' }}>
            TalentBridge
          </Link>
          <div className="flex gap-4">
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
              to="/admin/postulaciones"
              style={{ color: '#464646', transition: 'color 0.3s' }}
              onMouseEnter={(e) => (e.target.style.color = '#131931')}
              onMouseLeave={(e) => (e.target.style.color = '#464646')}
            >
              Postulaciones
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
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}