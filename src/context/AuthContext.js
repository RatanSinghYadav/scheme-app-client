import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // In a real app, you would validate credentials with an API
    // For MVP, we'll simulate successful login with hardcoded roles
    const user = {
      id: userData.username,
      name: userData.username,
      role: userData.role || 'viewer', // Default role
      token: 'sample-jwt-token'
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const hasRole = (requiredRole) => {
    if (!currentUser) return false;
    
    // Role hierarchy: admin > creator > verifier > viewer
    const roleHierarchy = {
      admin: 4,
      creator: 3,
      verifier: 2,
      viewer: 1
    };
    
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  const value = {
    currentUser,
    login,
    logout,
    hasRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
