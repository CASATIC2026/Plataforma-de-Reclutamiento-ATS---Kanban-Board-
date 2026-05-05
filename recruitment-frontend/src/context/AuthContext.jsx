import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';
import { getPermissionsForRole } from '../lib/permissions';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.token);
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Back-fill permissions if the stored session pre-dates RBAC
        if (!parsedUser.permissions?.length) {
          parsedUser.permissions = getPermissionsForRole(parsedUser.rol);
        }
        setToken(savedToken);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to restore user from storage:', err);
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    }
    setLoading(false);
  }, []);

  const login = (authResponse) => {
    const { token: jwt, ...userData } = authResponse;
    // Ensure permissions array is always present
    if (!userData.permissions?.length) {
      userData.permissions = getPermissionsForRole(userData.rol);
    }
    setToken(jwt);
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.token, jwt);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
  };

  const hasPermission = (permission) => user?.permissions?.includes(permission) ?? false;

  const isAuthenticated = !!token;
  const userRole = user?.rol || null;
  const isAdmin = userRole === 'Administrador';
  const isAdminOrManager = userRole === 'Administrador' || userRole === 'Manager';

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated,
      login, logout, userRole, isAdmin, isAdminOrManager, hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
