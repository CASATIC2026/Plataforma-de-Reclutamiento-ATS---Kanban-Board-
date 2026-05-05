import { usePermission, useAnyPermission } from '../../hooks/usePermission';

/**
 * Renders children only if the user has the required permission(s).
 *
 * Usage:
 *   <Can permission="jobs:create">...</Can>
 *   <Can anyOf={["jobs:create","jobs:update"]}>...</Can>
 *   <Can permission="jobs:create" fallback={<p>Sin acceso</p>}>...</Can>
 */
export function Can({ permission, anyOf, fallback = null, children }) {
  const single = usePermission(permission ?? '');
  const any = useAnyPermission(anyOf ?? []);

  const allowed = permission ? single : anyOf ? any : false;
  return allowed ? children : fallback;
}
