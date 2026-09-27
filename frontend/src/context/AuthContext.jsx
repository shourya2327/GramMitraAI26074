import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRegisteredUsers, updateCustomerData } from '../utils/userStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ensure default demo users are initialized in localStorage
  useEffect(() => {
    getRegisteredUsers();
  }, []);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gm_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      } catch (e) {
        /* ignore */
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('gm_token') || null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('gm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gm_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('gm_token', token);
    } else {
      localStorage.removeItem('gm_token');
    }
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken || `demo-token-${userData.id}-${Date.now()}`);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gm_user');
    localStorage.removeItem('gm_token');
  };

  const updateUserProfile = (updatedFields) => {
    if (!user) return { success: false, message: 'No active session' };
    const res = updateCustomerData(user.id, updatedFields);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true, user: res.user };
    }
    return res;
  };

  const switchRole = (newRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      updateCustomerData(user.id, { role: newRole });
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isFarmer = user?.role === 'ROLE_FARMER' || user?.role === 'ROLE_CUSTOMER' || !user?.role;
  const isOfficer = user?.role === 'ROLE_OFFICER';

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!user, 
      isAdmin,
      isFarmer,
      isOfficer,
      login, 
      logout, 
      updateUserProfile,
      switchRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
