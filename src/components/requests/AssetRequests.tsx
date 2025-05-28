
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  Package,
  User,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

interface AssetRequest {
  id: string;
  requestedBy: string;
  requestedByName: string;
  assetType: string;
  description: string;
  justification: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestDate: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

const AssetRequests = () => {
  const [requests, setRequests] = useState<AssetRequest[]>([
    {
      id: '1',
      requestedBy: 'operator@company.com',
      requestedByName: 'Asset Operator',
      assetType: 'Laptop',
      description: 'High-performance laptop for development work',
      justification: 'Current laptop is too slow for development tasks',
      urgency: 'high',
      status: 'pending',
      requestDate: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      requestedBy: 'manager@company.com',
      requestedByName: 'Asset Manager',
      assetType: 'Monitor',
      description: '27-inch 4K monitor for design work',
      justification: 'Need larger screen for detailed design work',
      urgency: 'medium',
      status: 'approved',
      requestDate: '2024-01-18T14:30:00Z',
      approvedBy: 'admin@company.com',
      approvedDate: '2024-01-19T09:00:00Z'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetType: '',
    description: '',
    justification: '',
    urgency: 'medium' as 'low' | 'medium' | 'high'
  });

  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: AssetRequest = {
      id: Date.now().toString(),
      requestedBy: user?.email || '',
      requestedByName: user?.name || '',
      assetType: formData.assetType,
      description: formData.description,
      justification: formData.justification,
      urgency: formData.urgency,
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    setRequests(prev => [newRequest, ...prev]);
    setIsDialogOpen(false);
    setFormData({
      assetType: '',
      description: '',
      justification: '',
      urgency: 'medium'
    });

    toast({
      title: "Request Submitted",
      description: "Your asset request has been submitted for approval"
    });
  };

  const handleStatusChange = (requestId: string, newStatus: AssetRequest['status']) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: newStatus,
            approvedBy: newStatus === 'approved' ? user?.email : undefined,
            approvedDate: newStatus === 'approved' ? new Date().toISOString() : undefined
          }
        : req
    ));

    toast({
      title: "Request Updated",
      description: `Request has been ${newStatus}`
    });
  };

  const getStatusColor = (status: AssetRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'fulfilled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: AssetRequest['urgency']) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isAdmin = user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Requests</h1>
          <p className="text-gray-600 mt-2">
            Submit and manage asset requests
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Request Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === 'fulfilled').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{request.assetType}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency} priority
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{request.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{request.justification}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{request.requestedByName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {isAdmin && request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(request.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(request.id, 'rejected')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
                
                {isAdmin && request.status === 'approved' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(request.id, 'fulfilled')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Mark Fulfilled
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Asset Request</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <Label htmlFor="assetType">Asset Type</Label>
              <Input
                id="assetType"
                value={formData.assetType}
                onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                required
                placeholder="e.g., Laptop, Monitor, Printer"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Detailed description of the asset needed"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="justification">Business Justification</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                required
                placeholder="Why do you need this asset?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <select
                id="urgency"
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetRequests;
