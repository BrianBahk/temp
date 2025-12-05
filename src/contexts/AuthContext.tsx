import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Subscription, Review, CreditCard, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    middleInitial?: string;
    email: string;
    address: string;
    creditCard: CreditCard;
    username: string;
    password: string;
    role?: UserRole;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addPoints: (points: number) => void;
  subtractPoints: (points: number) => void;
  addSubscription: (subscription: Subscription) => void;
  cancelSubscription: (subscriptionId: string, refundAmount: number, pointsAwarded: number) => void;
  submitReview: (review: Review) => void;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'rejected', rejectionReason?: string, pointsAwarded?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const mockUser: User = {
  id: '1',
  username: 'demo',
  email: 'demo@example.com',
  name: 'Demo User',
  firstName: 'Demo',
  lastName: 'User',
  middleInitial: 'D',
  address: '123 Main St, City, State 12345',
  creditCard: {
    cardNumber: '****1234',
    expiryDate: '12/25',
    cvv: '***',
    nameOnCard: 'Demo User',
  },
  points: 2500,
  subscriptions: [
    {
      id: 'sub-1',
      subscriptionNumber: 'SUB-001-2024',
      publicationId: '1',
      publicationTitle: 'The Economist',
      type: 'magazine',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      status: 'active',
      orderNumber: 'ORD-2024-001',
      price: 189.99,
      issuesPerYear: 51,
      pointsAwarded: 19,
      paidWithPoints: false,
    },
    {
      id: 'sub-2',
      subscriptionNumber: 'SUB-002-2024',
      publicationId: '6',
      publicationTitle: 'The Wall Street Journal',
      type: 'newspaper',
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      status: 'active',
      orderNumber: 'ORD-2024-002',
      price: 38.99,
      issuesPerYear: 365,
      pointsAwarded: 8,
      paidWithPoints: false,
    },
  ],
  reviews: [],
  role: 'user',
};

// Mock admin user
const mockAdminUser: User = {
  id: '2',
  username: 'admin',
  email: 'admin@example.com',
  name: 'Admin User',
  firstName: 'Admin',
  lastName: 'User',
  address: '456 Admin St, City, State 67890',
  creditCard: {
    cardNumber: '****5678',
    expiryDate: '12/26',
    cvv: '***',
    nameOnCard: 'Admin User',
  },
  points: 0,
  subscriptions: [],
  reviews: [],
  role: 'admin',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    // Mock login - in real app, this would call an API
    if (username === 'demo' && password === 'demo') {
      setUser(mockUser);
      return true;
    }
    if (username === 'admin' && password === 'admin') {
      setUser(mockAdminUser);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (userData: {
    firstName: string;
    lastName: string;
    middleInitial?: string;
    email: string;
    address: string;
    creditCard: CreditCard;
    username: string;
    password: string;
    role?: UserRole;
  }) => {
    // Mock signup
    if (userData.firstName && userData.lastName && userData.email && userData.username && userData.password) {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        username: userData.username,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        middleInitial: userData.middleInitial,
        address: userData.address,
        creditCard: userData.creditCard,
        points: 0,
        subscriptions: [],
        reviews: [],
        role: userData.role || 'user',
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  }, []);

  const addPoints = useCallback((points: number) => {
    setUser((prev) => (prev ? { ...prev, points: prev.points + points } : null));
  }, []);

  const subtractPoints = useCallback((points: number) => {
    setUser((prev) => (prev ? { ...prev, points: Math.max(0, prev.points - points) } : null));
  }, []);

  const addSubscription = useCallback((subscription: Subscription) => {
    setUser((prev) =>
      prev ? { ...prev, subscriptions: [...prev.subscriptions, subscription] } : null
    );
  }, []);

  const cancelSubscription = useCallback((subscriptionId: string, refundAmount: number, pointsAwarded: number) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            subscriptions: prev.subscriptions.map((sub) =>
              sub.id === subscriptionId 
                ? { ...sub, status: 'cancelled' as const, refundAmount }
                : sub
            ),
            points: Math.max(0, prev.points - pointsAwarded),
          }
        : null
    );
  }, []);

  const submitReview = useCallback((review: Review) => {
    setUser((prev) =>
      prev ? { ...prev, reviews: [...prev.reviews, review] } : null
    );
  }, []);

  const updateReviewStatus = useCallback((reviewId: string, status: 'approved' | 'rejected', rejectionReason?: string, pointsAwarded: number = 0) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            reviews: prev.reviews.map((review) =>
              review.id === reviewId
                ? { ...review, status, rejectionReason, pointsAwarded }
                : review
            ),
            points: status === 'approved' ? prev.points + (pointsAwarded || 200) : prev.points,
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
        updateProfile,
        addPoints,
        subtractPoints,
        addSubscription,
        cancelSubscription,
        submitReview,
        updateReviewStatus,
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

