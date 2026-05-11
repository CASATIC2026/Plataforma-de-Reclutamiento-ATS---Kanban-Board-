import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlatformOverview } from '../../api/platformApi';

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-navy)', margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 12, color: 'var(--color-slate)', margin: '4px 0 0' }}>{label}</p>
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
    { label: 'Empresas activas',     value: data.totalEmpresas,     icon: '🏢', color: 'var(--color-navy)' },
    { label: 'Usuarios totales',     value: data.totalUsuarios,     icon: '👥', color: 'var(--color-accent)' },
    { label: 'Vacantes publicadas',  value: data.totalVacantes,     icon: '📋', color: '#1F9DB9' },
    { label: 'Postulaciones totales',value: data.totalPostulaciones,icon: '📄', color: '#319E85' },
  ] : [];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--color-navy)', margin: '0 0 6px' }}>
            Platform Overview
          </h1>
          <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>
            Estado general de la plataforma Talentify SV
          </p>
        </div>
        {data && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: data.sistemaOk ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: data.sistemaOk ? '#166534' : '#991b1b', fontWeight: 600 }}>
              Sistema {data.sistemaOk ? 'operativo' : 'con problemas'}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-muted)' }}>Cargando...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {stats.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Recent Companies */}
          {data?.recentEmpresas?.length > 0 && (
            <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-navy)', margin: 0 }}>
                  Empresas Recientes
                </h2>
                <Link to="/platform/companies" style={{ fontSize: 12, color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
                  Ver todas →
                </Link>
              </div>
              <div>
                {data.recentEmpresas.map(e => (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-accent)', fontSize: 14 }}>
                      {e.nombre[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-navy)', margin: 0 }}>{e.nombre}</p>
                      <p style={{ fontSize: 11, color: 'var(--color-muted)', margin: '2px 0 0' }}>{e.dominio ?? '—'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-slate)' }}>
                      <span><strong>{e.usuariosCount}</strong> usuarios</span>
                      <span><strong>{e.vacantesCount}</strong> vacantes</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: e.estado === 'activa' ? '#dcfce7' : '#fee2e2', color: e.estado === 'activa' ? '#166534' : '#991b1b' }}>
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
  );
}
