
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Database,
  LogOut,
  Boxes,
  GitBranch,
  Zap,
  Shield,
  Crown,
  Code2,
  FolderOpen,
  FileText,
  Upload
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useRoleStore } from '@/stores/roleStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuthStore();
  const { initializeDefaultRoles } = useRoleStore();
  
  // Initialize roles on first load
  React.useEffect(() => {
    initializeDefaultRoles();
  }, [initializeDefaultRoles]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['super-admin', 'admin', 'manager', 'operator', 'viewer'] },
    { name: 'Assets', href: '/assets', icon: Package, roles: ['super-admin', 'admin', 'manager', 'operator', 'viewer'] },
    { name: 'Inventory', href: '/inventory', icon: Boxes, roles: ['super-admin', 'admin', 'manager'] },
    { name: 'Asset Requests', href: '/requests', icon: FileText, roles: ['super-admin', 'admin', 'manager', 'operator', 'viewer'] },
    { name: 'File Management', href: '/files', icon: FolderOpen, roles: ['super-admin', 'admin', 'manager'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['super-admin', 'admin', 'manager'] },
    { name: 'Roles', href: '/roles', icon: Shield, roles: ['super-admin', 'admin'] },
    { name: 'Workflows', href: '/workflows', icon: GitBranch, roles: ['super-admin', 'admin', 'manager'] },
    { name: 'RFID Devices', href: '/rfid', icon: Zap, roles: ['super-admin', 'admin', 'manager', 'operator'] },
    { name: 'API Docs', href: '/api-docs', icon: Code2, roles: ['super-admin', 'admin'] },
    { name: 'Deployment', href: '/deployment', icon: Upload, roles: ['super-admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['super-admin', 'admin', 'manager'] },
    { name: 'Backup', href: '/backup', icon: Database, roles: ['super-admin', 'admin'] }
  ];

  // Add Super Admin panel for super admins
  if (user?.role === 'super-admin' || user?.permissions?.includes('all')) {
    navigation.splice(-2, 0, { name: 'Super Admin', href: '/admin', icon: Crown, roles: ['super-admin'] });
  }

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'viewer')
  );

  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <span className="text-lg font-semibold">Asset Management</span>
        </div>
        <div className="p-4">
          <nav className="space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900',
                  location.pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-2.5 h-4 w-4',
                    location.pathname === item.href
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">
              {filteredNavigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>

            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
