export const PERMISSIONS = {
  // Jobs
  JOBS_READ:            'jobs:read',
  JOBS_CREATE:          'jobs:create',
  JOBS_UPDATE:          'jobs:update',
  JOBS_DELETE:          'jobs:delete',
  JOBS_APPROVE:         'jobs:approve',
  JOBS_PUBLISH:         'jobs:publish',
  JOBS_READ_ALL:        'jobs:read_all',
  // Applications
  APPLICATIONS_CREATE:         'applications:create',
  APPLICATIONS_READ_OWN:       'applications:read_own',
  APPLICATIONS_READ:           'applications:read',
  APPLICATIONS_READ_ALL:       'applications:read_all',
  APPLICATIONS_UPDATE_STATUS:  'applications:update_status',
  APPLICATIONS_ADD_NOTE:       'applications:add_note',
  APPLICATIONS_REVIEW:         'applications:review',
  // Profile
  PROFILE_UPDATE_OWN:   'profile:update_own',
  // Users
  USERS_READ:           'users:read',
  USERS_UPDATE:         'users:update',
  USERS_DISABLE:        'users:disable',
  USERS_ASSIGN_ROLE:    'users:assign_role',
  // Companies
  COMPANIES_CREATE:     'companies:create',
  COMPANIES_READ:       'companies:read',
  COMPANIES_UPDATE:     'companies:update',
  COMPANIES_TRANSFER:   'companies:transfer',
  // Reports
  REPORTS_READ:         'reports:read',
  // Roles
  ROLES_READ:           'roles:read',
  ROLES_CREATE:         'roles:create',
  ROLES_UPDATE:         'roles:update',
  ROLES_ASSIGN_ADMIN:   'roles:assign_admin',
  // Audit
  AUDIT_READ:           'audit:read',
  AUDIT_EXPORT:         'audit:export',
  // Platform
  PLATFORM_ACCESS:      'platform:access',
  PLATFORM_CONFIGURE:   'platform:configure',
  BILLING_READ:         'billing:read',
  // Ops
  DEPLOYMENT_TRIGGER:   'deployment:trigger',
  DEPLOYMENT_READ_LOGS: 'deployment:read_logs',
  DEPLOYMENT_ROLLBACK:  'deployment:rollback',
  INFRA_READ_METRICS:   'infra:read_metrics',
  INFRA_CONFIGURE:      'infra:configure',
  PIPELINE_TRIGGER:     'pipeline:trigger',
  LOGS_READ:            'logs:read',
  FEATURES_TOGGLE:      'features:toggle',
  DB_READ_LOGS:         'db:read_logs',
};

// Legacy fallback for users who don't have UsuarioRoles yet in the DB.
// Permissions are sourced from the API (AuthResponseDTO.permissions) on login;
// this map is only used when the backend returns an empty permissions array.
export const LEGACY_ROLE_PERMISSIONS = {
  Administrador: Object.values(PERMISSIONS),
  Manager: [
    'jobs:read', 'jobs:create', 'jobs:update', 'jobs:delete',
    'jobs:approve', 'jobs:publish', 'jobs:read_all',
    'applications:create', 'applications:read_own', 'applications:read',
    'applications:read_all', 'applications:update_status', 'applications:add_note',
    'applications:review', 'profile:update_own', 'reports:read', 'users:read', 'companies:read', 'platform:access',
  ],
  Profesor: [
    'jobs:read', 'jobs:create', 'jobs:update', 'jobs:delete',
    'applications:create', 'applications:read_own', 'applications:read',
    'applications:update_status', 'applications:add_note', 'applications:review', 'profile:update_own',
  ],
  Estudiante: [
    'jobs:read', 'applications:create', 'applications:read_own', 'profile:update_own',
  ],
  Invitado: [
    'jobs:read', 'applications:create', 'applications:read_own',
  ],
  General: [
    'jobs:read', 'applications:create', 'applications:read_own',
  ],
};

export function getPermissionsForRole(rol) {
  return LEGACY_ROLE_PERMISSIONS[rol] ?? [];
}
