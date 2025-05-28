
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isSetupComplete: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  completeSetup: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isSetupComplete: localStorage.getItem('setup_complete') === 'true',
      
      login: async (email: string, password: string) => {
        // Enhanced authentication with role-based access
        if (email === 'admin@company.com' && password === 'admin123') {
          const user: User = {
            id: '1',
            email,
            name: 'System Administrator',
            role: 'super-admin',
            permissions: ['all'],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          set({ user, isAuthenticated: true });
          return true;
        }
        
        // Additional demo accounts for different roles
        if (email === 'manager@company.com' && password === 'manager123') {
          const user: User = {
            id: '2',
            email,
            name: 'Asset Manager',
            role: 'manager',
            permissions: ['assets.create', 'assets.read', 'assets.update', 'assets.checkout', 'assets.checkin', 'users.read', 'users.update', 'reports.assets', 'rfid.scan'],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          set({ user, isAuthenticated: true });
          return true;
        }
        
        if (email === 'operator@company.com' && password === 'operator123') {
          const user: User = {
            id: '3',
            email,
            name: 'Asset Operator',
            role: 'operator',
            permissions: ['assets.read', 'assets.checkout', 'assets.checkin', 'rfid.scan'],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          set({ user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      completeSetup: () => {
        localStorage.setItem('setup_complete', 'true');
        set({ isSetupComplete: true });
      },
      
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
