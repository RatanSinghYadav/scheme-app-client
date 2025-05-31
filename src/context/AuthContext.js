import React, { createContext, useState, useEffect } from 'react';
import { url } from '../utils/constent';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      // Verify token validity with backend
      const verifyToken = async () => {
        try {
          const response = await fetch(`${url}/api/auth/getCurrentUser`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            setCurrentUser(JSON.parse(storedUser));
          } else {
            // Token invalid, clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Token verification error:', error);
        } finally {
          setLoading(false);
        }
      };
      
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (userData) => {
    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token and user info to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const hasRole = (requiredRole) => {
    if (!currentUser || !currentUser.role) return false;
    
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
