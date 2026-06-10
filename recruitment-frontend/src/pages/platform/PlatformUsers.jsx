import { useState, useEffect, useCallback } from 'react';
import { Can } from '../../components/common/Can';
import { usePermission } from '../../hooks/usePermission';
import { getUsuarios, deleteUsuario } from '../../api/usuariosApi';
import { assignRol, getRoles } from '../../api/rolesApi';
import { getEmpresas } from '../../api/empresasApi';
import { getAuditLogs } from '../../api/auditApi';
import ConfirmModal from '../../components/common/ConfirmModal';

const ROL_COLORS = {
  Owner:     { bg: 'rgba(139,92,246,0.2)',  text: '#c4a0ff' },
  Admin:     { bg: 'rgba(239,68,68,0.15)',  text: '#fca5a5' },
  Developer: { bg: 'rgba(59,130,246,0.15)', text: '#93c5fd' },
  DevOps:    { bg: 'rgba(16,185,129,0.15)', text: '#6ee7b7' },
  DBA:       { bg: 'rgba(245,158,11,0.15)', text: '#fcd34d' },
  Manager:   { bg: 'rgba(6,182,212,0.15)',  text: '#67e8f9' },
  Recruiter: { bg: 'rgba(99,102,241,0.15)', text: '#a5b4fc' },
  Candidate: { bg: 'rgba(236,72,153,0.12)', text: '#f9a8d4' },
};

function rolStyle(rol) {
  return ROL_COLORS[rol] ?? { bg: 'var(--color-accent-bg)', text: 'var(--color-accent)' };
}

function StatsCards({ usuarios }) {
  const counts = {};
  usuarios.forEach(u => { counts[u.rol] = (counts[u.rol] || 0) + 1; });
  const platformRoles = ['Owner', 'Admin', 'Developer', 'DevOps', 'DBA'];
  const platformCount = usuarios.filter(u => platformRoles.includes(u.rol)).length;

  const cards = [
    { label: 'Total', value: usuarios.length },
    { label: 'Candidatos', value: counts['Candidate'] || 0 },
    { label: 'Reclutadores', value: counts['Recruiter'] || 0 },
    { label: 'Managers', value: counts['Manager'] || 0 },
    { label: 'Plataforma', value: platformCount },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{c.value}</div>
          <div style={{ fontSize: 11, color: 'var(--color-slate)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

function UserLogsDrawer({ user, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 25;

  const loadLogs = useCallback(async (p) => {
    setLoading(true);
    try {
      const res = await getAuditLogs({ usuarioId: user.id, page: p, pageSize: PAGE_SIZE });
      const data = Array.isArray(res.data) ? res.data : [];
      setLogs(data);
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadLogs(1);
    setPage(1);
  }, [loadLogs]);

  const goPage = (p) => {
    setPage(p);
    loadLogs(p);
  };

  const rs = rolStyle(user.rol);

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 999, backdropFilter: 'blur(3px)' }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100dvh', width: '100%', maxWidth: 700,
        background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)',
        zIndex: 1000, display: 'flex', flexDirection: 'column',
        boxShadow: '-12px 0 40px rgba(0,0,0,0.45)',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%', background: rs.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: rs.text, fontSize: 16, flexShrink: 0,
          }}>
            {(user.nombre ?? '?')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
              {user.nombre} {user.apellido}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-slate)', marginTop: 2 }}>{user.email}</div>
          </div>
          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: rs.bg, color: rs.text, flexShrink: 0, whiteSpace: 'nowrap' }}>
            {user.rol}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1.5px solid var(--color-border)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: 'var(--color-slate)', fontSize: 14, flexShrink: 0 }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '10px 24px 8px', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Registro de actividad
          </span>
        </div>

        {/* Log table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-slate)', fontSize: 13 }}>Cargando logs…</div>
          ) : logs.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-slate)', fontSize: 13 }}>Sin actividad registrada.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', position: 'sticky', top: 0, zIndex: 1 }}>
                  {['Fecha', 'Acción', 'Recurso', 'Resultado', 'IP'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                    onMouseEnter={ev => ev.currentTarget.style.background = 'var(--color-bg)'}
                    onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '8px 12px', fontSize: 11, color: 'var(--color-slate)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      {log.accion}
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: 11, color: 'var(--color-muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.recurso ?? '—'}
                    </td>
                    <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700,
                        background: log.resultado === 'Allowed' ? 'rgba(106,217,192,0.15)' : 'rgba(239,68,68,0.12)',
                        color: log.resultado === 'Allowed' ? 'var(--color-green)' : 'var(--color-danger)',
                      }}>
                        {log.resultado === 'Allowed' ? 'Permitido' : 'Denegado'}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', fontSize: 11, color: 'var(--color-muted)', fontFamily: 'monospace' }}>
                      {log.ip ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {(page > 1 || hasMore) && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--color-slate)', marginRight: 4 }}>Página {page}</span>
            <button
              disabled={page === 1}
              onClick={() => goPage(page - 1)}
              style={{ padding: '5px 14px', borderRadius: 7, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 12, cursor: page === 1 ? 'not-allowed' : 'pointer', color: 'var(--color-navy)', opacity: page === 1 ? 0.4 : 1 }}
            >
              ← Ant.
            </button>
            <button
              disabled={!hasMore}
              onClick={() => goPage(page + 1)}
              style={{ padding: '5px 14px', borderRadius: 7, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 12, cursor: !hasMore ? 'not-allowed' : 'pointer', color: 'var(--color-navy)', opacity: !hasMore ? 0.4 : 1 }}
            >
              Sig. →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function PlatformUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [logsUser, setLogsUser] = useState(null);
  const [savingRol, setSavingRol] = useState({});

  const canAssignRole = usePermission('users:assign_role');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([getUsuarios(), getRoles(), getEmpresas()])
      .then(([u, r, e]) => { setUsuarios(u.data); setRoles(r.data); setEmpresas(e.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const assignableRoles = roles.filter(r => r.nombre !== 'Owner');

  const handleRolChange = async (userId, newRolNombre) => {
    setSavingRol(prev => ({ ...prev, [userId]: true }));
    try {
      const u = usuarios.find(x => x.id === userId);
      await assignRol({ usuarioId: userId, rolNombre: newRolNombre, empresaId: u?.empresaId ?? null });
      setUsuarios(prev => prev.map(x => x.id === userId ? { ...x, rol: newRolNombre } : x));
    } catch {
      alert('Error al asignar rol. Inténtalo de nuevo.');
    } finally {
      setSavingRol(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleEmpresaChange = async (userId, empresaId) => {
    setSavingRol(prev => ({ ...prev, [userId]: true }));
    try {
      const u = usuarios.find(x => x.id === userId);
      await assignRol({ usuarioId: userId, rolNombre: u.rol, empresaId: empresaId || null });
      setUsuarios(prev => prev.map(x => x.id === userId
        ? { ...x, empresaId: empresaId || null, empresaNombre: empresas.find(e => e.id === empresaId)?.nombre ?? null }
        : x));
    } catch {
      alert('Error al asignar empresa. Inténtalo de nuevo.');
    } finally {
      setSavingRol(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUsuario(deleteTarget.id);
      setUsuarios(prev => prev.filter(u => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      alert('Error al eliminar usuario.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = usuarios.filter(u =>
    `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--color-navy)', margin: '0 0 6px' }}>
          Gestión de usuarios
        </h1>
        <p style={{ color: 'var(--color-slate)', fontSize: 14, margin: 0 }}>
          {usuarios.length} usuarios registrados en la plataforma
        </p>
      </div>

      {!loading && <StatsCards usuarios={usuarios} />}

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por nombre o email..."
        style={{
          width: '100%', maxWidth: 360, padding: '9px 14px', borderRadius: 9,
          border: '1.5px solid var(--color-border)', fontSize: 14, marginBottom: 18,
          outline: 'none', boxSizing: 'border-box', background: 'var(--color-surface)',
          color: 'var(--color-navy)',
        }}
      />

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>
            {search ? 'Sin resultados para esa búsqueda.' : 'No hay usuarios registrados.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                  {['Usuario', 'Email', 'Rol', 'Empresa', 'Registrado', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const rs = rolStyle(u.rol);
                  const isOwner = u.rol === 'Owner';
                  return (
                    <tr
                      key={u.id}
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                      onMouseEnter={ev => ev.currentTarget.style.background = 'var(--color-bg)'}
                      onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                    >
                      {/* Name + avatar */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%', background: rs.bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, color: rs.text, fontSize: 13, flexShrink: 0,
                          }}>
                            {(u.nombre ?? '?')[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-navy)' }}>
                            {u.nombre} {u.apellido}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-muted)' }}>
                        {u.email}
                      </td>

                      {/* Role — inline select or static badge */}
                      <td style={{ padding: '12px 16px' }}>
                        {canAssignRole && !isOwner ? (
                          <select
                            value={u.rol}
                            disabled={!!savingRol[u.id]}
                            onChange={e => handleRolChange(u.id, e.target.value)}
                            style={{
                              padding: '4px 8px', borderRadius: 8,
                              border: '1.5px solid var(--color-border)', fontSize: 12,
                              cursor: 'pointer', background: 'var(--color-surface-2)',
                              color: 'var(--color-navy)', opacity: savingRol[u.id] ? 0.55 : 1,
                            }}
                          >
                            {assignableRoles.map(r => (
                              <option key={r.id} value={r.nombre}>{r.nombre}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: rs.bg, color: rs.text, whiteSpace: 'nowrap' }}>
                            {u.rol}
                          </span>
                        )}
                      </td>

                      {/* Empresa — inline select or static badge */}
                      <td style={{ padding: '12px 16px' }}>
                        {canAssignRole && !isOwner ? (
                          <select
                            value={u.empresaId ?? ''}
                            disabled={!!savingRol[u.id]}
                            onChange={e => handleEmpresaChange(u.id, e.target.value || null)}
                            style={{
                              padding: '4px 8px', borderRadius: 8,
                              border: '1.5px solid var(--color-border)', fontSize: 12,
                              cursor: 'pointer', background: 'var(--color-surface-2)',
                              color: 'var(--color-navy)', opacity: savingRol[u.id] ? 0.55 : 1,
                              maxWidth: 180,
                            }}
                          >
                            <option value="">— Sin empresa —</option>
                            {empresas.map(e => (
                              <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                            {u.empresaNombre ?? '— Sin empresa —'}
                          </span>
                        )}
                      </td>

                      {/* Registered date */}
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(u.createdAt).toLocaleDateString('es-SV')}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button
                            onClick={() => setLogsUser(u)}
                            title="Ver actividad del usuario"
                            style={{
                              padding: '5px 10px', borderRadius: 7,
                              border: '1px solid var(--color-border)', background: 'var(--color-surface-2)',
                              fontSize: 12, cursor: 'pointer', color: 'var(--color-slate)',
                              display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
                            }}
                          >
                            📋 Logs
                          </button>
                          <Can permission="users:disable">
                            <button
                              onClick={() => !isOwner && setDeleteTarget(u)}
                              disabled={isOwner}
                              title={isOwner ? 'No se puede eliminar al Owner' : `Eliminar a ${u.nombre}`}
                              style={{
                                padding: '5px 10px', borderRadius: 7,
                                border: `1px solid ${isOwner ? 'var(--color-border)' : 'var(--color-danger)'}`,
                                background: isOwner ? 'var(--color-surface-2)' : 'var(--color-danger-bg)',
                                fontSize: 12, cursor: isOwner ? 'not-allowed' : 'pointer',
                                color: isOwner ? 'var(--color-slate)' : 'var(--color-danger)',
                                opacity: isOwner ? 0.45 : 1, whiteSpace: 'nowrap',
                              }}
                            >
                              Eliminar
                            </button>
                          </Can>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Eliminar usuario"
        message={
          deleteTarget
            ? `¿Eliminar permanentemente a ${deleteTarget.nombre} ${deleteTarget.apellido} (${deleteTarget.email})? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel={deleting ? 'Eliminando...' : 'Eliminar'}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />

      {logsUser && <UserLogsDrawer user={logsUser} onClose={() => setLogsUser(null)} />}
    </div>
  );
}
