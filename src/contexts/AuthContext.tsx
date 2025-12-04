import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Subscription } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addPoints: (points: number) => void;
  addSubscription: (subscription: Subscription) => void;
  cancelSubscription: (subscriptionId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  points: 2500,
  subscriptions: [
    {
      id: 'sub-1',
      publicationId: '1',
      publicationTitle: 'The Economist',
      type: 'magazine',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      status: 'active',
      orderNumber: 'ORD-2024-001',
    },
    {
      id: 'sub-2',
      publicationId: '6',
      publicationTitle: 'The Wall Street Journal',
      type: 'newspaper',
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      status: 'active',
      orderNumber: 'ORD-2024-002',
    },
  ],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      setUser({ ...mockUser, email });
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    // Mock signup
    if (name && email && password) {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        points: 0,
        subscriptions: [],
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addPoints = useCallback((points: number) => {
    setUser((prev) => (prev ? { ...prev, points: prev.points + points } : null));
  }, []);

  const addSubscription = useCallback((subscription: Subscription) => {
    setUser((prev) =>
      prev ? { ...prev, subscriptions: [...prev.subscriptions, subscription] } : null
    );
  }, []);

  const cancelSubscription = useCallback((subscriptionId: string) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            subscriptions: prev.subscriptions.map((sub) =>
              sub.id === subscriptionId ? { ...sub, status: 'cancelled' as const } : sub
            ),
          }
        : null
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        addPoints,
        addSubscription,
        cancelSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
