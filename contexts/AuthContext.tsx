
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  incrementGenerations: () => void;
  setPaid: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ai-recipe-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('ai-recipe-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(() => {
    const mockUser: User = {
      uid: 'mock-uid-12345',
      email: 'user@example.com',
      isPaid: false,
      generations: 0,
    };
    localStorage.setItem('ai-recipe-user', JSON.stringify(mockUser));
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ai-recipe-user');
    setUser(null);
  }, []);

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('ai-recipe-user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };
  
  const incrementGenerations = useCallback(() => {
    if (user) {
      const newUser = { ...user, generations: user.generations + 1 };
      updateUser(newUser);
    }
  }, [user]);

  const setPaid = useCallback(() => {
    if (user) {
      const newUser = { ...user, isPaid: true };
      updateUser(newUser);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, incrementGenerations, setPaid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
