import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlatformOverview } from '../../api/platformApi';

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '18px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 11, color: 'var(--color-slate)', margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
      </div>
    </div>
  );
}

export default function PlatformOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformOverview()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { label: 'Empresas activas',      value: data.totalEmpresas,      icon: '🏢', color: '#40e0d0' },
    { label: 'Usuarios totales',      value: data.totalUsuarios,      icon: '👥', color: '#6ad9c0' },
    { label: 'Vacantes publicadas',   value: data.totalVacantes,      icon: '📋', color: '#5eb9d6' },
    { label: 'Postulaciones totales', value: data.totalPostulaciones, icon: '📄', color: '#7fd1a8' },
  ] : [];

  return (
    <>
      <style>{`
        .po-wrap   { max-width: 1100px; margin: 0 auto; padding: 28px 16px; font-family: var(--font-body); }
        .po-header { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12; flex-wrap: wrap; }
        .po-grid   { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px; }
        .po-row    { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--color-border); flex-wrap: wrap; }
        .po-row-meta { display: flex; gap: 12px; font-size: 12px; color: var(--color-slate); flex-wrap: wrap; }

        @media (max-width: 480px) {
          .po-wrap  { padding: 16px 10px; }
          .po-grid  { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; }
          .po-row   { padding: 10px 12px; gap: 8px; }
        }

        @media (max-width: 280px) {
          .po-grid  { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="po-wrap">
        {/* Header */}
        <div className="po-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-navy)', margin: '0 0 4px' }}>
              Platform Overview
            </h1>
            <p style={{ color: 'var(--color-slate)', fontSize: 13, margin: 0 }}>
              Estado general de Talentify SV
            </p>
          </div>
          {data && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: data.sistemaOk ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: data.sistemaOk ? '#6ad9c0' : '#ffb4ab', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {data.sistemaOk ? 'Operativo' : 'Con problemas'}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-muted)' }}>Cargando...</div>
        ) : (
          <>
            {/* Stats grid — auto-wraps at any width */}
            <div className="po-grid">
              {stats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Recent Companies */}
            {data?.recentEmpresas?.length > 0 && (
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--color-navy)', margin: 0 }}>
                    Empresas Recientes
                  </h2>
                  <Link to="/platform/companies" style={{ fontSize: 12, color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}>
                    Ver todas →
                  </Link>
                </div>
                <div>
                  {data.recentEmpresas.map(e => (
                    <div key={e.id} className="po-row">
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--color-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-accent)', fontSize: 13, flexShrink: 0 }}>
                        {e.nombre[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 80 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-navy)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.nombre}</p>
                        <p style={{ fontSize: 11, color: 'var(--color-muted)', margin: '2px 0 0' }}>{e.dominio ?? '—'}</p>
                      </div>
                      <div className="po-row-meta">
                        <span><strong>{e.usuariosCount}</strong> usr</span>
                        <span><strong>{e.vacantesCount}</strong> vac</span>
                      </div>
                      <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: e.estado === 'activa' ? 'rgba(106,217,192,0.15)' : 'rgba(255,180,171,0.15)', color: e.estado === 'activa' ? '#6ad9c0' : '#ffb4ab', flexShrink: 0 }}>
                        {e.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
