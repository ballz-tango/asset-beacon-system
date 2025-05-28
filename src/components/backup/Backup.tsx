
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  Database, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Backup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const { toast } = useToast();

  // Mock backup data
  const backupHistory = [
    {
      id: '1',
      date: '2024-01-20T02:00:00Z',
      type: 'automatic',
      status: 'completed',
      size: '2.4 GB',
      duration: '5 minutes',
      description: 'Scheduled daily backup'
    },
    {
      id: '2',
      date: '2024-01-19T02:00:00Z',
      type: 'automatic',
      status: 'completed',
      size: '2.3 GB',
      duration: '4 minutes',
      description: 'Scheduled daily backup'
    },
    {
      id: '3',
      date: '2024-01-18T14:30:00Z',
      type: 'manual',
      status: 'completed',
      size: '2.3 GB',
      duration: '6 minutes',
      description: 'Pre-update backup'
    },
    {
      id: '4',
      date: '2024-01-17T02:00:00Z',
      type: 'automatic',
      status: 'failed',
      size: '0 GB',
      duration: '0 minutes',
      description: 'Storage space insufficient'
    }
  ];

  const systemStats = {
    totalBackups: backupHistory.length,
    successRate: Math.round((backupHistory.filter(b => b.status === 'completed').length / backupHistory.length) * 100),
    totalSize: '12.8 GB',
    lastBackup: backupHistory[0]?.date,
    nextBackup: '2024-01-21T02:00:00Z'
  };

  const handleManualBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          toast({
            title: "Backup Complete",
            description: "Manual backup completed successfully"
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleRestore = (backupId: string) => {
    setIsRestoring(true);
    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(false);
      toast({
        title: "Restore Complete",
        description: `System restored from backup ${backupId}`
      });
    }, 3000);
  };

  const handleDownloadBackup = (backupId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading backup ${backupId}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'in-progress': return <RefreshCw className="h-4 w-4 animate-spin" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backup & Restore</h1>
          <p className="text-gray-600 mt-2">
            Manage system backups and data recovery
          </p>
        </div>
        <Button 
          onClick={handleManualBackup} 
          disabled={isBackingUp}
          className="mt-4 sm:mt-0"
        >
          {isBackingUp ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Backing Up...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </>
          )}
        </Button>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalBackups}</div>
            <p className="text-xs text-muted-foreground">
              All time backups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Backup reliability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalSize}</div>
            <p className="text-xs text-muted-foreground">
              Storage used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {systemStats.lastBackup ? formatDate(systemStats.lastBackup).split(' ')[0] : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Backup Progress */}
      {isBackingUp && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-blue-900">Backup in Progress</h3>
                <span className="text-blue-700">{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="w-full" />
              <p className="text-sm text-blue-800">
                Creating backup of all system data and assets...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backup Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Backup Schedule</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Automatic Backups:</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Frequency:</span>
              <span className="text-sm text-gray-600">Daily at 2:00 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Next Backup:</span>
              <span className="text-sm text-gray-600">
                {formatDate(systemStats.nextBackup)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Retention:</span>
              <span className="text-sm text-gray-600">30 days</span>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Calendar className="h-4 w-4 mr-2" />
              Modify Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Restore Options */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5" />
              <CardTitle>Restore Options</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              Restore your system from a previous backup point.
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={isRestoring}
              >
                <Database className="h-4 w-4 mr-2" />
                Full System Restore
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={isRestoring}
              >
                <HardDrive className="h-4 w-4 mr-2" />
                Database Only
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={isRestoring}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Backup File
              </Button>
            </div>
            {isRestoring && (
              <div className="text-sm text-blue-600 mt-2">
                Restore in progress...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Encryption:</span>
              <Badge className="bg-green-100 text-green-800">AES-256</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Compression:</span>
              <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Verification:</span>
              <Badge className="bg-green-100 text-green-800">Checksum</Badge>
            </div>
            <div className="text-sm text-gray-600">
              All backups are encrypted and verified for integrity.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backupHistory.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(backup.status)}
                    <Badge className={getStatusColor(backup.status)}>
                      {backup.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium">{formatDate(backup.date)}</div>
                    <div className="text-sm text-gray-600">{backup.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{backup.size}</span>
                  <span>{backup.duration}</span>
                  <Badge variant="outline">
                    {backup.type}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  {backup.status === 'completed' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadBackup(backup.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(backup.id)}
                        disabled={isRestoring}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Backup;
