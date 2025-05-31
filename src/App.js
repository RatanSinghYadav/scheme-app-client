import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from '../src/components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import SchemeCreate from './pages/SchemeCreate';
import BaseSchemeCreate from './pages/BaseSchemeCreate';
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
import ProductManagement from './pages/ProductManagement';
import DistributorManagement from './pages/DistributorManagement';
import DuplicateProducts from './pages/DuplicateProducts';

// यहां हम AuthContext से currentUser और hasRole को प्राप्त करेंगे
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import BaseSchemeList from './pages/BaseSchemeList';
import BaseSchemeDetail from './pages/BaseSchemeDetail';

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
            <Navigate to="/schemes/additional" replace />
          </ProtectedRoute>
        } />

        <Route path="/schemes/base" element={
          <ProtectedRoute>
            <BaseSchemeList schemeType="base" />
          </ProtectedRoute>
        } />

        <Route path="/schemes/additional" element={
          <ProtectedRoute>
            <SchemeList schemeType="additional" />
          </ProtectedRoute>
        } />

        {/* केवल creator या admin role वाले users के लिए */}
        {(currentUser && (hasRole('creator') || hasRole('admin'))) && (
          <Route path="/schemes/create/additional" element={
            <ProtectedRoute requiredRole="creator">
              <SchemeCreate />
            </ProtectedRoute>
          } />
        )}

        {/* केवल creator या admin role वाले users के लिए */}
        {(currentUser && (hasRole('creator') || hasRole('admin'))) && (
          <Route path="/schemes/create/base" element={
            <ProtectedRoute requiredRole="creator">
              <BaseSchemeCreate />
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

        <Route path="/base/schemes/:id" element={
          <ProtectedRoute>
            <BaseSchemeDetail />
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
        
        {/* प्रोडक्ट मैनेजमेंट राउट - केवल admin role वाले users के लिए */}
        {(currentUser && hasRole('admin')) && (
          <Route path="/products" element={
            <ProtectedRoute requiredRole="admin">
              <ProductManagement />
            </ProtectedRoute>
          } />
        )}
        
        {/* डिस्ट्रीब्यूटर मैनेजमेंट राउट - केवल admin role वाले users के लिए */}
        {(currentUser && hasRole('admin')) && (
          <Route path="/distributors" element={
            <ProtectedRoute requiredRole="admin">
              <DistributorManagement />
            </ProtectedRoute>
          } />
        )}

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
        // राउट्स में डुप्लिकेट प्रोडक्ट्स पेज जोड़ें
        <Route path="/duplicate-products" element={<DuplicateProducts />} />
      </Routes>
    </Navbar>
  );
};

export default App;
