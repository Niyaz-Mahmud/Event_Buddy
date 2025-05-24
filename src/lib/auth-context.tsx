'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, users } from './data/users';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, isAdmin?: boolean) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Derived state - no need for separate state variables
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  const login = (email: string, password: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      updateUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string, isAdmin = false) => {
    if (users.some(u => u.email === email)) {
      return false;
    }
    
    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      password,
      role: isAdmin ? 'admin' : 'user',
    };
    
    users.push(newUser);
    updateUser(newUser);
    return true;
  };

  const logout = () => updateUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 