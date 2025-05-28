
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Database, 
  Server, 
  Wifi, 
  HardDrive,
  Cpu,
  MemoryStick,
  RefreshCw
} from 'lucide-react';

const SystemStatus = () => {
  const systemMetrics = {
    uptime: '15 days, 3 hours',
    cpuUsage: 23,
    memoryUsage: 67,
    diskUsage: 45,
    networkStatus: 'Connected',
    databaseStatus: 'Online',
    lastBackup: '2024-01-20 15:30:00',
    activeUsers: 12,
    totalAssets: 1847,
    rfidDevicesOnline: 3
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'offline':
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage > 80) return 'bg-red-500';
    if (usage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Status</h2>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.cpuUsage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getUsageColor(systemMetrics.cpuUsage)}`}
                style={{ width: `${systemMetrics.cpuUsage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.memoryUsage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getUsageColor(systemMetrics.memoryUsage)}`}
                style={{ width: `${systemMetrics.memoryUsage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.diskUsage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getUsageColor(systemMetrics.diskUsage)}`}
                style={{ width: `${systemMetrics.diskUsage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{systemMetrics.uptime}</div>
            <p className="text-xs text-muted-foreground">System uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-gray-500">PostgreSQL</p>
                </div>
              </div>
              <Badge className={getStatusColor(systemMetrics.databaseStatus)}>
                {systemMetrics.databaseStatus}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Wifi className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Network</p>
                  <p className="text-sm text-gray-500">Internet Connection</p>
                </div>
              </div>
              <Badge className={getStatusColor(systemMetrics.networkStatus)}>
                {systemMetrics.networkStatus}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Server className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">RFID Devices</p>
                  <p className="text-sm text-gray-500">{systemMetrics.rfidDevicesOnline} online</p>
                </div>
              </div>
              <Badge className={getStatusColor('online')}>
                Online
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{systemMetrics.activeUsers}</div>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{systemMetrics.totalAssets.toLocaleString()}</div>
              <p className="text-sm text-gray-500">Total Assets</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{systemMetrics.rfidDevicesOnline}</div>
              <p className="text-sm text-gray-500">RFID Devices</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatus;
