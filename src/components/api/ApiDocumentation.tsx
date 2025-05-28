
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code2, 
  Globe, 
  Key, 
  Database,
  Zap,
  Shield,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiDocumentation = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
    
    toast({
      title: "Copied to clipboard",
      description: "API endpoint copied successfully"
    });
  };

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/assets',
      description: 'Retrieve all assets with optional filtering',
      parameters: [
        { name: 'status', type: 'string', description: 'Filter by asset status' },
        { name: 'category', type: 'string', description: 'Filter by category' },
        { name: 'location', type: 'string', description: 'Filter by location' },
        { name: 'page', type: 'number', description: 'Page number for pagination' },
        { name: 'limit', type: 'number', description: 'Number of items per page' }
      ],
      response: `{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Asset Name",
      "asset_tag": "AT001",
      "serial_number": "SN123456",
      "rfid_tag": "RF001",
      "status": "available",
      "category": "IT Equipment",
      "location": "Office A",
      "assigned_to": null,
      "purchase_date": "2024-01-15",
      "purchase_cost": 1500.00,
      "current_value": 1200.00
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}`
    },
    {
      method: 'POST',
      endpoint: '/api/assets',
      description: 'Create a new asset',
      parameters: [
        { name: 'name', type: 'string', description: 'Asset name (required)' },
        { name: 'serial_number', type: 'string', description: 'Serial number (required)' },
        { name: 'category_id', type: 'uuid', description: 'Category ID (required)' },
        { name: 'location_id', type: 'uuid', description: 'Location ID (required)' },
        { name: 'rfid_tag', type: 'string', description: 'RFID tag (optional)' }
      ],
      response: `{
  "success": true,
  "data": {
    "id": "uuid",
    "asset_tag": "AT002",
    "message": "Asset created successfully"
  }
}`
    },
    {
      method: 'PUT',
      endpoint: '/api/assets/{id}',
      description: 'Update an existing asset',
      parameters: [
        { name: 'id', type: 'uuid', description: 'Asset ID (path parameter)' },
        { name: 'name', type: 'string', description: 'Asset name' },
        { name: 'status', type: 'string', description: 'Asset status' },
        { name: 'location_id', type: 'uuid', description: 'Location ID' }
      ],
      response: `{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Asset updated successfully"
  }
}`
    },
    {
      method: 'POST',
      endpoint: '/api/assets/{id}/checkout',
      description: 'Checkout an asset to a user',
      parameters: [
        { name: 'id', type: 'uuid', description: 'Asset ID (path parameter)' },
        { name: 'assigned_to', type: 'uuid', description: 'User ID to assign asset' },
        { name: 'checkout_date', type: 'date', description: 'Checkout date' },
        { name: 'expected_checkin', type: 'date', description: 'Expected return date' },
        { name: 'notes', type: 'string', description: 'Checkout notes' }
      ],
      response: `{
  "success": true,
  "data": {
    "checkout_id": "uuid",
    "message": "Asset checked out successfully"
  }
}`
    },
    {
      method: 'POST',
      endpoint: '/api/assets/{id}/checkin',
      description: 'Checkin an asset from a user',
      parameters: [
        { name: 'id', type: 'uuid', description: 'Asset ID (path parameter)' },
        { name: 'checkin_date', type: 'date', description: 'Checkin date' },
        { name: 'condition', type: 'string', description: 'Asset condition' },
        { name: 'notes', type: 'string', description: 'Checkin notes' }
      ],
      response: `{
  "success": true,
  "data": {
    "message": "Asset checked in successfully"
  }
}`
    }
  ];

  const rfidEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/rfid/scan',
      description: 'Process RFID tag scan',
      parameters: [
        { name: 'tag_id', type: 'string', description: 'RFID tag identifier' },
        { name: 'reader_id', type: 'string', description: 'RFID reader device ID' },
        { name: 'location', type: 'string', description: 'Scan location' },
        { name: 'timestamp', type: 'datetime', description: 'Scan timestamp' }
      ],
      response: `{
  "success": true,
  "data": {
    "asset": {
      "id": "uuid",
      "name": "Laptop Dell XPS",
      "asset_tag": "AT001",
      "status": "available"
    },
    "action": "located",
    "message": "Asset located successfully"
  }
}`
    },
    {
      method: 'GET',
      endpoint: '/api/rfid/devices',
      description: 'Get all RFID reader devices',
      parameters: [],
      response: `{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Main Entrance Reader",
      "device_id": "RFID001",
      "location": "Building A - Entrance",
      "status": "online",
      "last_seen": "2024-01-20T10:30:00Z"
    }
  ]
}`
    },
    {
      method: 'POST',
      endpoint: '/api/rfid/bulk-scan',
      description: 'Process multiple RFID scans for inventory',
      parameters: [
        { name: 'scans', type: 'array', description: 'Array of scan objects' },
        { name: 'audit_id', type: 'uuid', description: 'Audit session ID' },
        { name: 'location', type: 'string', description: 'Audit location' }
      ],
      response: `{
  "success": true,
  "data": {
    "processed": 25,
    "found": 23,
    "missing": 2,
    "unknown": 0,
    "audit_id": "uuid"
  }
}`
    }
  ];

  const authenticationInfo = `
// API Authentication using Bearer Token
const headers = {
  'Authorization': 'Bearer YOUR_API_TOKEN',
  'Content-Type': 'application/json'
};

// Example request
fetch('/api/assets', {
  method: 'GET',
  headers: headers
})
.then(response => response.json())
.then(data => console.log(data));
`;

  const middlewareExample = `
// RFID Middleware Integration Example
const RFIDMiddleware = {
  // Initialize connection to RFID reader
  connect: async (deviceId) => {
    const response = await fetch('/api/rfid/devices/' + deviceId + '/connect', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiToken,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Process tag scan
  processScan: async (tagId, readerId) => {
    const scanData = {
      tag_id: tagId,
      reader_id: readerId,
      timestamp: new Date().toISOString(),
      location: await getReaderLocation(readerId)
    };

    const response = await fetch('/api/rfid/scan', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scanData)
    });

    return response.json();
  },

  // Bulk inventory scan
  bulkInventory: async (scans, auditId) => {
    const response = await fetch('/api/rfid/bulk-scan', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        scans: scans,
        audit_id: auditId,
        location: getCurrentLocation()
      })
    });

    return response.json();
  }
};
`;

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-orange-100 text-orange-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <p className="text-gray-600 mt-2">
            RESTful API for asset management and RFID integration
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Code2 className="h-4 w-4 mr-2" />
            Download SDK
          </Button>
          <Button>
            <Key className="h-4 w-4 mr-2" />
            Generate API Key
          </Button>
        </div>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">Asset APIs</TabsTrigger>
          <TabsTrigger value="rfid">RFID APIs</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="middleware">Middleware</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Asset Management Endpoints</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.endpoint, endpoint.endpoint)}
                      >
                        {copiedEndpoint === endpoint.endpoint ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{endpoint.description}</p>
                    
                    {endpoint.parameters.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-medium mb-2">Parameters:</h4>
                        <div className="space-y-1">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <div key={paramIndex} className="flex items-center space-x-2 text-sm">
                              <code className="bg-blue-50 text-blue-700 px-1 rounded">{param.name}</code>
                              <span className="text-gray-500">({param.type})</span>
                              <span className="text-gray-600">- {param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-2">Response:</h4>
                      <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                        <code>{endpoint.response}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>RFID Integration Endpoints</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {rfidEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.endpoint, endpoint.endpoint)}
                      >
                        {copiedEndpoint === endpoint.endpoint ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{endpoint.description}</p>
                    
                    {endpoint.parameters.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-medium mb-2">Parameters:</h4>
                        <div className="space-y-1">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <div key={paramIndex} className="flex items-center space-x-2 text-sm">
                              <code className="bg-blue-50 text-blue-700 px-1 rounded">{param.name}</code>
                              <span className="text-gray-500">({param.type})</span>
                              <span className="text-gray-600">- {param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-2">Response:</h4>
                      <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                        <code>{endpoint.response}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Authentication & Authorization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">API Token Authentication</h3>
                  <p className="text-gray-600 mb-3">
                    All API requests require a valid Bearer token in the Authorization header.
                  </p>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                    <code>{authenticationInfo}</code>
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Rate Limiting</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>1000 requests per hour for authenticated users</li>
                    <li>10,000 requests per hour for premium accounts</li>
                    <li>Rate limit headers included in all responses</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Error Codes</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">401</Badge>
                      <span>Unauthorized - Invalid or missing API token</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">403</Badge>
                      <span>Forbidden - Insufficient permissions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">429</Badge>
                      <span>Too Many Requests - Rate limit exceeded</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="middleware" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>RFID Middleware Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">JavaScript SDK Example</h3>
                  <p className="text-gray-600 mb-3">
                    Complete middleware integration example for RFID hardware connectivity.
                  </p>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                    <code>{middlewareExample}</code>
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Supported RFID Protocols</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded p-3">
                      <h4 className="font-medium">ISO 14443 Type A/B</h4>
                      <p className="text-sm text-gray-600">NFC-compatible tags</p>
                    </div>
                    <div className="border rounded p-3">
                      <h4 className="font-medium">ISO 15693</h4>
                      <p className="text-sm text-gray-600">Long-range RFID tags</p>
                    </div>
                    <div className="border rounded p-3">
                      <h4 className="font-medium">EPC Gen2</h4>
                      <p className="text-sm text-gray-600">UHF RFID standard</p>
                    </div>
                    <div className="border rounded p-3">
                      <h4 className="font-medium">Custom Protocols</h4>
                      <p className="text-sm text-gray-600">Proprietary formats</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Integration Steps</h3>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Generate API key from the settings panel</li>
                    <li>Configure RFID reader connection parameters</li>
                    <li>Implement tag scanning event handlers</li>
                    <li>Process scan results through the API</li>
                    <li>Handle asset location updates and audit trails</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDocumentation;
