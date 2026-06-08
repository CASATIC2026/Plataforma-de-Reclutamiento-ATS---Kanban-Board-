import { PERMISSIONS } from './permissions';

/** Where to send the user immediately after login / register. */
export function getPostLoginPath(userData) {
  if (!userData) return '/';

  const permissions = userData.permissions ?? [];
  const has = (p) => permissions.includes(p);
  const rol = userData.rol;

  if (has(PERMISSIONS.USERS_ASSIGN_ROLE)) return '/platform';
  if (rol === 'Administrador' || rol === 'Manager') return '/admin/vacantes';
  if (has(PERMISSIONS.APPLICATIONS_READ) || has(PERMISSIONS.JOBS_CREATE)) {
    return '/admin/vacantes';
  }
  if (has(PERMISSIONS.APPLICATIONS_READ_OWN)) return '/dashboard';
  return '/';
}

/** True when the user's home is the candidate dashboard (not the public landing). */
export function isCandidateUser(user, hasPermission) {
  if (!user) return false;
  const rol = user.rol;
  if (rol === 'Administrador' || rol === 'Manager') return false;
  if (hasPermission(PERMISSIONS.USERS_ASSIGN_ROLE)) return false;
  if (hasPermission(PERMISSIONS.APPLICATIONS_READ) || hasPermission(PERMISSIONS.JOBS_CREATE)) {
    return false;
  }
  return hasPermission(PERMISSIONS.APPLICATIONS_READ_OWN);
}
