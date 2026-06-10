import { useState, useEffect } from 'react';
import { Can } from '../components/common/Can';
import { getPipelineFunnel, getTimeToHire, getSources, getTeamActivity } from '../api/analyticsApi';

function SectionCard({ title, children, loading }) {
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-navy)', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: 24 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-muted)', fontSize: 14 }}>Cargando...</div>
        ) : children}
      </div>
    </div>
  );
}

const FUNNEL_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

export default function ManagerAnalytics() {
  const [pipeline, setPipeline]       = useState(null);
  const [timeToHire, setTimeToHire]   = useState(null);
  const [sources, setSources]         = useState(null);
  const [team, setTeam]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [sortCol, setSortCol]         = useState('totalPostulaciones');
  const [sortAsc, setSortAsc]         = useState(false);

  useEffect(() => {
    Promise.all([
      getPipelineFunnel(),
      getTimeToHire(),
      getSources(),
      getTeamActivity(),
    ])
      .then(([p, t, s, tm]) => {
        setPipeline(p.data);
        setTimeToHire(t.data);
        setSources(s.data);
        setTeam(tm.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const maxTTH = timeToHire?.items?.length
    ? Math.max(...timeToHire.items.map(i => i.promedioDias), 1)
    : 1;

  const maxPipeline = pipeline?.stages?.length
    ? Math.max(...pipeline.stages.map(s => s.count), 1)
    : 1;

  const sortedSources = sources?.items
    ? [...sources.items].sort((a, b) => {
        const av = a[sortCol] ?? 0, bv = b[sortCol] ?? 0;
        return sortAsc ? av - bv : bv - av;
      })
    : [];

  const toggleSort = col => {
    if (sortCol === col) setSortAsc(a => !a);
    else { setSortCol(col); setSortAsc(false); }
  };

  const SortHeader = ({ col, label }) => (
    <th
      onClick={() => toggleSort(col)}
      style={{
        padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700,
        color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.05em',
        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
        background: sortCol === col ? 'var(--color-accent-bg)' : 'transparent',
      }}
    >
      {label} {sortCol === col ? (sortAsc ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 16px', fontFamily: 'var(--font-body)' }}>
      <style>{`
        .ma-funnel-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; gap: 8px; flex-wrap: wrap; }
        .ma-funnel-meta { font-size: 13px; color: var(--color-slate); white-space: nowrap; }
        .ma-tth-summary { margin-bottom: 20px; display: flex; gap: 12px; flex-wrap: wrap; }
        .ma-tth-box { background: var(--color-accent-bg); border-radius: 10px; padding: 12px 18px; flex: 1; min-width: 120px; }
        @media (max-width: 480px) {
          .ma-funnel-meta { font-size: 11px; }
          .ma-tth-box { padding: 10px 14px; }
        }
      `}</style>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-navy)', margin: '0 0 6px' }}>
          Analíticas de Reclutamiento
        </h1>
        <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>
          Métricas de rendimiento y conversión del pipeline
        </p>
      </div>

      {/* Section A — Time to Hire */}
      <SectionCard title="Tiempo Promedio de Contratación" loading={loading}>
        {timeToHire && (
          <>
            <div className="ma-tth-summary">
              <div className="ma-tth-box">
                <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-accent)', margin: 0 }}>{timeToHire.promedioGlobal}</p>
                <p style={{ fontSize: 12, color: 'var(--color-slate)', margin: '4px 0 0' }}>días promedio global</p>
              </div>
              <div style={{ background: 'rgba(106,217,192,0.15)', borderRadius: 10, padding: '12px 18px', flex: 1, minWidth: 120 }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: '#6ad9c0', margin: 0 }}>{timeToHire.items.reduce((s, i) => s + i.totalContratados, 0)}</p>
                <p style={{ fontSize: 12, color: '#6ad9c0', margin: '4px 0 0' }}>total contratados</p>
              </div>
            </div>
            {timeToHire.items.length === 0 ? (
              <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Sin datos de contratación aún.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {timeToHire.items.map(item => (
                  <div key={item.ubicacion}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: 'var(--color-navy)', fontWeight: 500 }}>{item.ubicacion}</span>
                      <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>
                        {Math.round(item.promedioDias)} días · {item.totalContratados} contratados
                      </span>
                    </div>
                    <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(item.promedioDias / maxTTH) * 100}%`,
                        background: 'var(--color-accent)',
                        borderRadius: 4,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </SectionCard>

      {/* Section B — Pipeline Funnel */}
      <SectionCard title="Embudo del Pipeline" loading={loading}>
        {pipeline && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {pipeline.stages.map((stage, i) => (
              <div key={stage.nombre}>
                <div className="ma-funnel-row">
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-navy)' }}>{stage.nombre}</span>
                  <span className="ma-funnel-meta">
                    {stage.count} candidatos &nbsp;·&nbsp;
                    <strong style={{ color: FUNNEL_COLORS[i] }}>{stage.porcentaje}%</strong>
                  </span>
                </div>
                <div style={{ height: 24, background: 'var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(stage.count / maxPipeline) * 100}%`,
                    background: FUNNEL_COLORS[i],
                    borderRadius: 6,
                    transition: 'width 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 10,
                  }}>
                    {stage.count > 0 && (
                      <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{stage.count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Section C — Source Tracking */}
      <SectionCard title="Rendimiento por Vacante" loading={loading}>
        {sortedSources.length === 0 ? (
          <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Sin datos de vacantes.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                  <SortHeader col="vacanteTitulo" label="Vacante" />
                  <SortHeader col="ubicacion" label="Ubicación" />
                  <SortHeader col="totalPostulaciones" label="Postulaciones" />
                  <SortHeader col="contratados" label="Contratados" />
                  <SortHeader col="tasaConversion" label="Conversión" />
                </tr>
              </thead>
              <tbody>
                {sortedSources.map(item => (
                  <tr
                    key={item.vacanteId}
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: 'var(--color-navy)', maxWidth: 280 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.vacanteTitulo}
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--color-slate)' }}>{item.ubicacion}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: 'var(--color-navy)', textAlign: 'center' }}>{item.totalPostulaciones}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, textAlign: 'center' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 20, background: 'rgba(106,217,192,0.15)', color: '#6ad9c0', fontWeight: 600, fontSize: 12 }}>
                        {item.contratados}
                      </span>
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                        background: item.tasaConversion >= 20 ? 'rgba(106,217,192,0.15)' : item.tasaConversion >= 10 ? 'rgba(240,176,122,0.16)' : 'rgba(255,180,171,0.15)',
                        color: item.tasaConversion >= 20 ? '#6ad9c0' : item.tasaConversion >= 10 ? '#f0b07a' : '#ffb4ab',
                      }}>
                        {item.tasaConversion}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Section D — Team Activity (requires users:read) */}
      <Can permission="users:read">
        <SectionCard title="Actividad del Equipo" loading={loading}>
          {!team || team.items.length === 0 ? (
            <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>
              Sin datos de equipo. Asegúrate de que las vacantes tengan un creador asignado.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                    {['Reclutador', 'Email', 'Vacantes', 'Postulaciones', 'Contratados'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {team.items.map(item => (
                    <tr key={item.usuarioId} style={{ borderBottom: '1px solid var(--color-border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: 'var(--color-navy)' }}>{item.recruiterNombre}</td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--color-muted)' }}>{item.recruiterEmail}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13, textAlign: 'center', fontWeight: 600 }}>{item.vacantesPublicadas}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13, textAlign: 'center' }}>
                        <span style={{ padding: '2px 10px', borderRadius: 20, background: 'var(--color-accent-bg)', color: 'var(--color-accent)', fontWeight: 600, fontSize: 12 }}>
                          {item.postulacionesRecibidas}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: 13, textAlign: 'center' }}>
                        <span style={{ padding: '2px 10px', borderRadius: 20, background: 'rgba(106,217,192,0.15)', color: '#6ad9c0', fontWeight: 600, fontSize: 12 }}>
                          {item.contratados}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </Can>
    </div>
  );
}
