import { useState, useEffect } from 'react';
import { Can } from '../../components/common/Can';
import { getRoles, updateRolPermisos } from '../../api/rolesApi';
import { PERMISSIONS } from '../../lib/permissions';

const ALL_PERMS = Object.values(PERMISSIONS);
const PERM_CATEGORIES = {
  jobs: ALL_PERMS.filter(p => p.startsWith('jobs:')),
  applications: ALL_PERMS.filter(p => p.startsWith('applications:')),
  profile: ALL_PERMS.filter(p => p.startsWith('profile:')),
  users: ALL_PERMS.filter(p => p.startsWith('users:')),
  companies: ALL_PERMS.filter(p => p.startsWith('companies:')),
  reports: ALL_PERMS.filter(p => p.startsWith('reports:')),
  roles: ALL_PERMS.filter(p => p.startsWith('roles:')),
  audit: ALL_PERMS.filter(p => p.startsWith('audit:')),
  platform: ALL_PERMS.filter(p => p.startsWith('platform:') || p.startsWith('billing:')),
  ops: ALL_PERMS.filter(p => ['deployment:','infra:','pipeline:','logs:','features:','db:'].some(prefix => p.startsWith(prefix))),
};

const AMBITO_COLORS = {
  app_tier:      { bg: 'rgba(96,165,250,0.15)', text: '#93c5fd' },
  platform_tier: { bg: 'rgba(240,176,122,0.16)', text: '#f0b07a' },
};

function RoleDetailModal({ rol, onClose, onUpdate }) {
  const [selected, setSelected] = useState(new Set(rol.permisos ?? []));
  const [saving, setSaving] = useState(false);
  const editable = !rol.esInmutable;

  const toggle = (perm) => {
    if (!editable) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(perm) ? next.delete(perm) : next.add(perm);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRolPermisos(rol.id, Array.from(selected));
      onUpdate();
      onClose();
    } catch {
      alert('Error al actualizar permisos.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, width: '100%', maxWidth: 620, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-navy)', margin: 0 }}>{rol.nombre}</h2>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, marginTop: 4, display: 'inline-block', ...(AMBITO_COLORS[rol.ambito] ?? {}) }}>{rol.ambito}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-slate)' }}>×</button>
        </div>

        {rol.esInmutable && (
          <div style={{ background: 'rgba(240,176,122,0.16)', borderBottom: '1px solid rgba(240,176,122,0.3)', padding: '10px 24px', fontSize: 13, color: '#f0b07a', fontWeight: 600 }}>
            ⚠️ El rol Owner es inmutable — sus permisos no pueden modificarse.
          </div>
        )}

        <div style={{ overflowY: 'auto', flex: 1, padding: 24 }}>
          {Object.entries(PERM_CATEGORIES).map(([cat, perms]) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', margin: '0 0 8px' }}>{cat}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {perms.map(p => {
                  const active = selected.has(p);
                  return (
                    <button
                      key={p}
                      onClick={() => toggle(p)}
                      disabled={!editable}
                      style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                        border: `1.5px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: active ? 'var(--color-accent)' : 'var(--color-surface-2)',
                        color: active ? 'var(--color-on-brand-turquoise)' : 'var(--color-slate)',
                        cursor: editable ? 'pointer' : 'default',
                        opacity: !editable && !active ? 0.5 : 1,
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {editable && (
          <Can permission="roles:update">
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid var(--color-border)', background: 'var(--color-surface-2)', color: 'var(--color-navy)', cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: 'var(--color-accent)', color: 'var(--color-on-brand-turquoise)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </Can>
        )}
      </div>
    </div>
  );
}

export default function PlatformRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRol, setSelectedRol] = useState(null);

  const load = () => {
    getRoles().then(r => setRoles(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--color-navy)', margin: '0 0 6px' }}>Roles</h1>
        <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>Gestiona los roles y sus permisos. Haz clic en un rol para ver sus permisos.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-muted)' }}>Cargando...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {roles.map(r => {
            const ac = AMBITO_COLORS[r.ambito] ?? {};
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRol(r)}
                style={{
                  background: 'var(--color-surface)', borderRadius: 14, padding: '20px 22px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)', textAlign: 'left',
                  border: r.esInmutable ? '2px solid rgba(240,176,122,0.4)' : '1.5px solid var(--color-border)',
                  cursor: 'pointer', transition: 'box-shadow 0.18s, transform 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.25)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-navy)', margin: 0 }}>
                    {r.nombre}
                    {r.esInmutable && <span style={{ marginLeft: 6, fontSize: 13 }}>🔒</span>}
                  </h3>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, ...ac }}>
                    {r.ambito}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '0 0 12px' }}>
                  {r.permisos.length} permisos asignados
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {r.permisos.slice(0, 4).map(p => (
                    <span key={p} style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--color-bg)', border: '1px solid var(--color-border)', fontSize: 10, color: 'var(--color-slate)' }}>
                      {p}
                    </span>
                  ))}
                  {r.permisos.length > 4 && (
                    <span style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--color-accent-bg)', fontSize: 10, color: 'var(--color-accent)', fontWeight: 600 }}>
                      +{r.permisos.length - 4} más
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedRol && (
        <RoleDetailModal rol={selectedRol} onClose={() => setSelectedRol(null)} onUpdate={load} />
      )}
    </div>
  );
}
