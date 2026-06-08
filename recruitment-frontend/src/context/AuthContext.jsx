import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';
import { getPermissionsForRole } from '../lib/permissions';

const AuthContext = createContext(null);

const SELECTED_COMPANY_KEY = 'tb_selectedCompanyId';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyIdState] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.token);
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);
    const savedCompany = localStorage.getItem(SELECTED_COMPANY_KEY);
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
    if (savedCompany) setSelectedCompanyIdState(savedCompany);
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
    setSelectedCompanyIdState(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(SELECTED_COMPANY_KEY);
  };

  const hasPermission = (permission) => user?.permissions?.includes(permission) ?? false;

  // Platform tier ≈ can administer the platform across tenants. Use the same
  // discriminator as the backend (`users:assign_role`) so the two stay aligned.
  const isPlatformTier = hasPermission('users:assign_role');

  const setSelectedCompany = (id) => {
    setSelectedCompanyIdState(id);
    if (id) localStorage.setItem(SELECTED_COMPANY_KEY, id);
    else localStorage.removeItem(SELECTED_COMPANY_KEY);
  };

  const isAuthenticated = !!token;
  const userRole = user?.rol || null;
  const isAdmin = userRole === 'Administrador';
  const isAdminOrManager = userRole === 'Administrador' || userRole === 'Manager';
  const companyId = user?.companyId || null;

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated,
      login, logout, userRole, isAdmin, isAdminOrManager, hasPermission,
      companyId, isPlatformTier, selectedCompanyId, setSelectedCompany,
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
