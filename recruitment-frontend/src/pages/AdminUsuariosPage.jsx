import { useState, useEffect } from 'react';
import { getUsuarios, deleteUsuario } from '../api/usuariosApi';
import { getRoles, assignRol } from '../api/rolesApi';
import { useAuth } from '../context/AuthContext';

function getRolColor(rolNombre) {
  const map = {
    Candidate:      { bg: 'rgba(106,217,192,0.15)', text: '#6ad9c0' },
    Recruiter:      { bg: 'var(--color-accent-bg)', text: 'var(--color-accent)' },
    Manager:        { bg: 'rgba(96,165,250,0.15)', text: '#93c5fd' },
    Administrador:  { bg: 'var(--color-accent-bg)', text: 'var(--color-navy)' },
  };
  return map[rolNombre] ?? { bg: 'rgba(255,255,255,0.08)', text: '#b8c2dc' };
}

export default function AdminUsuariosPage() {
  const { isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([getUsuarios(), getRoles()])
      .then(([usersRes, rolesRes]) => {
        setUsuarios(usersRes.data);
        // Only show app_tier roles in this admin view
        setRoles((rolesRes.data ?? []).filter((r) => r.ambito === 'app_tier'));
      })
      .catch(() => setError('Error al cargar datos.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRolChange = async (id, newRolNombre) => {
    setSaving(id);
    setError('');
    setSuccess('');
    try {
      await assignRol({ usuarioId: id, rolNombre: newRolNombre });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: newRolNombre } : u))
      );
      setSuccess('Rol actualizado correctamente.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar rol.');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) return;
    setError('');
    setSuccess('');
    try {
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      setSuccess('Usuario eliminado.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-400 mb-2">Acceso restringido</p>
          <p className="text-gray-500">Solo los administradores pueden gestionar usuarios.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--color-navy)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Gestión de Usuarios
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Administra los roles y permisos de los usuarios registrados.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-error-container/30 border border-error/30 text-error px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-bg border border-green/30 text-green px-4 py-3 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => {
          const count = usuarios.filter((u) => u.rol === role.nombre).length;
          const colors = getRolColor(role.nombre);
          return (
            <div key={role.id} className="bg-surface border border-border p-5 rounded-2xl shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text }}>
                {role.nombre}
              </span>
              <p className="text-3xl font-extrabold mt-1" style={{ color: colors.text }}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
      ) : usuarios.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-bold">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate text-left">
                  Nombre
                </th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate text-left">
                  Email
                </th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate text-left">
                  Rol
                </th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate text-left">
                  Registrado
                </th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-slate text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => {
                const colors = getRolColor(user.rol);
                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-navy">
                        {user.nombre} {user.apellido}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.rol}
                        onChange={(e) => handleRolChange(user.id, e.target.value)}
                        disabled={saving === user.id || roles.length === 0}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          opacity: saving === user.id ? 0.5 : 1,
                        }}
                      >
                        {/* Keep current role as fallback even if not in app_tier list */}
                        {!roles.some((r) => r.nombre === user.rol) && (
                          <option value={user.rol}>{user.rol}</option>
                        )}
                        {roles.map((r) => (
                          <option key={r.id} value={r.nombre}>{r.nombre}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user.id, `${user.nombre} ${user.apellido}`)}
                        className="p-2 hover:bg-danger-bg rounded-lg text-danger transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar usuario"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
