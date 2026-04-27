import { useState, useEffect } from 'react';
import { getUsuarios, changeUsuarioRol, deleteUsuario } from '../api/usuariosApi';
import { useAuth } from '../context/AuthContext';

const ROLES = ['General', 'Manager', 'Administrador'];

const ROLE_COLORS = {
  Administrador: { bg: 'var(--color-accent-bg)', text: 'var(--color-navy)' },
  Manager: { bg: '#e0f2fe', text: '#0369a1' },
  General: { bg: '#f3f4f6', text: '#6b7280' },
};

export default function AdminUsuariosPage() {
  const { isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsuarios = async () => {
    try {
      const res = await getUsuarios();
      setUsuarios(res.data);
    } catch {
      setError('Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleRolChange = async (id, newRol) => {
    setSaving(id);
    setError('');
    setSuccess('');
    try {
      const res = await changeUsuarioRol(id, newRol);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? res.data : u))
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ROLES.map((role) => {
          const count = usuarios.filter((u) => u.rol === role).length;
          const colors = ROLE_COLORS[role];
          return (
            <div key={role} className="bg-white p-5 rounded-2xl shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text }}>
                {role === 'General' ? 'Generales' : role === 'Manager' ? 'Managers' : 'Administradores'}
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
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                const colors = ROLE_COLORS[user.rol] || ROLE_COLORS.General;
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
                        disabled={saving === user.id}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          opacity: saving === user.id ? 0.5 : 1,
                        }}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
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
