"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { User, Subscription } from "@/types";

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
  id: "1",
  email: "demo@example.com",
  name: "Demo User",
  points: 2500,
  subscriptions: [
    {
      id: "sub-1",
      publicationId: "1",
      publicationTitle: "The Economist",
      type: "magazine",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      status: "active",
      orderNumber: "ORD-2024-001",
    },
    {
      id: "sub-2",
      publicationId: "6",
      publicationTitle: "The Wall Street Journal",
      type: "newspaper",
      startDate: "2024-03-01",
      endDate: "2025-03-01",
      status: "active",
      orderNumber: "ORD-2024-002",
    },
  ],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Signup error:", error);
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addPoints = useCallback((points: number) => {
    setUser((prev) =>
      prev ? { ...prev, points: prev.points + points } : null
    );
  }, []);

  const addSubscription = useCallback((subscription: Subscription) => {
    setUser((prev) =>
      prev
        ? { ...prev, subscriptions: [...prev.subscriptions, subscription] }
        : null
    );
  }, []);

  const cancelSubscription = useCallback((subscriptionId: string) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            subscriptions: prev.subscriptions.map((sub) =>
              sub.id === subscriptionId
                ? { ...sub, status: "cancelled" as const }
                : sub
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
