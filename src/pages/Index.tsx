
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import LoginPage from '@/components/auth/LoginPage';
import SetupWizard from '@/components/setup/SetupWizard';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/components/dashboard/Dashboard';
import AssetManagement from '@/components/assets/AssetManagement';
import InventoryManagement from '@/components/inventory/InventoryManagement';
import UserManagement from '@/components/users/UserManagement';
import WorkflowManagement from '@/components/workflows/WorkflowManagement';
import RFIDDevices from '@/components/rfid/RFIDDevices';
import Settings from '@/components/settings/Settings';
import Backup from '@/components/backup/Backup';
import RoleManagement from '@/components/roles/RoleManagement';
import SuperAdminPanel from '@/components/admin/SuperAdminPanel';
import ApiDocumentation from '@/components/api/ApiDocumentation';
import FileManagement from '@/components/files/FileManagement';
import AssetRequests from '@/components/requests/AssetRequests';
import DeploymentScripts from '@/components/deployment/DeploymentScripts';

const Index = () => {
  const { isAuthenticated, isSetupComplete } = useAuthStore();

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // If authenticated but setup not complete, show setup wizard
  if (!isSetupComplete) {
    return <SetupWizard />;
  }

  // Main application routes
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assets" element={<AssetManagement />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/workflows" element={<WorkflowManagement />} />
        <Route path="/rfid" element={<RFIDDevices />} />
        <Route path="/files" element={<FileManagement />} />
        <Route path="/requests" element={<AssetRequests />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/backup" element={<Backup />} />
        <Route path="/admin" element={<SuperAdminPanel />} />
        <Route path="/api-docs" element={<ApiDocumentation />} />
        <Route path="/deployment" element={<DeploymentScripts />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default Index;
