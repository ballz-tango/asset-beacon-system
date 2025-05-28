
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, 
  Shield, 
  Database,
  Settings,
  Users,
  Crown,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { useRoleStore } from '@/stores/roleStore';

const SuperAdminPanel = () => {
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });
  
  const { user } = useAuthStore();
  const { roles, initializeDefaultRoles, createRole, getDatabaseSchema } = useRoleStore();
  const { toast } = useToast();

  const isAuthorized = user?.role === 'super-admin' || user?.permissions?.includes('all');

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newAdminData.password !== newAdminData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally call an API to create the admin
    toast({
      title: "Administrator Created",
      description: `${newAdminData.name} has been created as an administrator`
    });

    setNewAdminData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin'
    });
  };

  const initializeSystem = () => {
    initializeDefaultRoles();
    toast({
      title: "System Initialized",
      description: "Default roles and permissions have been set up"
    });
  };

  const systemStats = {
    totalUsers: 156,
    activeAdmins: 3,
    totalAssets: 1247,
    systemHealth: 98.5,
    lastBackup: '2024-01-20 02:00:00',
    diskUsage: 45.2,
    dbSize: '2.1 GB'
  };

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">
              You don't have super administrator privileges to access this panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Crown className="h-8 w-8 text-yellow-600" />
            <span>Super Administrator Panel</span>
          </h1>
          <p className="text-gray-600 mt-2">
            System-wide administration and configuration
          </p>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800">
          Super Admin Access
        </Badge>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Across all roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemStats.activeAdmins}</div>
            <p className="text-xs text-muted-foreground">Administrator accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.systemHealth}%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.dbSize}</div>
            <p className="text-xs text-muted-foreground">{systemStats.diskUsage}% disk usage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="admins" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="admins">Admin Management</TabsTrigger>
          <TabsTrigger value="system">System Control</TabsTrigger>
          <TabsTrigger value="database">Database Schema</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Admin */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Create Administrator</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div>
                    <Label htmlFor="adminName">Full Name</Label>
                    <Input
                      id="adminName"
                      value={newAdminData.name}
                      onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="adminEmail">Email Address</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={newAdminData.email}
                      onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="adminPassword">Password</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={newAdminData.password}
                      onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={newAdminData.confirmPassword}
                      onChange={(e) => setNewAdminData({ ...newAdminData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="adminRole">Administrator Role</Label>
                    <select
                      id="adminRole"
                      value={newAdminData.role}
                      onChange={(e) => setNewAdminData({ ...newAdminData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="admin">Administrator</option>
                      <option value="super-admin">Super Administrator</option>
                    </select>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Administrator
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Current Administrators */}
            <Card>
              <CardHeader>
                <CardTitle>Current Administrators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-gray-600">john.smith@company.com</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Super Admin</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-gray-600">sarah.johnson@company.com</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Administrator</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Mike Wilson</p>
                      <p className="text-sm text-gray-600">mike.wilson@company.com</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Administrator</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Control</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={initializeSystem} className="w-full">
                  Initialize Default Roles
                </Button>
                
                <Button variant="outline" className="w-full">
                  Force System Backup
                </Button>
                
                <Button variant="outline" className="w-full">
                  Clear Application Cache
                </Button>
                
                <Button variant="outline" className="w-full">
                  Generate System Report
                </Button>
                
                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency System Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Last Backup:</span>
                  <span className="font-mono text-sm">{systemStats.lastBackup}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Total Assets:</span>
                  <span className="font-bold">{systemStats.totalAssets}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-bold">{systemStats.totalUsers}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Disk Usage:</span>
                  <span className="font-bold">{systemStats.diskUsage}%</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600">
                    System version: 2.1.0<br />
                    Database version: PostgreSQL 15.3<br />
                    API version: v2.0
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Database Schema Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getDatabaseSchema().map((table, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">{table.table}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Columns:</h4>
                        <div className="space-y-1">
                          {table.columns.map((column, colIndex) => (
                            <div key={colIndex} className="text-sm flex items-center space-x-2">
                              <code className="bg-gray-100 px-1 rounded">{column.name}</code>
                              <span className="text-gray-600">{column.type}</span>
                              {column.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                              {column.unique && <Badge variant="outline" className="text-xs">Unique</Badge>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Relationships:</h4>
                        <div className="space-y-1">
                          {table.relationships.map((rel, relIndex) => (
                            <div key={relIndex} className="text-sm">
                              <span className="text-gray-600">{rel.type}</span> with <code className="bg-gray-100 px-1 rounded">{rel.table}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Password Policy</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Uppercase and lowercase letters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Numbers and special characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Password expiry: 90 days</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Security Settings</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Two-factor authentication enabled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Session timeout: 24 hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>API rate limiting active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Audit logging enabled</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="mr-2">Update Security Settings</Button>
                <Button variant="outline">View Security Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminPanel;
