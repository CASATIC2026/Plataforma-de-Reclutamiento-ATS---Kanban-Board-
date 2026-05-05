import { useState, useEffect } from 'react';
import { Can } from '../../components/common/Can';
import { getUsuarios } from '../../api/usuariosApi';
import { assignRol, getRoles } from '../../api/rolesApi';

function RoleAssignModal({ usuario, roles, onClose, onAssigned }) {
  const [selectedRol, setSelectedRol] = useState('');
  const [saving, setSaving] = useState(false);

  const assignable = roles.filter(r => r.nombre !== 'Owner');

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedRol) return;
    setSaving(true);
    try {
      await assignRol({ usuarioId: usuario.id, rolNombre: selectedRol });
      onAssigned();
      onClose();
    } catch {
      alert('Error al asignar rol.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 420, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-navy)', margin: 0 }}>Asignar Rol</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-slate)' }}>×</button>
        </div>
        <form onSubmit={handleAssign} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-slate)' }}>
            Asignando rol a <strong style={{ color: 'var(--color-navy)' }}>{usuario.nombre} {usuario.apellido}</strong>
          </p>
          <select value={selectedRol} onChange={e => setSelectedRol(e.target.value)} required style={{ padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--color-border)', fontSize: 14, outline: 'none' }}>
            <option value="">Seleccionar rol...</option>
            {assignable.map(r => (
              <option key={r.id} value={r.nombre}>{r.nombre} ({r.ambito})</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid var(--color-border)', background: 'white', cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
            <button type="submit" disabled={saving || !selectedRol} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: 'var(--color-navy)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              {saving ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PlatformUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState(null);

  const load = () => {
    Promise.all([getUsuarios(), getRoles()])
      .then(([u, r]) => { setUsuarios(u.data); setRoles(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = usuarios.filter(u =>
    `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--color-navy)', margin: '0 0 6px' }}>Usuarios</h1>
        <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>{usuarios.length} usuarios en la plataforma</p>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar usuario..."
        style={{ width: '100%', maxWidth: 320, padding: '9px 14px', borderRadius: 9, border: '1.5px solid var(--color-border)', fontSize: 14, marginBottom: 18, outline: 'none', boxSizing: 'border-box' }}
      />

      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)' }}>Cargando...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                {['Nombre', 'Email', 'Rol actual', 'Registrado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={ev => ev.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-accent)', fontSize: 12 }}>
                        {(u.nombre ?? '?')[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-navy)' }}>
                        {u.nombre} {u.apellido}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>
                      {u.rol}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString('es-SV')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Can permission="users:assign_role">
                      <button onClick={() => setAssignModal(u)} style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid var(--color-border)', background: 'white', fontSize: 12, cursor: 'pointer', color: 'var(--color-navy)' }}>
                        Asignar Rol
                      </button>
                    </Can>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {assignModal && (
        <RoleAssignModal
          usuario={assignModal}
          roles={roles}
          onClose={() => setAssignModal(null)}
          onAssigned={load}
        />
      )}
    </div>
  );
}
