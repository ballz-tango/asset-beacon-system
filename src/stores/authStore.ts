
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
        // Mock authentication - in real app, this would call your API
        if (email === 'admin@company.com' && password === 'admin123') {
          const user: User = {
            id: '1',
            email,
            name: 'System Administrator',
            role: 'admin',
            permissions: ['all'],
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
