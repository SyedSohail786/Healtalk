import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Grid,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Stepper,
  Step,
  StepLabel,
  TextareaAutosize,
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

// Different schemas for different user types
const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phone: yup.string(),
});

const supporterSchema = userSchema.concat(yup.object({
  phone: yup.string().required('Phone number is required'),
  bio: yup.string().required('Bio is required').min(50, 'Bio must be at least 50 characters'),
  experience: yup.string().required('Experience is required'),
  qualifications: yup.string().required('Qualifications are required'),
}));

const adminSchema = userSchema.concat(yup.object({
  phone: yup.string().required('Phone number is required'),
  adminCode: yup.string()
    .required('Admin code is required')
    .oneOf(['HEALTALK_ADMIN_2024'], 'Invalid admin code'),
}));

const steps = ['Select Role', 'Account Details', 'Additional Info'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [userType, setUserType] = useState('user');
  const [activeStep, setActiveStep] = useState(0);
  const [showAdminCode, setShowAdminCode] = useState(false);

  // Get appropriate schema based on user type
  const getSchema = () => {
    switch (userType) {
      case 'supporter':
        return supporterSchema;
      case 'admin':
        return adminSchema;
      default:
        return userSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(getSchema()),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      bio: '',
      experience: '',
      qualifications: '',
      adminCode: '',
    },
  });

  // Watch user type to update schema
  React.useEffect(() => {
    reset();
  }, [userType, reset]);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleNext = async () => {
    if (activeStep === 0) {
      // Just move to next step
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Validate step 1 fields
      const isValid = await trigger(['name', 'email', 'password', 'confirmPassword']);
      if (isValid) {
        setActiveStep(2);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleUserTypeChange = (event) => {
    const newType = event.target.value;
    setUserType(newType);
    setShowAdminCode(newType === 'admin');
  };

  const onSubmit = async (data) => {
    try {
      const registrationData = {
        ...data,
        userType: userType,
        role: userType, // Send role to backend
      };

      const result = await registerUser(registrationData);

      if (result.success) {
        toast.success(`Account created successfully as ${userType}!`);
        reset();
        
        // Redirect based on user type
        if (userType === 'supporter') {
          navigate('/supporter/dashboard');
        } else if (userType === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/login');
        }
      } else {
        console.error('Registration failed:', result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const userTypes = [
    {
      value: 'user',
      label: 'Regular User',
      description: 'Join as a regular user to access support, resources, and community',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      color: 'primary',
    },
    {
      value: 'supporter',
      label: 'Peer Supporter',
      description: 'Register as a trained peer supporter to help others in the community',
      icon: <SupporterIcon sx={{ fontSize: 40 }} />,
      color: 'secondary',
    },
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Register as an administrator to manage the platform',
      icon: <AdminIcon sx={{ fontSize: 40 }} />,
      color: 'error',
    },
  ];

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
              Create Account
            </Typography>
            <Typography color="text.secondary">
              Choose your role and join our mental wellness community
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit(onSubmit)}>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Your Role
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Choose how you want to participate in our community
                </Typography>

                <Grid container spacing={3}>
                  {userTypes.map((type) => (
                    <Grid item xs={12} md={4} key={type.value}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: userType === type.value ? `2px solid` : '1px solid #e0e0e0',
                            borderColor: userType === type.value ? `${type.color}.main` : 'divider',
                            bgcolor: userType === type.value ? `${type.color}.light` : 'background.paper',
                            height: '100%',
                            transition: 'all 0.3s',
                          }}
                          onClick={() => setUserType(type.value)}
                        >
                          <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Box
                              sx={{
                                color: `${type.color}.main`,
                                mb: 2,
                              }}
                            >
                              {type.icon}
                            </Box>
                            <Typography variant="h6" gutterBottom>
                              {type.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {type.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {userType === 'admin' && (
                  <Alert severity="warning" sx={{ mt: 3 }}>
                    Admin registration requires special authorization. Please enter the admin code when prompted.
                  </Alert>
                )}

                {userType === 'supporter' && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    As a peer supporter, you'll need to provide additional information about your experience and qualifications.
                  </Alert>
                )}
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      {...register('name')}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      {...register('password')}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      {...register('confirmPassword')}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      disabled={isSubmitting}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      {...register('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      disabled={isSubmitting}
                      required={userType !== 'user'}
                    />
                  </Grid>

                  {userType === 'supporter' && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio/Introduction"
                          {...register('bio')}
                          error={!!errors.bio}
                          helperText={errors.bio?.message}
                          disabled={isSubmitting}
                          multiline
                          rows={3}
                          placeholder="Tell us about yourself and why you want to be a supporter..."
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Experience"
                          {...register('experience')}
                          error={!!errors.experience}
                          helperText={errors.experience?.message}
                          disabled={isSubmitting}
                          placeholder="e.g., 2 years in mental health field"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Qualifications"
                          {...register('qualifications')}
                          error={!!errors.qualifications}
                          helperText={errors.qualifications?.message}
                          disabled={isSubmitting}
                          placeholder="e.g., Psychology degree, Certified Counselor"
                        />
                      </Grid>
                    </>
                  )}

                  {userType === 'admin' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Admin Authorization Code"
                        type="password"
                        {...register('adminCode')}
                        error={!!errors.adminCode}
                        helperText={errors.adminCode?.message}
                        disabled={isSubmitting}
                        placeholder="Enter the admin authorization code"
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              
              <Box>
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </Box>
            </Box>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default RegisterPage;