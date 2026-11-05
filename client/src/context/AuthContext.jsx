import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('swachh_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('swachh_auth_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('swachh_auth_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('swachh_auth_token', res.token);
      localStorage.setItem('swachh_auth_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const registerCitizen = async (formData) => {
    const res = await api.registerCitizen(formData);
    if (res.success && res.token) {
      localStorage.setItem('swachh_auth_token', res.token);
      localStorage.setItem('swachh_auth_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('swachh_auth_token');
    localStorage.removeItem('swachh_auth_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('swachh_auth_user', JSON.stringify(res.data));
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  // Quick 1-Click Role Login for Administrator
  const quickLoginAs = async (roleName) => {
    if (roleName === 'ADMIN') {
      return await login('admin@swachh.gov.in', 'admin123');
    }
  };

  const role = user?.role || 'GUEST';
  const isAdmin = role === 'ADMIN';
  const isLead = role === 'MUNICIPAL_LEAD';
  const isWorker = role === 'WORKER';
  const isCitizen = role === 'CITIZEN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isLead,
        isWorker,
        isCitizen,
        login,
        registerCitizen,
        logout,
        refreshUser,
        quickLoginAs,
      }}
    >
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

