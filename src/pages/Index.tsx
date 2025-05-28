
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

const Index = () => {
  const { isAuthenticated, isSetupComplete } = useAuthStore();

  if (!isSetupComplete) {
    return <SetupWizard />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/assets" element={<AssetManagement />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/workflows" element={<WorkflowManagement />} />
        <Route path="/rfid" element={<RFIDDevices />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/backup" element={<Backup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default Index;
