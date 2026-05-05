import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMisPostulaciones } from '../api/candidatoApi';

const ESTADO_LABELS = {
  '-1': 'Rechazado',
  0: 'Pendiente',
  1: 'En Revisión',
  2: 'Prueba Técnica',
  3: 'Oferta',
};

const ESTADO_COLORS = {
  '-1': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  0:    { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
  1:    { bg: '#FFF1EB', text: 'var(--color-accent)', border: '#f4c8ae' },
  2:    { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
  3:    { bg: '#dcfce7', text: '#166534', border: '#86efac' },
};

const COLUMNS = [
  { estado: 0, label: 'Pendiente' },
  { estado: 1, label: 'En Revisión' },
  { estado: 2, label: 'Prueba Técnica' },
  { estado: 3, label: 'Oferta' },
];

const COL_COLORS = {
  0: { header: '#e0f2fe', border: '#7dd3fc', dot: '#0ea5e9' },
  1: { header: '#FFF1EB', border: '#f4c8ae', dot: 'var(--color-accent)' },
  2: { header: '#f1f5f9', border: '#cbd5e1', dot: '#64748b' },
  3: { header: '#dcfce7', border: '#86efac', dot: '#22c55e' },
};

function ApplicationDetailModal({ app, onClose }) {
  if (!app) return null;
  const c = ESTADO_COLORS[String(app.estado)] ?? ESTADO_COLORS[0];

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 999, padding: 20,
      }}
    >
      <div
        style={{
          background: 'white', borderRadius: 16, width: '100%', maxWidth: 480,
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)', overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-navy)', margin: 0 }}>
                {app.vacanteTitulo}
              </h2>
              <p style={{ color: 'var(--color-slate)', fontSize: 13, marginTop: 4 }}>
                Postulado el {new Date(app.createdAt).toLocaleDateString('es-SV', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-slate)' }}>×</button>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {app.estado === -1 ? (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
              <p style={{ color: '#991b1b', fontWeight: 600, fontSize: 14, margin: 0 }}>
                Lo sentimos, tu aplicación no fue seleccionada en esta ocasión.
              </p>
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
              <p style={{ color: '#166534', fontSize: 14, margin: 0 }}>
                Tu aplicación está siendo revisada. Te notificaremos sobre cualquier cambio.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>Estado actual</span>
              <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                {ESTADO_LABELS[String(app.estado)]}
              </span>
            </div>

            {app.puntaje != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>Puntaje de compatibilidad</span>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: app.puntaje >= 75 ? '#d1fae5' : app.puntaje >= 60 ? '#fef3c7' : '#fee2e2',
                  color: app.puntaje >= 75 ? '#065f46' : app.puntaje >= 60 ? '#92400e' : '#991b1b',
                }}>
                  {Math.round(app.puntaje)}/100
                </span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>Última actualización</span>
              <span style={{ fontSize: 13, color: 'var(--color-navy)', fontWeight: 500 }}>
                {new Date(app.updatedAt).toLocaleDateString('es-SV')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMisPostulaciones()
      .then(res => setApplications(res.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const active = applications.filter(a => a.estado >= 0);
  const rechazados = applications.filter(a => a.estado === -1);
  const ofertas = applications.filter(a => a.estado === 3);

  const statsCards = [
    { label: 'Total postulaciones', value: applications.length, color: 'var(--color-navy)' },
    { label: 'En proceso',          value: active.length,        color: 'var(--color-accent)' },
    { label: 'Ofertas recibidas',   value: ofertas.length,       color: '#319E85' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      {/* Top nav */}
      <header
        style={{
          background: 'white',
          borderBottom: '1px solid var(--color-border)',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          height: 56,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-navy)', marginRight: 8 }}>
          Talentify sv
        </span>
        <nav style={{ display: 'flex', gap: 4 }}>
          {[
            { label: 'Mis Postulaciones', to: '/dashboard' },
            { label: 'Buscar Empleos', to: '/' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: '6px 14px',
                borderRadius: 7,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--color-slate)',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--color-slate)' }}>
          Hola, <strong style={{ color: 'var(--color-navy)' }}>{user?.nombre}</strong>
        </div>
      </header>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px' }}>
        {/* Page heading */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-navy)', margin: 0 }}>
            Mis Postulaciones
          </h1>
          <p style={{ color: 'var(--color-slate)', marginTop: 6, fontSize: 14 }}>
            Seguimiento de tus aplicaciones activas
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {statsCards.map(({ label, value, color }) => (
            <div key={label} style={{ background: 'white', borderRadius: 12, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 800, color }}>{value}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-slate)', margin: 0, lineHeight: 1.4 }}>{label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {COLUMNS.map(c => (
              <div key={c.estado} style={{ background: 'white', borderRadius: 12, height: 200, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-navy)', marginBottom: 10 }}>
              Aún no has aplicado a ninguna vacante
            </h2>
            <p style={{ color: 'var(--color-slate)', marginBottom: 24 }}>
              Explora las oportunidades disponibles y da el primer paso en tu carrera.
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-block',
                padding: '11px 28px',
                background: 'var(--color-navy)',
                color: 'white',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Buscar Empleos
            </Link>
          </div>
        ) : (
          <>
            {/* Kanban columns (read-only) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
              {COLUMNS.map(col => {
                const cards = active.filter(a => a.estado === col.estado);
                const cc = COL_COLORS[col.estado];
                return (
                  <div key={col.estado}>
                    <div
                      style={{
                        background: cc.header,
                        border: `1px solid ${cc.border}`,
                        borderRadius: 10,
                        padding: '10px 14px',
                        marginBottom: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: cc.dot, display: 'inline-block' }} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-navy)' }}>{col.label}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: cc.dot }}>
                        {cards.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {cards.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--color-muted)', fontSize: 12 }}>
                          Sin postulaciones
                        </div>
                      ) : (
                        cards.map(app => (
                          <button
                            key={app.id}
                            onClick={() => setSelected(app)}
                            style={{
                              background: 'white',
                              border: '1px solid var(--color-border)',
                              borderRadius: 10,
                              padding: '12px 14px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'box-shadow 0.18s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                              width: '100%',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.10)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
                          >
                            <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-navy)', margin: '0 0 4px', lineHeight: 1.3 }}>
                              {app.vacanteTitulo}
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--color-muted)', margin: 0 }}>
                              {new Date(app.createdAt).toLocaleDateString('es-SV')}
                            </p>
                            {app.puntaje != null && (
                              <span style={{
                                marginTop: 8,
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                                background: app.puntaje >= 75 ? '#d1fae5' : app.puntaje >= 60 ? '#fef3c7' : '#fee2e2',
                                color: app.puntaje >= 75 ? '#065f46' : app.puntaje >= 60 ? '#92400e' : '#991b1b',
                              }}>
                                {Math.round(app.puntaje)}/100
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rechazados section */}
            {rechazados.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 12 }}>
                  Postulaciones no seleccionadas ({rechazados.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                  {rechazados.map(app => (
                    <button
                      key={app.id}
                      onClick={() => setSelected(app)}
                      style={{
                        background: '#fff5f5',
                        border: '1px solid #fca5a5',
                        borderRadius: 10,
                        padding: '12px 14px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        opacity: 0.8,
                      }}
                    >
                      <p style={{ fontWeight: 600, fontSize: 13, color: '#991b1b', margin: '0 0 4px' }}>
                        {app.vacanteTitulo}
                      </p>
                      <p style={{ fontSize: 11, color: '#b91c1c', margin: 0 }}>
                        {new Date(app.createdAt).toLocaleDateString('es-SV')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selected && <ApplicationDetailModal app={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
