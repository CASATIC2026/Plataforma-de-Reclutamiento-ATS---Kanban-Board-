import { useState, useEffect } from 'react';
import { Can } from '../../components/common/Can';
import { getEmpresas, createEmpresa, updateEmpresa, disableEmpresa } from '../../api/empresasApi';

function EmpresaModal({ empresa, onClose, onSave }) {
  const [nombre, setNombre] = useState(empresa?.nombre ?? '');
  const [dominio, setDominio] = useState(empresa?.dominio ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSaving(true);
    try {
      await onSave({ nombre: nombre.trim(), dominio: dominio.trim() || null });
      onClose();
    } catch (err) {
      alert('Error al guardar empresa.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 440, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-navy)', margin: 0 }}>
            {empresa ? 'Editar Empresa' : 'Nueva Empresa'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-slate)' }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)', display: 'block', marginBottom: 6 }}>Nombre *</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Empresa S.A. de C.V." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--color-border)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)', display: 'block', marginBottom: 6 }}>Dominio (opcional)</label>
            <input value={dominio} onChange={e => setDominio(e.target.value)} placeholder="empresa.com" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--color-border)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid var(--color-border)', background: 'white', cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: 'var(--color-navy)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PlatformCompanies() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { empresa?: object }

  useEffect(() => {
    getEmpresas().then(r => setEmpresas(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = empresas.filter(e => e.nombre.toLowerCase().includes(search.toLowerCase()) || (e.dominio ?? '').toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (data) => {
    if (modal.empresa) {
      const r = await updateEmpresa(modal.empresa.id, data);
      setEmpresas(prev => prev.map(e => e.id === modal.empresa.id ? { ...e, ...r.data } : e));
    } else {
      const r = await createEmpresa(data);
      setEmpresas(prev => [r.data, ...prev]);
    }
  };

  const handleDisable = async (id) => {
    if (!confirm('¿Deshabilitar esta empresa?')) return;
    await disableEmpresa(id);
    setEmpresas(prev => prev.map(e => e.id === id ? { ...e, estado: 'inactiva' } : e));
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--color-navy)', margin: '0 0 6px' }}>Empresas</h1>
          <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>{empresas.length} empresas registradas</p>
        </div>
        <Can permission="companies:create">
          <button onClick={() => setModal({})} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'var(--color-navy)', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            + Nueva Empresa
          </button>
        </Can>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar empresa..."
        style={{ width: '100%', maxWidth: 320, padding: '9px 14px', borderRadius: 9, border: '1.5px solid var(--color-border)', fontSize: 14, marginBottom: 18, outline: 'none', boxSizing: 'border-box' }}
      />

      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)' }}>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)' }}>No se encontraron empresas.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                {['Empresa', 'Dominio', 'Usuarios', 'Vacantes', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={ev => ev.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--color-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-accent)', fontSize: 13 }}>
                        {e.nombre[0]}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-navy)' }}>{e.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-slate)' }}>{e.dominio ?? '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'center', fontWeight: 600, color: 'var(--color-navy)' }}>{e.usuariosCount}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'center', fontWeight: 600, color: 'var(--color-navy)' }}>{e.vacantesCount}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: e.estado === 'activa' ? '#dcfce7' : '#fee2e2', color: e.estado === 'activa' ? '#166534' : '#991b1b' }}>
                      {e.estado}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Can permission="companies:update">
                        <button onClick={() => setModal({ empresa: e })} style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid var(--color-border)', background: 'white', fontSize: 12, cursor: 'pointer', color: 'var(--color-navy)' }}>Editar</button>
                      </Can>
                      {e.estado === 'activa' && (
                        <Can permission="companies:update">
                          <button onClick={() => handleDisable(e.id)} style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #fca5a5', background: '#fff5f5', fontSize: 12, cursor: 'pointer', color: '#991b1b' }}>Deshabilitar</button>
                        </Can>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal !== null && (
        <EmpresaModal empresa={modal.empresa} onClose={() => setModal(null)} onSave={handleSave} />
      )}
    </div>
  );
}
