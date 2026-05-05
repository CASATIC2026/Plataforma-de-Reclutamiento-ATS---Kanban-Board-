import { useState, useEffect } from 'react';
import { useAnyPermission, usePermission } from '../../hooks/usePermission';
import { getDeployments, triggerDeploy, rollback } from '../../api/opsApi';
import { getFeatureFlags, toggleFeatureFlag } from '../../api/featureFlagsApi';

const TABS = [
  { id: 'deployments',    label: 'Deployments',    permKey: 'deployment:trigger' },
  { id: 'infrastructure', label: 'Infraestructura', permKey: 'infra:read_metrics' },
  { id: 'database',       label: 'Logs BD',         permKey: 'db:read_logs' },
  { id: 'flags',          label: 'Feature Flags',   permKey: 'features:toggle' },
];

const ESTADO_DEPLOY_COLORS = {
  Success:    { bg: '#dcfce7', text: '#166534' },
  Failed:     { bg: '#fee2e2', text: '#991b1b' },
  Running:    { bg: '#e0f2fe', text: '#0369a1' },
  RolledBack: { bg: '#fef3c7', text: '#92400e' },
};

function ToggleSwitch({ value, onChange, disabled }) {
  return (
    <button onClick={() => !disabled && onChange(!value)} disabled={disabled}
      style={{ width: 44, height: 24, borderRadius: 12, background: value ? 'var(--color-green)' : 'var(--color-border)', border: 'none', cursor: disabled ? 'default' : 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: value ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

export default function PlatformOps() {
  const [activeTab, setActiveTab] = useState('deployments');
  const [deployments, setDeployments] = useState([]);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const canDeploy    = usePermission('deployment:trigger');
  const canRollback  = usePermission('deployment:rollback');
  const canInfra     = usePermission('infra:read_metrics');
  const canDb        = usePermission('db:read_logs');
  const canFlags     = usePermission('features:toggle');
  const hasAnyAccess = useAnyPermission(['deployment:trigger', 'infra:read_metrics', 'db:read_logs', 'features:toggle']);

  useEffect(() => {
    Promise.all([
      canDeploy || canRollback ? getDeployments() : Promise.resolve({ data: [] }),
      canFlags ? getFeatureFlags() : Promise.resolve({ data: [] }),
    ])
      .then(([d, f]) => { setDeployments(d.data); setFlags(f.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDeploy = async () => {
    if (!confirm('¿Confirmar nuevo deployment?')) return;
    setTriggering(true);
    try {
      const r = await triggerDeploy();
      setDeployments(prev => [r.data, ...prev]);
    } catch { alert('Error al disparar deployment.'); }
    finally { setTriggering(false); }
  };

  const handleRollback = async (id, version) => {
    if (!confirm(`¿Hacer rollback de versión ${version}?`)) return;
    try {
      const r = await rollback(id);
      setDeployments(prev => [r.data, ...prev]);
    } catch { alert('Error al hacer rollback.'); }
  };

  const handleToggleFlag = async (flag) => {
    try {
      const r = await toggleFeatureFlag(flag.id);
      setFlags(prev => prev.map(f => f.id === flag.id ? r.data : f));
    } catch { alert('Error al actualizar flag.'); }
  };

  const visibleTabs = TABS.filter(t => {
    if (t.id === 'deployments')    return canDeploy || canRollback;
    if (t.id === 'infrastructure') return canInfra;
    if (t.id === 'database')       return canDb;
    if (t.id === 'flags')          return canFlags;
    return false;
  });

  if (!hasAnyAccess) return (
    <div style={{ padding: 60, textAlign: 'center', color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}>
      Sin permisos de acceso a operaciones.
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--color-navy)', margin: '0 0 6px' }}>Operaciones</h1>
        <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>Deployments, infraestructura y feature flags</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--color-border)', marginBottom: 28 }}>
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 400,
              color: activeTab === tab.id ? 'var(--color-navy)' : 'var(--color-slate)',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-navy)' : '2px solid transparent',
              marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deployments Tab */}
      {activeTab === 'deployments' && (
        <div>
          {canDeploy && (
            <div style={{ marginBottom: 20 }}>
              <button onClick={handleDeploy} disabled={triggering} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: 'var(--color-navy)', color: 'white', fontWeight: 600, fontSize: 14, cursor: triggering ? 'not-allowed' : 'pointer', opacity: triggering ? 0.7 : 1 }}>
                {triggering ? 'Disparando...' : '🚀 Trigger Deploy'}
              </button>
            </div>
          )}
          <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)' }}>Cargando...</div>
            ) : deployments.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)' }}>Sin historial de deployments.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                    {['Versión', 'Timestamp', 'Disparado por', 'Estado', 'Duración', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deployments.map(d => {
                    const sc = ESTADO_DEPLOY_COLORS[d.estado] ?? {};
                    return (
                      <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'monospace' }}>v{d.version}</td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{new Date(d.createdAt).toLocaleString('es-SV')}</td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--color-slate)' }}>{d.disparadoPorEmail ?? 'Sistema'}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, ...sc }}>{d.estado}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--color-slate)' }}>
                          {d.duracionSegundos != null ? `${d.duracionSegundos}s` : '—'}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {canRollback && d.estado === 'Success' && (
                            <button onClick={() => handleRollback(d.id, d.version)} style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid var(--color-border)', background: 'white', fontSize: 12, cursor: 'pointer', color: 'var(--color-navy)' }}>
                              Rollback
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Infrastructure Tab */}
      {activeTab === 'infrastructure' && canInfra && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { name: 'API Server',  ok: true,  latency: '48ms' },
              { name: 'Database',    ok: true,  latency: '12ms' },
              { name: 'SMTP Server', ok: false, latency: '—' },
            ].map(svc => (
              <div key={svc.name} style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: svc.ok ? '#22c55e' : '#ef4444', display: 'inline-block', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-navy)', margin: 0 }}>{svc.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '2px 0 0' }}>
                    {svc.ok ? `Online · ${svc.latency}` : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#92400e' }}>
            ⚠️ SMTP Server no responde. Verifica las credenciales en <code>appsettings.json</code>.
          </div>
        </div>
      )}

      {/* Database Logs Tab */}
      {activeTab === 'database' && canDb && (
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🗄️</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-navy)', marginBottom: 8 }}>
            Logs de Base de Datos
          </h2>
          <p style={{ color: 'var(--color-slate)', fontSize: 14, maxWidth: 400, margin: '0 auto 16px' }}>
            Los slow query logs se administran directamente en PostgreSQL. Conéctate a pgAdmin o psql para consultarlos.
          </p>
          <div style={{ background: 'var(--color-bg)', borderRadius: 9, padding: '10px 16px', display: 'inline-block', fontFamily: 'monospace', fontSize: 12, color: 'var(--color-navy)' }}>
            psql -U recruitment_user -d recruitment_db
          </div>
        </div>
      )}

      {/* Feature Flags Tab */}
      {activeTab === 'flags' && canFlags && (
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {flags.map(flag => (
            <div key={flag.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-navy)', margin: '0 0 4px' }}>{flag.nombre}</p>
                <p style={{ fontSize: 12, color: 'var(--color-slate)', margin: 0 }}>{flag.descripcion}</p>
              </div>
              <ToggleSwitch value={flag.estaActivo} onChange={() => handleToggleFlag(flag)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
