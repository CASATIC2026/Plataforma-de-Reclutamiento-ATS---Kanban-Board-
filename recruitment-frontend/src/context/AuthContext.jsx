import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

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

  const isAuthenticated = !!token;
  const userRole = user?.rol || null;
  const isAdmin = userRole === 'Administrador';
  const isAdminOrManager = userRole === 'Administrador' || userRole === 'Manager';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout, userRole, isAdmin, isAdminOrManager }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
