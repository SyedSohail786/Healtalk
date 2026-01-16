import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'; // ADD ThemeProvider
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import VideoSupport from './pages/support/VideoSupport';
import AudioSupport from './pages/support/AudioSupport';
import ChatSupport from './pages/support/ChatSupport';
import GroupsPage from './pages/community/GroupsPage';
import ArticlesPage from './pages/resources/ArticlesPage';
import ProductsPage from './pages/store/ProductsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContributorDashboard from './pages/contributor/ContributorDashboard';
import SupporterDashboard from './pages/SupporterDashboard';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      dark: '#3730A3',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#047857',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}> {/* WRAP with ThemeProvider */}
        <LoadingProvider>
          <AuthProvider>
            <ErrorBoundary>
              <Router>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: '#10B981',
                      },
                    },
                    error: {
                      style: {
                        background: '#EF4444',
                      },
                    },
                  }}
                />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                  </Route>

                  {/* Protected User Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['user', 'supporter', 'admin']} />}>
                    <Route element={<MainLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/support/video" element={<VideoSupport />} />
                      <Route path="/support/audio" element={<AudioSupport />} />
                      <Route path="/support/chat" element={<ChatSupport />} />
                      <Route path="/groups" element={<GroupsPage />} />
                      <Route path="/articles" element={<ArticlesPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      {/* Add supporter dashboard route */}
                      <Route path="/supporter/dashboard" element={<SupporterDashboard />} />
                    </Route>
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route element={<MainLayout />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                  </Route>

                  {/* Contributor/Supporter Routes - Update this */}
                  <Route element={<ProtectedRoute allowedRoles={['supporter']} />}>
                    <Route element={<MainLayout />}>
                      <Route path="/contributor" element={<SupporterDashboard />} />
                    </Route>
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </ErrorBoundary>
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider> {/* CLOSE ThemeProvider */}
    </>
  );
}

export default App;