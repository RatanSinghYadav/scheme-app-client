import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from '../src/components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import SchemeCreate from './pages/SchemeCreate';
import SchemeVerify from './pages/SchemeVerify';
import SchemeList from './pages/SchemeList';
import SchemeDetail from './pages/SchemeDetail';
import Admin from './pages/Admin';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import 'antd/dist/reset.css';
import Profile from './pages/Profile';

// यहां हम AuthContext से currentUser और hasRole को प्राप्त करेंगे
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const theme = {
  token: {
    colorPrimary: '#1976d2',
    colorError: '#dc004e',
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

// AppContent कंपोनेंट जो AuthContext का उपयोग करेगा
const AppContent = () => {
  const { currentUser, hasRole } = useContext(AuthContext);

  return (
    <Navbar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/schemes" element={
          <ProtectedRoute>
            <SchemeList />
          </ProtectedRoute>
        } />
        
        {/* केवल creator या admin role वाले users के लिए */}
        {(currentUser && (hasRole('creator') || hasRole('admin'))) && (
          <Route path="/schemes/create" element={
            <ProtectedRoute requiredRole="creator">
              <SchemeCreate />
            </ProtectedRoute>
          } />
        )}
        
        {/* केवल verifier या admin role वाले users के लिए */}
        {(currentUser && (hasRole('verifier') || hasRole('admin'))) && (
          <Route path="/schemes/verify" element={
            <ProtectedRoute requiredRole="verifier">
              <SchemeVerify />
            </ProtectedRoute>
          } />
        )}
        
        <Route path="/schemes/:id" element={
          <ProtectedRoute>
            <SchemeDetail />
          </ProtectedRoute>
        } />
        
        {/* केवल admin role वाले users के लिए */}
        {(currentUser && hasRole('admin')) && (
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } />
        )}
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Navbar>
  );
};

export default App;
