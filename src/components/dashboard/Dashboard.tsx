
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Archive, 
  Users, 
  Key, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAssetStore } from '@/stores/assetStore';
import { useAuthStore } from '@/stores/authStore';

const Dashboard = () => {
  const { assets } = useAssetStore();
  const { user } = useAuthStore();

  const totalAssets = assets.length;
  const availableAssets = assets.filter(a => a.status === 'available').length;
  const inUseAssets = assets.filter(a => a.status === 'in-use').length;
  const maintenanceAssets = assets.filter(a => a.status === 'maintenance').length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  const recentActivity = [
    { action: 'Asset Created', item: 'MacBook Pro #12345', time: '2 hours ago', type: 'create' },
    { action: 'RFID Scan', item: 'Office Chair #98765', time: '4 hours ago', type: 'scan' },
    { action: 'Asset Updated', item: 'Server Rack #11111', time: '6 hours ago', type: 'update' },
    { action: 'User Login', item: 'John Doe', time: '8 hours ago', type: 'login' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scan': return <Key className="h-4 w-4 text-blue-600" />;
      case 'update': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'login': return <Users className="h-4 w-4 text-purple-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}. Here's what's happening with your assets today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableAssets}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((availableAssets / totalAssets) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inUseAssets}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((inUseAssets / totalAssets) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Asset portfolio value
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{availableAssets}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {Math.round((availableAssets / totalAssets) * 100)}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">In Use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{inUseAssets}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {Math.round((inUseAssets / totalAssets) * 100)}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Maintenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{maintenanceAssets}</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {Math.round((maintenanceAssets / totalAssets) * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.item}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {maintenanceAssets > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Maintenance Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800 mb-4">
              {maintenanceAssets} asset{maintenanceAssets > 1 ? 's' : ''} require{maintenanceAssets === 1 ? 's' : ''} maintenance attention.
            </p>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
              View Maintenance Queue
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
