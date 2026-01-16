// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Person as PersonIcon,
  SupportAgent as SupporterIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const [loginType, setLoginType] = useState('user');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnRole(user.role);
    }
  }, [isAuthenticated, user, navigate]);

  const redirectBasedOnRole = (role) => {
    switch(role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'supporter':
        navigate('/supporter/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);
      
      if (result.success && result.user) {
        toast.success(`Welcome back, ${result.user.name}!`);
        redirectBasedOnRole(result.user.role);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const loginTypes = [
    {
      value: 'user',
      label: 'User Login',
      description: 'Login as a regular user to access support',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      color: 'primary',
    },
    {
      value: 'supporter',
      label: 'Supporter Login',
      description: 'Login as a peer supporter to help others',
      icon: <SupporterIcon sx={{ fontSize: 40 }} />,
      color: 'secondary',
    },
    {
      value: 'admin',
      label: 'Admin Login',
      description: 'Login as an administrator to manage the platform',
      icon: <AdminIcon sx={{ fontSize: 40 }} />,
      color: 'error',
    },
  ];

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Welcome to HealTalk
            </Typography>
            <Typography color="text.secondary">
              Sign in to access your account
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Select Login Type
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Choose how you want to login
              </Typography>

              <Grid container spacing={2}>
                {loginTypes.map((type) => (
                  <Grid item xs={12} key={type.value}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: loginType === type.value ? `2px solid` : '1px solid #e0e0e0',
                          borderColor: loginType === type.value ? `${type.color}.main` : 'divider',
                          bgcolor: loginType === type.value ? `${type.color}.light` : 'background.paper',
                          transition: 'all 0.3s',
                        }}
                        onClick={() => setLoginType(type.value)}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                          <Box
                            sx={{
                              color: `${type.color}.main`,
                              mr: 2,
                            }}
                          >
                            {type.icon}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {type.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {loginType === 'admin' && (
                <Alert severity="warning" sx={{ mt: 3 }}>
                  Admin login requires special permissions.
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h6" gutterBottom>
                  Login Credentials
                </Typography>

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isSubmitting}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  {isSubmitting ? 'Signing in...' : `Sign in as ${loginType}`}
                </Button>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Link component={RouterLink} to="/forgot-password" sx={{ fontSize: '0.875rem' }}>
                    Forgot password?
                  </Link>
                </Box>
              </form>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
                Create account
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginPage;