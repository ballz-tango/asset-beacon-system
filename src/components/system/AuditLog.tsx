
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';

const AuditLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const auditLogs = [
    {
      id: '1',
      timestamp: '2024-01-20T15:30:00Z',
      user: 'admin@company.com',
      action: 'USER_LOGIN',
      resource: 'Authentication',
      details: 'User logged in successfully',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: '2024-01-20T15:25:00Z',
      user: 'john.doe@company.com',
      action: 'ASSET_CREATED',
      resource: 'MacBook Pro #12345',
      details: 'New asset created with ID: AST-12345',
      severity: 'success',
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      timestamp: '2024-01-20T15:20:00Z',
      user: 'jane.smith@company.com',
      action: 'RFID_SCAN_FAILED',
      resource: 'RFID Reader #001',
      details: 'Failed to read RFID tag RF001234',
      severity: 'warning',
      ipAddress: '192.168.1.102'
    },
    {
      id: '4',
      timestamp: '2024-01-20T15:15:00Z',
      user: 'system',
      action: 'BACKUP_COMPLETED',
      resource: 'System Backup',
      details: 'Automated backup completed successfully',
      severity: 'success',
      ipAddress: 'localhost'
    },
    {
      id: '5',
      timestamp: '2024-01-20T15:10:00Z',
      user: 'admin@company.com',
      action: 'SETTINGS_UPDATED',
      resource: 'System Settings',
      details: 'Updated RFID scan interval to 30 seconds',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: '6',
      timestamp: '2024-01-20T15:05:00Z',
      user: 'mike.wilson@company.com',
      action: 'LOGIN_FAILED',
      resource: 'Authentication',
      details: 'Failed login attempt - invalid password',
      severity: 'error',
      ipAddress: '192.168.1.103'
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || log.severity === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterType === 'error' ? 'default' : 'outline'}
                onClick={() => setFilterType('error')}
                size="sm"
              >
                Errors
              </Button>
              <Button
                variant={filterType === 'warning' ? 'default' : 'outline'}
                onClick={() => setFilterType('warning')}
                size="sm"
              >
                Warnings
              </Button>
              <Button
                variant={filterType === 'info' ? 'default' : 'outline'}
                onClick={() => setFilterType('info')}
                size="sm"
              >
                Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getSeverityIcon(log.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900">{log.action.replace(/_/g, ' ')}</p>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{log.user}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-3 w-3" />
                          <span>{log.resource}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
