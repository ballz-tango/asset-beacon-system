
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Play, 
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Users,
  Calendar
} from 'lucide-react';

const WorkflowManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock workflow data
  const workflows = [
    {
      id: '1',
      name: 'Asset Onboarding',
      description: 'Complete workflow for adding new assets to the system',
      status: 'active',
      trigger: 'manual',
      steps: [
        'Asset Information Collection',
        'RFID Tag Assignment',
        'Location Assignment',
        'Documentation Upload',
        'Quality Check',
        'System Registration'
      ],
      completedInstances: 45,
      pendingInstances: 3,
      lastRun: '2024-01-20T14:30:00Z',
      createdBy: 'John Smith',
      createdAt: '2023-12-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Asset Maintenance Request',
      description: 'Process for requesting and scheduling asset maintenance',
      status: 'active',
      trigger: 'automatic',
      steps: [
        'Maintenance Request Submission',
        'Manager Approval',
        'Technician Assignment',
        'Maintenance Scheduling',
        'Work Completion',
        'Asset Status Update'
      ],
      completedInstances: 28,
      pendingInstances: 7,
      lastRun: '2024-01-19T09:15:00Z',
      createdBy: 'Sarah Johnson',
      createdAt: '2023-11-15T14:20:00Z'
    },
    {
      id: '3',
      name: 'Asset Disposal',
      description: 'End-of-life asset disposal and documentation process',
      status: 'draft',
      trigger: 'manual',
      steps: [
        'Disposal Request',
        'Asset Evaluation',
        'Data Wiping',
        'Environmental Compliance Check',
        'Disposal Execution',
        'Documentation & Reporting'
      ],
      completedInstances: 12,
      pendingInstances: 1,
      lastRun: '2024-01-15T11:45:00Z',
      createdBy: 'Mike Wilson',
      createdAt: '2024-01-10T16:30:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeWorkflows = workflows.filter(w => w.status === 'active').length;
  const totalInstances = workflows.reduce((sum, w) => sum + w.completedInstances + w.pendingInstances, 0);
  const pendingInstances = workflows.reduce((sum, w) => sum + w.pendingInstances, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Management</h1>
          <p className="text-gray-600 mt-2">
            Design and manage automated business processes
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstances}</div>
            <p className="text-xs text-muted-foreground">
              All time executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingInstances}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <p className="text-xs text-muted-foreground">
              Completion rate
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
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter Status</Button>
            <Button variant="outline">Templates</Button>
          </div>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-xl">{workflow.name}</CardTitle>
                    <Badge className={getStatusColor(workflow.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(workflow.status)}
                        <span>{workflow.status}</span>
                      </div>
                    </Badge>
                    <Badge variant="outline">
                      {workflow.trigger}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{workflow.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Run
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Workflow Steps */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Workflow Steps</h4>
                  <div className="space-y-2">
                    {workflow.steps.slice(0, 4).map((step, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                    {workflow.steps.length > 4 && (
                      <div className="text-sm text-gray-500 ml-8">
                        +{workflow.steps.length - 4} more steps
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{workflow.completedInstances}</div>
                      <div className="text-xs text-green-800">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{workflow.pendingInstances}</div>
                      <div className="text-xs text-orange-800">Pending</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Last Run:</span>
                      <span className="text-gray-600">{formatDate(workflow.lastRun)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created By:</span>
                      <span className="text-gray-600">{workflow.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="text-gray-600">{formatDate(workflow.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Tasks Alert */}
      {pendingInstances > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Pending Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800 mb-4">
              There are {pendingInstances} workflow task{pendingInstances > 1 ? 's' : ''} waiting for your attention.
            </p>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
              View Pending Tasks
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowManagement;
