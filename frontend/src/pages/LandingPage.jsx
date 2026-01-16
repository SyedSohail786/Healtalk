import React, { useEffect } from 'react'; // Added useEffect
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Psychology,
  Support,
  Groups as GroupsIcon,
  VideoCall,
  Chat,
  MedicalServices,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext is in contexts folder

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth(); // Get auth state

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading or nothing while checking authentication
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        {/* You can add a loading spinner here */}
      </Box>
    );
  }

  // Don't render the landing page if user is authenticated
  if (isAuthenticated) {
    return null; // or a redirect component
  }

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'Professional Support',
      description: 'Connect with certified mental health professionals',
      color: theme.palette.primary.main,
    },
    {
      icon: <VideoCall sx={{ fontSize: 40 }} />,
      title: 'Video Sessions',
      description: 'Face-to-face counseling from the comfort of your home',
      color: theme.palette.secondary.main,
    },
    {
      icon: <Chat sx={{ fontSize: 40 }} />,
      title: '24/7 Chat',
      description: 'Instant text support whenever you need it',
      color: theme.palette.info.main,
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: 'Support Groups',
      description: 'Join communities with similar experiences',
      color: theme.palette.warning.main,
    },
    {
      icon: <MedicalServices sx={{ fontSize: 40 }} />,
      title: 'Resources',
      description: 'Articles, quizzes, and educational materials',
      color: theme.palette.success.main,
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: 'Peer Support',
      description: 'Connect with trained peer supporters',
      color: theme.palette.error.main,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 12,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                textAlign: 'center',
                mb: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Mental Health Support,
              <br />
              <Typography
                component="span"
                variant="h1"
                sx={{
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  color: 'text.primary',
                }}
              >
                Made Accessible
              </Typography>
            </Typography>
            
            <Typography
              variant="h5"
              color="text.secondary"
              align="center"
              sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
            >
              A safe, confidential space where you can find support, resources, and
              community for your mental wellbeing journey.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 8 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
                >
                  Get Started
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
                >
                  Sign In
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 2, fontWeight: 700 }}
        >
          How We Help
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          align="center"
          sx={{ mb: 8, maxWidth: '600px', mx: 'auto' }}
        >
          Comprehensive mental health support through multiple channels
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    border: `1px solid ${alpha(feature.color, 0.1)}`,
                    bgcolor: alpha(feature.color, 0.03),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: feature.color,
                      boxShadow: `0 8px 32px ${alpha(feature.color, 0.15)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      bgcolor: alpha(feature.color, 0.1),
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ py: 12, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                p: 6,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                border: 'none',
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                Ready to Start Your Journey?
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
              >
                Join thousands who have found support and community on HealTalk
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ px: 8, py: 1.5, fontSize: '1.1rem' }}
                >
                  Create Free Account
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;