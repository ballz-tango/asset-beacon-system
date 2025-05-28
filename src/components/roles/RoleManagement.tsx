
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Lock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useRoleStore, Role, Permission } from '@/stores/roleStore';
import { useToast } from '@/hooks/use-toast';

const RoleManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const { roles, permissions, createRole, updateRole, deleteRole, assignPermission, removePermission } = useRoleStore();
  const { toast } = useToast();

  useEffect(() => {
    if (editingRole) {
      setFormData({
        name: editingRole.name,
        description: editingRole.description,
        permissions: editingRole.permissions
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: []
      });
    }
  }, [editingRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRole) {
      updateRole(editingRole.id, {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      });
      toast({
        title: "Role Updated",
        description: "Role has been updated successfully"
      });
    } else {
      createRole({
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        isSystemRole: false
      });
      toast({
        title: "Role Created",
        description: "New role has been created successfully"
      });
    }
    
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDelete = (roleId: string) => {
    deleteRole(roleId);
    toast({
      title: "Role Deleted",
      description: "Role has been removed from the system"
    });
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permissionId)
      }));
    }
  };

  const groupedPermissions = permissions.reduce((groups, permission) => {
    const group = permission.resource;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  const getRoleColor = (role: Role) => {
    if (role.isSystemRole) {
      switch (role.name) {
        case 'Super Administrator': return 'bg-red-100 text-red-800';
        case 'Administrator': return 'bg-orange-100 text-orange-800';
        case 'Asset Manager': return 'bg-blue-100 text-blue-800';
        case 'Asset Operator': return 'bg-green-100 text-green-800';
        case 'Asset Viewer': return 'bg-gray-100 text-gray-800';
        default: return 'bg-purple-100 text-purple-800';
      }
    }
    return 'bg-indigo-100 text-indigo-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage user roles and permissions
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRole(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              Active role definitions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Roles</CardTitle>
            <Lock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {roles.filter(r => r.isSystemRole).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Built-in roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Roles</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {roles.filter(r => !r.isSystemRole).length}
            </div>
            <p className="text-xs text-muted-foreground">
              User-defined roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Available permissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{role.name}</span>
                    {role.isSystemRole && <Lock className="h-4 w-4 text-gray-500" />}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                </div>
                <Badge className={getRoleColor(role)}>
                  {role.isSystemRole ? 'System' : 'Custom'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Permissions ({role.permissions.length})</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 6).map((permId) => {
                    const permission = permissions.find(p => p.id === permId);
                    return permission ? (
                      <Badge key={permId} variant="outline" className="text-xs">
                        {permission.action}
                      </Badge>
                    ) : null;
                  })}
                  {role.permissions.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(role)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {!role.isSystemRole && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(role.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {roles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roles defined</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first role with specific permissions
            </p>
            <Button
              onClick={() => {
                setEditingRole(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Role
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter role name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role's purpose and responsibilities"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-base font-medium">Permissions</Label>
              <p className="text-sm text-gray-600 mb-4">
                Select the permissions that users with this role should have
              </p>
              
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                  <div key={resource} className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-3 capitalize">{resource} Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resourcePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={permission.id}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {permission.name}
                            </Label>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
