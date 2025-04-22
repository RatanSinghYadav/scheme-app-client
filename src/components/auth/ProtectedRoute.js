import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, hasRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [localAuth, setLocalAuth] = useState({
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    // Double-check authentication with localStorage
    // This is a fallback in case AuthContext hasn't loaded yet
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      setLocalAuth({
        isAuthenticated: true,
        user: JSON.parse(userStr)
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // First check AuthContext (preferred method)
  if (currentUser) {
    // User is logged in via AuthContext
    if (requiredRole && !hasRole(requiredRole)) {
      // User doesn't have the required role
      return <Navigate to="/" replace />;
    }
    return children;
  }
  
  // Fallback to localStorage check
  if (localAuth.isAuthenticated) {
    // We have a user in localStorage but not in context
    // This could happen during page refresh before context is fully loaded
    return children;
  }

  // No authentication found anywhere
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;