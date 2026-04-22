'use client';

import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await apiClient.get<{ user: User | null }>('/auth/me');
      setUser(response.data.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const url = new URL(window.location.href);
      if (url.searchParams.get('auth') === 'success') {
        url.searchParams.delete('auth');
        window.history.replaceState({}, '', url.toString());
      }
      await refreshUser();
      setIsLoading(false);
    };
    void initAuth();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{ status: string; message: string; user?: User }>('/auth/login', {
        email,
        password,
      });
      if (response.data.status === 'success' && response.data.user) {
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      const response = await apiClient.post<{ status: string; message: string; user?: User }>('/auth/register', {
        email,
        password,
        displayName,
      });
      if (response.data.status === 'success' && response.data.user) {
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Silent fail on logout
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
