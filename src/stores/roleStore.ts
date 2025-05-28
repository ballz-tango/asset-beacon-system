
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  table: string;
  columns: { name: string; type: string; required: boolean; unique?: boolean }[];
  indexes: string[];
  relationships: { table: string; type: 'one-to-many' | 'many-to-many' | 'one-to-one' }[];
}

interface RoleState {
  roles: Role[];
  permissions: Permission[];
  databaseSchema: DatabaseSchema[];
  initializeDefaultRoles: () => void;
  createRole: (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  assignPermission: (roleId: string, permissionId: string) => void;
  removePermission: (roleId: string, permissionId: string) => void;
  getDatabaseSchema: () => DatabaseSchema[];
  updateDatabaseSchema: (schema: DatabaseSchema[]) => void;
}

const defaultPermissions: Permission[] = [
  // Asset Management
  { id: 'assets.create', name: 'Create Assets', resource: 'assets', action: 'create', description: 'Create new assets' },
  { id: 'assets.read', name: 'View Assets', resource: 'assets', action: 'read', description: 'View asset information' },
  { id: 'assets.update', name: 'Update Assets', resource: 'assets', action: 'update', description: 'Edit asset information' },
  { id: 'assets.delete', name: 'Delete Assets', resource: 'assets', action: 'delete', description: 'Delete assets' },
  { id: 'assets.checkout', name: 'Checkout Assets', resource: 'assets', action: 'checkout', description: 'Assign assets to users' },
  { id: 'assets.checkin', name: 'Checkin Assets', resource: 'assets', action: 'checkin', description: 'Return assets from users' },
  { id: 'assets.audit', name: 'Audit Assets', resource: 'assets', action: 'audit', description: 'Perform asset audits' },
  
  // User Management
  { id: 'users.create', name: 'Create Users', resource: 'users', action: 'create', description: 'Create new user accounts' },
  { id: 'users.read', name: 'View Users', resource: 'users', action: 'read', description: 'View user information' },
  { id: 'users.update', name: 'Update Users', resource: 'users', action: 'update', description: 'Edit user information' },
  { id: 'users.delete', name: 'Delete Users', resource: 'users', action: 'delete', description: 'Delete user accounts' },
  
  // Role Management
  { id: 'roles.create', name: 'Create Roles', resource: 'roles', action: 'create', description: 'Create new roles' },
  { id: 'roles.read', name: 'View Roles', resource: 'roles', action: 'read', description: 'View role information' },
  { id: 'roles.update', name: 'Update Roles', resource: 'roles', action: 'update', description: 'Edit role information' },
  { id: 'roles.delete', name: 'Delete Roles', resource: 'roles', action: 'delete', description: 'Delete roles' },
  
  // System Administration
  { id: 'system.settings', name: 'System Settings', resource: 'system', action: 'settings', description: 'Manage system settings' },
  { id: 'system.backup', name: 'System Backup', resource: 'system', action: 'backup', description: 'Create and restore backups' },
  { id: 'system.logs', name: 'View Logs', resource: 'system', action: 'logs', description: 'View system logs' },
  { id: 'system.api', name: 'API Access', resource: 'system', action: 'api', description: 'Access API endpoints' },
  
  // Reports
  { id: 'reports.assets', name: 'Asset Reports', resource: 'reports', action: 'assets', description: 'Generate asset reports' },
  { id: 'reports.users', name: 'User Reports', resource: 'reports', action: 'users', description: 'Generate user reports' },
  { id: 'reports.audit', name: 'Audit Reports', resource: 'reports', action: 'audit', description: 'Generate audit reports' },
  
  // RFID
  { id: 'rfid.scan', name: 'RFID Scanning', resource: 'rfid', action: 'scan', description: 'Scan RFID tags' },
  { id: 'rfid.manage', name: 'RFID Management', resource: 'rfid', action: 'manage', description: 'Manage RFID devices' },
];

const defaultRoles: Role[] = [
  {
    id: 'super-admin',
    name: 'Super Administrator',
    description: 'Full system access with ability to create administrators',
    permissions: defaultPermissions.map(p => p.id),
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full asset management access without system administration',
    permissions: defaultPermissions.filter(p => 
      p.resource !== 'system' || p.action === 'logs'
    ).map(p => p.id),
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'manager',
    name: 'Asset Manager',
    description: 'Manage assets and users within their department',
    permissions: [
      'assets.create', 'assets.read', 'assets.update', 'assets.checkout', 'assets.checkin',
      'users.read', 'users.update', 'reports.assets', 'rfid.scan'
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'operator',
    name: 'Asset Operator',
    description: 'Basic asset operations and scanning',
    permissions: [
      'assets.read', 'assets.checkout', 'assets.checkin', 'rfid.scan'
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'viewer',
    name: 'Asset Viewer',
    description: 'Read-only access to assets and reports',
    permissions: [
      'assets.read', 'reports.assets'
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const databaseSchema: DatabaseSchema[] = [
  {
    table: 'users',
    columns: [
      { name: 'id', type: 'uuid', required: true, unique: true },
      { name: 'email', type: 'varchar(255)', required: true, unique: true },
      { name: 'name', type: 'varchar(255)', required: true },
      { name: 'role_id', type: 'uuid', required: true },
      { name: 'department', type: 'varchar(100)', required: false },
      { name: 'employee_id', type: 'varchar(50)', required: false, unique: true },
      { name: 'phone', type: 'varchar(20)', required: false },
      { name: 'active', type: 'boolean', required: true },
      { name: 'last_login', type: 'timestamp', required: false },
      { name: 'created_at', type: 'timestamp', required: true },
      { name: 'updated_at', type: 'timestamp', required: true }
    ],
    indexes: ['email', 'role_id', 'employee_id', 'department'],
    relationships: [
      { table: 'roles', type: 'many-to-many' },
      { table: 'assets', type: 'one-to-many' }
    ]
  },
  {
    table: 'assets',
    columns: [
      { name: 'id', type: 'uuid', required: true, unique: true },
      { name: 'name', type: 'varchar(255)', required: true },
      { name: 'asset_tag', type: 'varchar(50)', required: true, unique: true },
      { name: 'serial_number', type: 'varchar(100)', required: true },
      { name: 'rfid_tag', type: 'varchar(50)', required: false, unique: true },
      { name: 'category_id', type: 'uuid', required: true },
      { name: 'status', type: 'enum', required: true },
      { name: 'location_id', type: 'uuid', required: true },
      { name: 'assigned_to', type: 'uuid', required: false },
      { name: 'purchase_date', type: 'date', required: true },
      { name: 'purchase_cost', type: 'decimal(10,2)', required: true },
      { name: 'current_value', type: 'decimal(10,2)', required: true },
      { name: 'vendor', type: 'varchar(255)', required: false },
      { name: 'warranty_months', type: 'integer', required: false },
      { name: 'notes', type: 'text', required: false },
      { name: 'last_audit_date', type: 'timestamp', required: false },
      { name: 'created_at', type: 'timestamp', required: true },
      { name: 'updated_at', type: 'timestamp', required: true }
    ],
    indexes: ['asset_tag', 'serial_number', 'rfid_tag', 'category_id', 'status', 'location_id', 'assigned_to'],
    relationships: [
      { table: 'categories', type: 'many-to-many' },
      { table: 'locations', type: 'many-to-many' },
      { table: 'users', type: 'many-to-many' }
    ]
  },
  {
    table: 'categories',
    columns: [
      { name: 'id', type: 'uuid', required: true, unique: true },
      { name: 'name', type: 'varchar(100)', required: true, unique: true },
      { name: 'description', type: 'text', required: false },
      { name: 'color', type: 'varchar(7)', required: false },
      { name: 'icon', type: 'varchar(50)', required: false },
      { name: 'created_at', type: 'timestamp', required: true },
      { name: 'updated_at', type: 'timestamp', required: true }
    ],
    indexes: ['name'],
    relationships: [
      { table: 'assets', type: 'one-to-many' }
    ]
  },
  {
    table: 'locations',
    columns: [
      { name: 'id', type: 'uuid', required: true, unique: true },
      { name: 'name', type: 'varchar(100)', required: true },
      { name: 'address', type: 'text', required: false },
      { name: 'city', type: 'varchar(100)', required: false },
      { name: 'state', type: 'varchar(50)', required: false },
      { name: 'country', type: 'varchar(50)', required: false },
      { name: 'zip', type: 'varchar(20)', required: false },
      { name: 'parent_id', type: 'uuid', required: false },
      { name: 'created_at', type: 'timestamp', required: true },
      { name: 'updated_at', type: 'timestamp', required: true }
    ],
    indexes: ['name', 'parent_id'],
    relationships: [
      { table: 'assets', type: 'one-to-many' },
      { table: 'locations', type: 'one-to-many' }
    ]
  },
  {
    table: 'audit_logs',
    columns: [
      { name: 'id', type: 'uuid', required: true, unique: true },
      { name: 'user_id', type: 'uuid', required: true },
      { name: 'asset_id', type: 'uuid', required: false },
      { name: 'action', type: 'varchar(50)', required: true },
      { name: 'description', type: 'text', required: false },
      { name: 'old_values', type: 'json', required: false },
      { name: 'new_values', type: 'json', required: false },
      { name: 'ip_address', type: 'varchar(45)', required: false },
      { name: 'user_agent', type: 'text', required: false },
      { name: 'created_at', type: 'timestamp', required: true }
    ],
    indexes: ['user_id', 'asset_id', 'action', 'created_at'],
    relationships: [
      { table: 'users', type: 'many-to-many' },
      { table: 'assets', type: 'many-to-many' }
    ]
  }
];

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      roles: [],
      permissions: defaultPermissions,
      databaseSchema: databaseSchema,
      
      initializeDefaultRoles: () => {
        set({ roles: defaultRoles });
      },
      
      createRole: (roleData) => {
        const role: Role = {
          ...roleData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          roles: [...state.roles, role]
        }));
      },
      
      updateRole: (id, updates) => {
        set((state) => ({
          roles: state.roles.map(role =>
            role.id === id
              ? { ...role, ...updates, updatedAt: new Date().toISOString() }
              : role
          )
        }));
      },
      
      deleteRole: (id) => {
        set((state) => ({
          roles: state.roles.filter(role => role.id !== id && !role.isSystemRole)
        }));
      },
      
      assignPermission: (roleId, permissionId) => {
        set((state) => ({
          roles: state.roles.map(role =>
            role.id === roleId
              ? { 
                  ...role, 
                  permissions: [...new Set([...role.permissions, permissionId])],
                  updatedAt: new Date().toISOString()
                }
              : role
          )
        }));
      },
      
      removePermission: (roleId, permissionId) => {
        set((state) => ({
          roles: state.roles.map(role =>
            role.id === roleId
              ? { 
                  ...role, 
                  permissions: role.permissions.filter(p => p !== permissionId),
                  updatedAt: new Date().toISOString()
                }
              : role
          )
        }));
      },
      
      getDatabaseSchema: () => {
        return get().databaseSchema;
      },
      
      updateDatabaseSchema: (schema) => {
        set({ databaseSchema: schema });
      }
    }),
    {
      name: 'role-storage'
    }
  )
);
