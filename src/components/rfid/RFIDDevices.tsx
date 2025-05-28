
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Key, 
  Wifi,
  WifiOff,
  Settings,
  Activity,
  Zap,
  Signal,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RFIDDevices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock RFID device data
  const rfidDevices = [
    {
      id: '1',
      name: 'Main Entrance Reader',
      model: 'Impinj R420',
      serialNumber: 'IMP-420-001',
      ipAddress: '192.168.1.101',
      status: 'online',
      location: 'Building A - Main Entrance',
      signalStrength: 95,
      lastSeen: '2024-01-20T15:30:00Z',
      tagsRead: 1250,
      batteryLevel: null,
      firmwareVersion: '2.1.3'
    },
    {
      id: '2',
      name: 'Warehouse Scanner',
      model: 'Zebra FX9600',
      serialNumber: 'ZEB-FX9600-002',
      ipAddress: '192.168.1.102',
      status: 'online',
      location: 'Warehouse A - Section 1',
      signalStrength: 88,
      lastSeen: '2024-01-20T15:28:00Z',
      tagsRead: 2847,
      batteryLevel: null,
      firmwareVersion: '3.2.1'
    },
    {
      id: '3',
      name: 'Mobile Scanner #1',
      model: 'Honeywell CT40',
      serialNumber: 'HON-CT40-003',
      ipAddress: null,
      status: 'offline',
      location: 'Mobile Device',
      signalStrength: 0,
      lastSeen: '2024-01-20T12:15:00Z',
      tagsRead: 456,
      batteryLevel: 23,
      firmwareVersion: '1.8.7'
    },
    {
      id: '4',
      name: 'Office Asset Reader',
      model: 'ThingMagic M6',
      serialNumber: 'TM-M6-004',
      ipAddress: '192.168.1.104',
      status: 'maintenance',
      location: 'Office Floor 2',
      signalStrength: 72,
      lastSeen: '2024-01-19T09:45:00Z',
      tagsRead: 789,
      batteryLevel: null,
      firmwareVersion: '4.1.2'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="h-4 w-4" />;
      case 'offline': return <WifiOff className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25);
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 h-${2 + i} rounded-sm ${
          i < bars ? 'bg-green-500' : 'bg-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleDeviceAction = (deviceId: string, action: string) => {
    toast({
      title: `Device ${action}`,
      description: `Action ${action} executed on device ${deviceId}`
    });
  };

  const simulateRFIDScan = () => {
    const sampleData = [
      { tag: 'RF001234', asset: 'MacBook Pro #12345' },
      { tag: 'RF005678', asset: 'Office Chair #98765' },
      { tag: 'RF009012', asset: 'Printer Canon #11111' }
    ];
    
    const randomScan = sampleData[Math.floor(Math.random() * sampleData.length)];
    
    toast({
      title: "RFID Tag Detected",
      description: `Tag ${randomScan.tag} - ${randomScan.asset}`,
      duration: 5000
    });
  };

  const filteredDevices = rfidDevices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineDevices = rfidDevices.filter(d => d.status === 'online').length;
  const totalTags = rfidDevices.reduce((sum, d) => sum + d.tagsRead, 0);
  const averageSignal = Math.round(
    rfidDevices.filter(d => d.status === 'online').reduce((sum, d) => sum + d.signalStrength, 0) / onlineDevices
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RFID Devices</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage RFID readers and scanners
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={simulateRFIDScan}>
            <Activity className="h-4 w-4 mr-2" />
            Test Scan
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Devices</CardTitle>
            <Wifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineDevices}</div>
            <p className="text-xs text-muted-foreground">
              Out of {rfidDevices.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags Read Today</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTags.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all devices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Signal</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageSignal}%</div>
            <p className="text-xs text-muted-foreground">
              Signal strength
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search RFID devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter Status</Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDevices.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                  <p className="text-sm text-gray-600">{device.model}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(device.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(device.status)}
                      <span>{device.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Serial Number:</span>
                  <span className="text-gray-600 font-mono">{device.serialNumber}</span>
                </div>
                {device.ipAddress && (
                  <div className="flex justify-between">
                    <span>IP Address:</span>
                    <span className="text-gray-600 font-mono">{device.ipAddress}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-gray-600">{device.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Firmware:</span>
                  <span className="text-gray-600">{device.firmwareVersion}</span>
                </div>
              </div>

              {/* Signal Strength & Battery */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Signal:</span>
                  <div className="flex items-end space-x-0.5 h-4">
                    {getSignalBars(device.signalStrength)}
                  </div>
                  <span className="text-sm text-gray-600">{device.signalStrength}%</span>
                </div>
                
                {device.batteryLevel !== null && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Battery:</span>
                    <div className={`w-12 h-2 border rounded-sm ${
                      device.batteryLevel > 20 ? 'border-green-300' : 'border-red-300'
                    }`}>
                      <div 
                        className={`h-full rounded-sm ${
                          device.batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${device.batteryLevel}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{device.batteryLevel}%</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{device.tagsRead}</div>
                  <div className="text-xs text-gray-500">Tags Read</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Last Seen</div>
                  <div className="text-sm font-medium">{formatDate(device.lastSeen)}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleDeviceAction(device.id, 'configure')}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleDeviceAction(device.id, 'test')}
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Test
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeviceAction(device.id, 'reboot')}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RFIDDevices;
