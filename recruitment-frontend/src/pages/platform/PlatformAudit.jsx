import { useState, useEffect } from 'react';
import { Can } from '../../components/common/Can';
import { getAuditLogs } from '../../api/auditApi';

export default function PlatformAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ resultado: '', from: '', to: '' });
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);
    const params = { page, pageSize: 50 };
    if (filters.resultado) params.resultado = filters.resultado;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    getAuditLogs(params)
      .then(r => setLogs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const exportCsv = () => {
    const header = 'Timestamp,Usuario,Acción,Recurso,Resultado,IP\n';
    const rows = logs.map(l =>
      `"${l.createdAt}","${l.usuarioEmail ?? ''}","${l.accion}","${l.recurso ?? ''}","${l.resultado}","${l.ip ?? ''}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'audit_log.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--color-navy)', margin: '0 0 6px' }}>Auditoría</h1>
          <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>Registro de acciones y autorizaciones del sistema</p>
        </div>
        <Can permission="audit:export">
          <button onClick={exportCsv} style={{ padding: '9px 18px', borderRadius: 9, border: '1.5px solid var(--color-border)', background: 'white', color: 'var(--color-navy)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            Exportar CSV
          </button>
        </Can>
      </div>

      {/* Filters */}
      <form onSubmit={handleFilter} style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resultado</label>
          <select value={filters.resultado} onChange={e => setFilters(p => ({ ...p, resultado: e.target.value }))} style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--color-border)', fontSize: 13, outline: 'none' }}>
            <option value="">Todos</option>
            <option value="Allowed">Permitido</option>
            <option value="Denied">Denegado</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Desde</label>
          <input type="date" value={filters.from} onChange={e => setFilters(p => ({ ...p, from: e.target.value }))} style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--color-border)', fontSize: 13, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hasta</label>
          <input type="date" value={filters.to} onChange={e => setFilters(p => ({ ...p, to: e.target.value }))} style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--color-border)', fontSize: 13, outline: 'none' }} />
        </div>
        <button type="submit" style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: 'var(--color-navy)', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          Filtrar
        </button>
        <button type="button" onClick={() => { setFilters({ resultado: '', from: '', to: '' }); setPage(1); load(); }} style={{ padding: '9px 14px', borderRadius: 8, border: '1.5px solid var(--color-border)', background: 'white', fontSize: 13, cursor: 'pointer' }}>
          Limpiar
        </button>
      </form>

      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)' }}>Cargando...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)' }}>No se encontraron registros.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                  {['Timestamp', 'Usuario', 'Acción', 'Recurso', 'Resultado', 'IP'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(l => {
                  const isAllowed = l.resultado === 'Allowed';
                  return (
                    <tr key={l.id} style={{ borderBottom: '1px solid var(--color-border)', background: isAllowed ? '#f0fdf4' : '#fff5f5' }}>
                      <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(l.createdAt).toLocaleString('es-SV')}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--color-navy)', fontWeight: 500 }}>{l.usuarioEmail ?? '—'}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--color-slate)', maxWidth: 200 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.accion}</div>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--color-muted)' }}>{l.recurso ?? '—'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: isAllowed ? '#dcfce7' : '#fee2e2', color: isAllowed ? '#166534' : '#991b1b' }}>
                          {isAllowed ? 'Permitido' : 'Denegado'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--color-muted)', fontFamily: 'monospace' }}>{l.ip ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid var(--color-border)', background: 'white', cursor: 'pointer', fontSize: 13, opacity: page === 1 ? 0.5 : 1 }}>
          Anterior
        </button>
        <span style={{ padding: '7px 14px', fontSize: 13, color: 'var(--color-slate)' }}>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={logs.length < 50} style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid var(--color-border)', background: 'white', cursor: 'pointer', fontSize: 13, opacity: logs.length < 50 ? 0.5 : 1 }}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
