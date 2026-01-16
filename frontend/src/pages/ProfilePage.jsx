import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Card,
  CardContent,
  LinearProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit,
  Save,
  CameraAlt,
  Psychology,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Male,
  Female,
  PsychologyAlt,
  Groups,
  Chat,
  Videocam,
  Star,
  History,
  Settings,
  Security,
  Notifications,
  Help,
  Logout,
  CheckCircle,
  Warning,
  AccessTime,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    gender: '',
    dateOfBirth: '',
    emergencyContact: '',
  });

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || 'New York, USA',
        bio: user.bio || 'Mental wellness enthusiast. Passionate about community support and personal growth.',
        gender: user.gender || 'male',
        dateOfBirth: user.dateOfBirth || '1990-01-01',
        emergencyContact: user.emergencyContact || '+1 (555) 123-4567',
      });
    }
  }, [user]);

  const stats = [
    { label: 'Total Sessions', value: '24', icon: <Chat />, progress: 80, color: 'primary.main' },
    { label: 'Group Participation', value: '3', icon: <Groups />, progress: 60, color: 'secondary.main' },
    { label: 'Consistency Streak', value: '7 days', icon: <CalendarToday />, progress: 70, color: 'success.main' },
    { label: 'Wellness Score', value: '85/100', icon: <PsychologyAlt />, progress: 85, color: 'warning.main' },
  ];

  const recentSessions = [
    { type: 'Video', supporter: 'Dr. Sarah Johnson', date: '2024-01-15', rating: 5, duration: '45 min' },
    { type: 'Chat', supporter: 'Michael Chen', date: '2024-01-10', rating: 4, duration: '30 min' },
    { type: 'Audio', supporter: 'Priya Sharma', date: '2024-01-05', rating: 5, duration: '60 min' },
    { type: 'Group', supporter: 'Anxiety Support Group', date: '2024-01-02', rating: 4, duration: '90 min' },
  ];

  const achievements = [
    { title: 'First Session', description: 'Completed first counseling session', icon: <Star color="warning" />, date: '2023-12-01' },
    { title: 'Week Streak', description: '7 days of consistent check-ins', icon: <CalendarToday color="success" />, date: '2023-12-10' },
    { title: 'Group Leader', description: 'Became a group discussion leader', icon: <Groups color="primary" />, date: '2023-12-15' },
    { title: 'Wellness Warrior', description: 'Completed 10 wellness activities', icon: <PsychologyAlt color="secondary" />, date: '2023-12-20' },
  ];

  const settingsSections = [
    { title: 'Account Settings', icon: <Settings />, items: ['Personal Information', 'Privacy', 'Connected Accounts'] },
    { title: 'Notifications', icon: <Notifications />, items: ['Email Notifications', 'Push Notifications', 'Session Reminders'] },
    { title: 'Security', icon: <Security />, items: ['Change Password', 'Two-Factor Auth', 'Session History'] },
    { title: 'Support', icon: <Help />, items: ['Help Center', 'Contact Support', 'Feedback'] },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Mood Score',
        data: [65, 70, 68, 72, 75, 78, 80, 82, 85, 83, 80, 85],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Activity Level',
        data: [45, 50, 55, 60, 65, 70, 68, 72, 75, 70, 68, 75],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success('Profile picture updated!');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        sx={{
          fontSize: 16,
          color: i < rating ? '#FFD700' : '#E5E7EB',
        }}
      />
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Profile
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => setActiveTab(3)}
            >
              Settings
            </Button>
            <Button
              variant="contained"
              startIcon={isEditing ? <Save /> : <Edit />}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Activity" />
          <Tab label="Achievements" />
          <Tab label="Settings" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Grid container spacing={4}>
            {/* Left Column - Profile Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  {/* Profile Picture */}
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                    <Avatar
                      src={profileImage}
                      sx={{
                        width: 120,
                        height: 120,
                        fontSize: '3rem',
                        bgcolor: 'primary.main',
                        border: '4px solid',
                        borderColor: 'primary.light',
                      }}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-image-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="profile-image-upload">
                      <IconButton
                        component="span"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        <CameraAlt />
                      </IconButton>
                    </label>
                  </Box>

                  {/* Name */}
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {formData.name}
                    </Typography>
                  )}

                  {/* Role */}
                  <Chip
                    icon={<Psychology />}
                    label={user?.role === 'supporter' ? 'Peer Supporter' : 'Member'}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />

                  {/* Bio */}
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      sx={{ mb: 3 }}
                    />
                  ) : (
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      {formData.bio}
                    </Typography>
                  )}

                  {/* Stats */}
                  <Grid container spacing={2}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 1,
                              color: stat.color,
                            }}
                          >
                            {stat.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.label}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={stat.progress}
                            sx={{
                              mt: 1,
                              height: 4,
                              borderRadius: 2,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: stat.color,
                              },
                            }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Contact Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Email color="action" />
                      </ListItemIcon>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      ) : (
                        <ListItemText primary={formData.email} secondary="Email" />
                      )}
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone color="action" />
                      </ListItemIcon>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      ) : (
                        <ListItemText primary={formData.phone || 'Not provided'} secondary="Phone" />
                      )}
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="action" />
                      </ListItemIcon>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      ) : (
                        <ListItemText primary={formData.location} secondary="Location" />
                      )}
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {formData.gender === 'male' ? <Male color="action" /> : <Female color="action" />}
                      </ListItemIcon>
                      {isEditing ? (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          SelectProps={{
                            native: true,
                          }}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </TextField>
                      ) : (
                        <ListItemText 
                          primary={formData.gender?.charAt(0).toUpperCase() + formData.gender?.slice(1)} 
                          secondary="Gender" 
                        />
                      )}
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Charts and Info */}
            <Grid item xs={12} md={8}>
              {/* Progress Chart */}
              <Card sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Wellness Progress
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>

              {/* Emergency Contact & Additional Info */}
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Emergency Contact
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Phone color="error" />
                          </ListItemIcon>
                          {isEditing ? (
                            <TextField
                              fullWidth
                              size="small"
                              value={formData.emergencyContact}
                              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                            />
                          ) : (
                            <ListItemText 
                              primary={formData.emergencyContact} 
                              secondary="Emergency Phone Number" 
                            />
                          )}
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CalendarToday color="action" />
                          </ListItemIcon>
                          {isEditing ? (
                            <TextField
                              fullWidth
                              size="small"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            />
                          ) : (
                            <ListItemText 
                              primary={new Date(formData.dateOfBirth).toLocaleDateString()} 
                              secondary="Date of Birth" 
                            />
                          )}
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Account Status
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary="Verified Account" secondary="Email verified" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Warning color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Membership: Free" 
                            secondary={
                              <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                                Upgrade to Premium
                              </Button>
                            } 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <AccessTime color="action" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Member since" 
                            secondary={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* Activity Tab */}
        {activeTab === 1 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                Recent Sessions & Activity
              </Typography>
              <List>
                {recentSessions.map((session, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      mb: 2,
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <ListItemIcon>
                      {session.type === 'Video' && <Videocam color="primary" />}
                      {session.type === 'Chat' && <Chat color="secondary" />}
                      {session.type === 'Audio' && <Phone color="success" />}
                      {session.type === 'Group' && <Groups color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {session.supporter}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {session.type} Session • {session.duration} • {session.date}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            {getRatingStars(session.rating)}
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {session.rating}/5
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                    <Button variant="outlined" size="small">
                      View Details
                    </Button>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button variant="outlined" startIcon={<History />}>
                  View All Activity
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Achievements Tab */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            {achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'primary.light',
                      }}
                    >
                      {achievement.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {achievement.description}
                    </Typography>
                    <Chip
                      label={achievement.date}
                      size="small"
                      variant="outlined"
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, mt: 3 }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <PsychologyAlt sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Continue Your Journey
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
                    Complete more activities to unlock additional achievements and track your progress.
                  </Typography>
                  <Button variant="contained">
                    Explore Activities
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Settings Tab */}
        {activeTab === 3 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                Account Settings
              </Typography>
              <Grid container spacing={4}>
                {settingsSections.map((section, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              bgcolor: 'primary.light',
                              color: 'primary.main',
                            }}
                          >
                            {section.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {section.title}
                          </Typography>
                        </Box>
                        <List>
                          {section.items.map((item, itemIndex) => (
                            <ListItem
                              key={itemIndex}
                              button
                              sx={{
                                borderRadius: 1,
                                mb: 1,
                                '&:hover': {
                                  bgcolor: 'action.hover',
                                },
                              }}
                            >
                              <ListItemText primary={item} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Divider sx={{ my: 4 }} />
              
              {/* Danger Zone */}
              <Box>
                <Typography variant="h6" color="error" sx={{ fontWeight: 600, mb: 3 }}>
                  Danger Zone
                </Typography>
                <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'error.main' }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      These actions are irreversible. Please proceed with caution.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                            toast.error('Account deletion requested');
                          }
                        }}
                      >
                        Delete Account
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Logout />}
                        onClick={() => {
                          logout();
                          toast.success('Logged out successfully');
                        }}
                      >
                        Logout
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </Container>
  );
};

export default ProfilePage;