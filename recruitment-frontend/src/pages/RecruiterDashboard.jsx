import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Can } from '../components/common/Can';
import { getVacantes } from '../api/vacantesApi';
import { getPostulaciones } from '../api/postulacionesApi';

const ESTADO_LABELS = { '-1': 'Rechazado', 0: 'Nuevo', 1: 'Entrevista', 2: 'Prueba Técnica', 3: 'Oferta' };
const ESTADO_COLORS = {
  '-1': { bg: 'rgba(255,180,171,0.15)', text: '#ffb4ab' },
  0:    { bg: 'rgba(96,165,250,0.16)',  text: '#93c5fd' },
  1:    { bg: 'rgba(64,224,208,0.15)',  text: '#40e0d0' },
  2:    { bg: 'rgba(255,255,255,0.08)', text: '#b8c2dc' },
  3:    { bg: 'rgba(106,217,192,0.18)', text: '#6ad9c0' },
};

function StatCard({ label, value, icon, accent }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 14,
      padding: '18px 16px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      border: '1px solid var(--color-border)',
      borderLeft: `3px solid ${accent}`,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: 0,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: accent + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 11, color: 'var(--color-slate)', margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
      </div>
    </div>
  );
}

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vacantes, setVacantes] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getVacantes(), getPostulaciones()])
      .then(([v, p]) => { setVacantes(v.data); setPostulaciones(p.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activas     = vacantes.filter(v => v.estaActiva);
  const enPipeline  = postulaciones.filter(p => p.estado >= 0 && p.estado < 3);
  const contratados = postulaciones.filter(p => p.estado === 3);
  const tasa        = postulaciones.length > 0 ? Math.round((contratados.length / postulaciones.length) * 100) : 0;

  const recent = [...postulaciones]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  const stats = [
    { label: 'Vacantes Activas',    value: activas.length,      icon: '📋', accent: '#40e0d0' },
    { label: 'Total Postulaciones', value: postulaciones.length, icon: '👤', accent: '#6ad9c0' },
    { label: 'En Pipeline',         value: enPipeline.length,   icon: '🔄', accent: '#5eb9d6' },
    { label: 'Tasa de Conversión',  value: `${tasa}%`,          icon: '✅', accent: '#7fd1a8' },
  ];

  const quickActions = [
    { label: 'Ver Kanban',   icon: '🗂️', to: '/admin/kanban',   permission: null },
    { label: 'Ver Vacantes', icon: '📝', to: '/admin/vacantes',  permission: null },
    { label: 'Analíticas',   icon: '📊', to: '/admin/analytics', permission: 'reports:read' },
  ];

  return (
    <>
      <style>{`
        .rd-wrap   { max-width: 1200px; margin: 0 auto; padding: 28px 16px; font-family: var(--font-body); }
        .rd-stats  { display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 12px; margin-bottom: 24px; }
        .rd-bottom { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: start; }

        @media (max-width: 750px) {
          .rd-bottom { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .rd-wrap  { padding: 16px 10px; }
          .rd-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        }
        @media (max-width: 280px) {
          .rd-stats { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rd-wrap">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--color-navy)', margin: '0 0 4px' }}>
            Bienvenido, {user?.nombre}
          </h1>
          <p style={{ color: 'var(--color-slate)', fontSize: 13, margin: 0 }}>
            Resumen del estado actual de reclutamiento
          </p>
        </div>

        {/* Stats */}
        <div className="rd-stats">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Bottom panels */}
        <div className="rd-bottom">
          {/* Recent Activity */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 14, border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--color-navy)', margin: 0 }}>Actividad Reciente</h2>
              <Link to="/admin/kanban" style={{ fontSize: 12, color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}>Ver Kanban →</Link>
            </div>
            {loading ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>Cargando...</div>
            ) : recent.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>No hay actividad reciente</div>
            ) : (
              <div>
                {recent.map(p => {
                  const c = ESTADO_COLORS[String(p.estado)] ?? ESTADO_COLORS[0];
                  return (
                    <button
                      key={p.id}
                      onClick={() => navigate('/admin/kanban')}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-accent-bg)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--color-accent)' }}>
                        {(p.nombreCandidato || '?')[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-navy)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombreCandidato}</p>
                        <p style={{ fontSize: 11, color: 'var(--color-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.vacanteTitulo}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: c.bg, color: c.text }}>{ESTADO_LABELS[String(p.estado)]}</span>
                        <span style={{ fontSize: 10, color: 'var(--color-muted)' }}>{new Date(p.createdAt).toLocaleDateString('es-SV')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 14, border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--color-navy)', margin: 0 }}>Acciones Rápidas</h2>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickActions.map(({ label, icon, to, permission }) => {
                const btn = (
                  <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, textDecoration: 'none', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-navy)', fontSize: 13, fontWeight: 500, transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg)'}
                  >
                    <span style={{ fontSize: 16 }}>{icon}</span>{label}
                  </Link>
                );
                return permission ? <Can key={to} permission={permission}>{btn}</Can> : btn;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
