// components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ allowedRoles = ['user', 'supporter', 'admin'] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user?.role)) {
    // Redirect based on role
    switch(user?.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'supporter':
        return <Navigate to="/contributor" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;