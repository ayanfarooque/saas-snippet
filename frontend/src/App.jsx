import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NewSnippet from './pages/NewSnippet';
import EditSnippet from './pages/EditSnippet';
import Account from './pages/Account';
import PublicSnippet from './pages/PublicSnippet';

import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPlaceholder from './pages/DashboardPlaceholder';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '2px solid var(--border-primary)',
          borderTopColor: 'var(--orange-500)',
          animation: 'spin 0.6s linear infinite',
        }} />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="new" element={<NewSnippet />} />
          <Route path="favorites" element={<DashboardPlaceholder />} />
          <Route path="trash" element={<DashboardPlaceholder />} />
          <Route path=":id" element={<EditSnippet />} />
        </Route>
        
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/s/:slug" element={<PublicSnippet />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
