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
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 14,
        padding: '20px 22px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: accent + '18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-navy)', margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 12, color: 'var(--color-slate)', margin: '4px 0 0' }}>{label}</p>
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
      .then(([v, p]) => {
        setVacantes(v.data);
        setPostulaciones(p.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activas = vacantes.filter(v => v.estaActiva);
  const enPipeline = postulaciones.filter(p => p.estado >= 0 && p.estado < 3);
  const contratados = postulaciones.filter(p => p.estado === 3);
  const tasa = postulaciones.length > 0 ? Math.round((contratados.length / postulaciones.length) * 100) : 0;

  const recent = [...postulaciones]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  const stats = [
    { label: 'Vacantes Activas',   value: activas.length,       icon: '📋', accent: '#40e0d0' },
    { label: 'Total Postulaciones',value: postulaciones.length,  icon: '👤', accent: '#6ad9c0' },
    { label: 'En Pipeline',        value: enPipeline.length,     icon: '🔄', accent: '#5eb9d6' },
    { label: 'Tasa de Conversión', value: `${tasa}%`,            icon: '✅', accent: '#7fd1a8' },
  ];

  const quickActions = [
    { label: 'Ver Kanban',    icon: '🗂️', to: '/admin/kanban',   permission: null },
    { label: 'Ver Vacantes',  icon: '📝', to: '/admin/vacantes',  permission: null },
    { label: 'Analíticas',    icon: '📊', to: '/admin/analytics', permission: 'reports:read' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-navy)', margin: '0 0 6px' }}>
          Bienvenido, {user?.nombre}
        </h1>
        <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>
          Resumen del estado actual de reclutamiento
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Recent Activity */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 14, border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-navy)', margin: 0 }}>
              Actividad Reciente
            </h2>
            <Link to="/admin/kanban" style={{ fontSize: 12, color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
              Ver Kanban →
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>Cargando...</div>
          ) : recent.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>
              No hay actividad reciente
            </div>
          ) : (
            <div>
              {recent.map(p => {
                const c = ESTADO_COLORS[String(p.estado)] ?? ESTADO_COLORS[0];
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate('/admin/kanban')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '13px 22px',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'var(--color-accent-bg)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: 'var(--color-accent)',
                      }}
                    >
                      {(p.nombreCandidato || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-navy)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.nombreCandidato}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.vacanteTitulo}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>
                        {ESTADO_LABELS[String(p.estado)]}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                        {new Date(p.createdAt).toLocaleDateString('es-SV')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 14, border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-navy)', margin: 0 }}>
              Acciones Rápidas
            </h2>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickActions.map(({ label, icon, to, permission }) => {
              const btn = (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '13px 16px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-navy)',
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg)'}
                >
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  {label}
                </Link>
              );
              return permission ? <Can key={to} permission={permission}>{btn}</Can> : btn;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
