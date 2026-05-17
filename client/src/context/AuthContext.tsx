import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { IUser } from '../types';
import { authApi } from '../api/auth.api';
import type { RegisterSchemaType, LoginSchemaType } from '../../../shared/validators/auth.validator';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginSchemaType) => Promise<void>;
  register: (data: RegisterSchemaType) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await authApi.getMe();
      setUser(data.data);
    } catch {
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginSchemaType) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    setUser(data.data.user);
  };

  const register = async (credentials: RegisterSchemaType) => {
    const { data } = await authApi.register(credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    setUser(data.data.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
