
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../types';
import { hasPermission as checkPermission, Feature } from '../services/permissionsService';
// Supabase and authService are no longer needed for the mock implementation.

interface AuthState {
  user: User | null;
  loading: boolean;
  hasPermission: (feature: Feature) => boolean;
  incrementGenerationsUsed: (count: number) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Mock user with the 'brand' plan to match UI screenshot
const mockUser: User = {
  id: 'mock-user-brand-456',
  email: 'premium.user@virtualstudio.ai',
  plan: 'brand',
  generationsUsed: 0,
  dailyGenerationsUsed: 0,
  lastGenerationDate: new Date().toISOString().split('T')[0],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [loading] = useState(false); // No loading state needed for a mock user.

  const hasPermission = (feature: Feature): boolean => {
      if (!user) return false;
      return checkPermission(user.plan, feature);
  };

  const incrementGenerationsUsed = async (count: number) => {
      if (!user) return;
      
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = user.lastGenerationDate !== today;

      const newDailyCount = isNewDay ? count : user.dailyGenerationsUsed + count;
      const newMonthlyCount = user.generationsUsed + count;
      
      setUser({ 
        ...user, 
        generationsUsed: newMonthlyCount,
        dailyGenerationsUsed: newDailyCount,
        lastGenerationDate: today,
      });
      
      console.log(`Mock generations used updated. Monthly: ${newMonthlyCount}, Daily: ${newDailyCount}`);
  };

  const logout = () => {
    // This function is intentionally left blank to prevent logging out during testing.
    console.log("Logout action is disabled for testing.");
  };

  const value = {
    user,
    loading,
    hasPermission,
    incrementGenerationsUsed,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};