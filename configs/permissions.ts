export const SCREENS = {
  USERS: 'users',
  DEPARTMENTS: 'departments',
  POSITIONS: 'positions',
  SEEU_SERVICE: 'seeu_service',
  SEEU_SERVICE_CREATE: 'seeu_service_create',
  SEEU_SERVICE_EDIT: 'seeu_service_edit',
  PEOPLE: 'people',
  SCREENS: 'screens_manage',
  PERMISSIONS: 'permissions_manage',
  AUDIT_LOGS: 'audit_logs',
} as const;

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  PRINT: 'print',
} as const;

export type Screen = (typeof SCREENS)[keyof typeof SCREENS];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
export type Scope = 'all' | 'department' | 'own';
