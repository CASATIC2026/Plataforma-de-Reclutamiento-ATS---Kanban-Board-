import { useAuth } from '../context/AuthContext';

export function usePermission(permission) {
  const { user } = useAuth();
  return user?.permissions?.includes(permission) ?? false;
}

export function useAnyPermission(permissions) {
  const { user } = useAuth();
  if (!user?.permissions) return false;
  return permissions.some(p => user.permissions.includes(p));
}

export function useAllPermissions(permissions) {
  const { user } = useAuth();
  if (!user?.permissions) return false;
  return permissions.every(p => user.permissions.includes(p));
}
