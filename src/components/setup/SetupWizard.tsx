
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Database, CheckCircle, ArrowRight, Settings, Users, Building } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState({
    company: '',
    adminEmail: '',
    adminPassword: '',
    database: 'local',
    rfidEnabled: true,
    defaultLocation: '',
    currency: 'USD'
  });
  const { completeSetup } = useAuthStore();

  const steps = [
    {
      title: 'Welcome',
      icon: Database,
      description: 'Welcome to AssetBeacon Setup'
    },
    {
      title: 'Company Info',
      icon: Building,
      description: 'Configure your organization'
    },
    {
      title: 'Admin Account',
      icon: Users,
      description: 'Create administrator account'
    },
    {
      title: 'System Settings',
      icon: Settings,
      description: 'Configure system preferences'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSetup();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Database className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AssetBeacon</h2>
              <p className="text-gray-600">
                Let's set up your enterprise asset management system. This wizard will guide you through the initial configuration.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What you'll get:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Complete asset tracking and management</li>
                <li>• RFID device integration</li>
                <li>• User management and role-based access</li>
                <li>• Workflow automation</li>
                <li>• Comprehensive reporting and analytics</li>
              </ul>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={setupData.company}
                onChange={(e) => setSetupData({ ...setupData, company: e.target.value })}
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <Label htmlFor="location">Default Location</Label>
              <Input
                id="location"
                value={setupData.defaultLocation}
                onChange={(e) => setSetupData({ ...setupData, defaultLocation: e.target.value })}
                placeholder="e.g., Main Office, Headquarters"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={setupData.currency}
                onValueChange={(value) => setSetupData({ ...setupData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminEmail">Administrator Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={setupData.adminEmail}
                onChange={(e) => setSetupData({ ...setupData, adminEmail: e.target.value })}
                placeholder="admin@company.com"
              />
            </div>
            <div>
              <Label htmlFor="adminPassword">Administrator Password</Label>
              <Input
                id="adminPassword"
                type="password"
                value={setupData.adminPassword}
                onChange={(e) => setSetupData({ ...setupData, adminPassword: e.target.value })}
                placeholder="Create a secure password"
              />
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Save these credentials securely. You'll need them to access the system.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="database">Database Storage</Label>
              <Select
                value={setupData.database}
                onValueChange={(value) => setSetupData({ ...setupData, database: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Storage (Demo)</SelectItem>
                  <SelectItem value="cloud">Cloud Database</SelectItem>
                  <SelectItem value="enterprise">Enterprise Server</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Setup Complete!</h3>
              </div>
              <p className="text-sm text-green-800">
                Your AssetBeacon system is ready to use. Click finish to start managing your assets.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>System Setup</CardTitle>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="flex space-x-2">
              {steps.map((step, index) => (
                <div key={index} className="flex-1">
                  <div className={cn(
                    "h-2 rounded-full transition-colors",
                    index <= currentStep ? "bg-blue-600" : "bg-gray-200"
                  )} />
                  <div className="mt-2">
                    <div className={cn(
                      "flex items-center space-x-2",
                      index === currentStep ? "text-blue-600" : "text-gray-500"
                    )}>
                      <step.icon className="h-4 w-4" />
                      <span className="text-xs font-medium">{step.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="min-h-[300px]">
              {renderStepContent()}
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Finish Setup' : 'Next'}
                {currentStep < steps.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupWizard;
