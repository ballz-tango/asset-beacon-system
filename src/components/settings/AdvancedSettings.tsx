
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Database, 
  Code, 
  Globe, 
  Shield,
  AlertTriangle,
  Save,
  RotateCcw,
  Settings2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SystemStatus from '../system/SystemStatus';
import AuditLog from '../system/AuditLog';

interface AlertThresholds {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

const AdvancedSettings = () => {
  const { toast } = useToast();
  
  const [advancedSettings, setAdvancedSettings] = useState({
    // Database Settings
    maxConnections: 100,
    queryTimeout: 30000,
    connectionPoolSize: 10,
    enableQueryLogging: false,
    
    // API Settings
    apiRateLimit: 1000,
    apiTimeout: 30000,
    enableCors: true,
    allowedOrigins: 'https://yourapp.com,https://app.example.com',
    
    // Performance Settings
    cacheSize: 256,
    cacheTimeout: 3600,
    enableCompression: true,
    enableCdn: false,
    
    // Monitoring
    enableMetrics: true,
    metricsRetention: 30,
    enableAlerts: true,
    alertThresholds: {
      cpuUsage: 80,
      memoryUsage: 85,
      diskUsage: 90
    } as AlertThresholds,
    
    // Custom CSS/JS
    customCss: '',
    customJs: '',
    
    // Feature Flags
    experimentalFeatures: false,
    betaFeatures: false,
    maintenanceMode: false
  });

  const updateSetting = (key: string, value: any) => {
    setAdvancedSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedSetting = (parent: keyof typeof advancedSettings, key: string, value: any) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as object),
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    toast({
      title: "Advanced Settings Saved",
      description: "Advanced configuration has been updated successfully"
    });
  };

  const handleReset = () => {
    toast({
      title: "Settings Reset",
      description: "Advanced settings have been reset to defaults"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure advanced system parameters and monitoring
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        {/* System Status */}
        <TabsContent value="system">
          <SystemStatus />
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <CardTitle>Database Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maxConnections">Max Connections</Label>
                  <Input
                    id="maxConnections"
                    type="number"
                    value={advancedSettings.maxConnections}
                    onChange={(e) => updateSetting('maxConnections', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="queryTimeout">Query Timeout (ms)</Label>
                  <Input
                    id="queryTimeout"
                    type="number"
                    value={advancedSettings.queryTimeout}
                    onChange={(e) => updateSetting('queryTimeout', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="connectionPoolSize">Connection Pool Size</Label>
                  <Input
                    id="connectionPoolSize"
                    type="number"
                    value={advancedSettings.connectionPoolSize}
                    onChange={(e) => updateSetting('connectionPoolSize', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Query Logging</Label>
                  <p className="text-sm text-gray-500">Log all database queries for debugging</p>
                </div>
                <Switch
                  checked={advancedSettings.enableQueryLogging}
                  onCheckedChange={(checked) => updateSetting('enableQueryLogging', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <CardTitle>API Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="apiRateLimit">Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={advancedSettings.apiRateLimit}
                    onChange={(e) => updateSetting('apiRateLimit', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="apiTimeout">API Timeout (ms)</Label>
                  <Input
                    id="apiTimeout"
                    type="number"
                    value={advancedSettings.apiTimeout}
                    onChange={(e) => updateSetting('apiTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="allowedOrigins">Allowed Origins (CORS)</Label>
                <Input
                  id="allowedOrigins"
                  value={advancedSettings.allowedOrigins}
                  onChange={(e) => updateSetting('allowedOrigins', e.target.value)}
                  placeholder="https://example.com,https://app.example.com"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable CORS</Label>
                  <p className="text-sm text-gray-500">Allow cross-origin requests</p>
                </div>
                <Switch
                  checked={advancedSettings.enableCors}
                  onCheckedChange={(checked) => updateSetting('enableCors', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring */}
        <TabsContent value="monitoring">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Performance Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="cpuThreshold">CPU Alert Threshold (%)</Label>
                    <Input
                      id="cpuThreshold"
                      type="number"
                      value={advancedSettings.alertThresholds.cpuUsage}
                      onChange={(e) => updateNestedSetting('alertThresholds', 'cpuUsage', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="memoryThreshold">Memory Alert Threshold (%)</Label>
                    <Input
                      id="memoryThreshold"
                      type="number"
                      value={advancedSettings.alertThresholds.memoryUsage}
                      onChange={(e) => updateNestedSetting('alertThresholds', 'memoryUsage', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="diskThreshold">Disk Alert Threshold (%)</Label>
                    <Input
                      id="diskThreshold"
                      type="number"
                      value={advancedSettings.alertThresholds.diskUsage}
                      onChange={(e) => updateNestedSetting('alertThresholds', 'diskUsage', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Metrics Collection</Label>
                      <p className="text-sm text-gray-500">Collect system performance metrics</p>
                    </div>
                    <Switch
                      checked={advancedSettings.enableMetrics}
                      onCheckedChange={(checked) => updateSetting('enableMetrics', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Alerts</Label>
                      <p className="text-sm text-gray-500">Send alerts when thresholds are exceeded</p>
                    </div>
                    <Switch
                      checked={advancedSettings.enableAlerts}
                      onCheckedChange={(checked) => updateSetting('enableAlerts', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <AuditLog />
          </div>
        </TabsContent>

        {/* Custom Code */}
        <TabsContent value="custom">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <CardTitle>Custom Code</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="customCss">Custom CSS</Label>
                  <Textarea
                    id="customCss"
                    value={advancedSettings.customCss}
                    onChange={(e) => updateSetting('customCss', e.target.value)}
                    placeholder="/* Add your custom CSS here */"
                    className="font-mono text-sm h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customJs">Custom JavaScript</Label>
                  <Textarea
                    id="customJs"
                    value={advancedSettings.customJs}
                    onChange={(e) => updateSetting('customJs', e.target.value)}
                    placeholder="// Add your custom JavaScript here"
                    className="font-mono text-sm h-32"
                  />
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Warning</p>
                      <p className="text-sm text-yellow-700">
                        Custom code can affect system performance and security. Only add trusted code.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings2 className="h-5 w-5" />
                  <CardTitle>Feature Flags</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Experimental Features</Label>
                    <p className="text-sm text-gray-500">Enable experimental functionality</p>
                  </div>
                  <Switch
                    checked={advancedSettings.experimentalFeatures}
                    onCheckedChange={(checked) => updateSetting('experimentalFeatures', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Beta Features</Label>
                    <p className="text-sm text-gray-500">Access beta functionality</p>
                  </div>
                  <Switch
                    checked={advancedSettings.betaFeatures}
                    onCheckedChange={(checked) => updateSetting('betaFeatures', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Put system in maintenance mode</p>
                  </div>
                  <Switch
                    checked={advancedSettings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSettings;
