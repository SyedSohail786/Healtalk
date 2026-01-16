import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  Phone,
  Search,
  Schedule,
  Star,
  Person,
  Language,
  Timer,
  CheckCircle,
  Mic,
  MicOff,
  VolumeUp,
  Headphones,
  RecordVoiceOver,
  AccessTime,
  PlayArrow,
  Pause,
  Stop,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const AudioSupport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSupporter, setSelectedSupporter] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingTime, setBookingTime] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callVolume, setCallVolume] = useState(80);

  const categories = [
    { id: 'all', label: 'All Categories', count: 18 },
    { id: 'anxiety', label: 'Anxiety', count: 6 },
    { id: 'depression', label: 'Depression', count: 5 },
    { id: 'stress', label: 'Stress', count: 4 },
    { id: 'relationships', label: 'Relationships', count: 2 },
    { id: 'trauma', label: 'Trauma', count: 1 },
  ];

  const supporters = [
    {
      id: 1,
      name: 'Dr. Michael Chen',
      specialization: 'Counselor & Therapist',
      experience: '8 years',
      rating: 4.8,
      reviews: 94,
      languages: ['English', 'Mandarin'],
      availability: 'Available Now',
      avatarColor: '#10B981',
      categories: ['anxiety', 'stress'],
      price: '$45/session',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      specialization: 'Mindfulness Coach',
      experience: '6 years',
      rating: 4.7,
      reviews: 76,
      languages: ['English', 'Hindi'],
      availability: 'Available in 15 min',
      avatarColor: '#F59E0B',
      categories: ['anxiety', 'relationships'],
      price: '$40/session',
    },
    {
      id: 3,
      name: 'David Wilson',
      specialization: 'Trauma Specialist',
      experience: '12 years',
      rating: 4.9,
      reviews: 112,
      languages: ['English'],
      availability: 'Tomorrow',
      avatarColor: '#EF4444',
      categories: ['trauma', 'depression'],
      price: '$60/session',
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      specialization: 'Clinical Psychologist',
      experience: '15 years',
      rating: 4.9,
      reviews: 128,
      languages: ['English', 'Spanish'],
      availability: 'Available Now',
      avatarColor: '#4F46E5',
      categories: ['depression', 'stress'],
      price: '$55/session',
    },
  ];

  const availableTimes = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const recentCalls = [
    { supporter: 'Dr. Michael Chen', date: 'Today, 2:30 PM', duration: '45 min', type: 'Completed' },
    { supporter: 'Priya Sharma', date: 'Yesterday, 11:00 AM', duration: '30 min', type: 'Completed' },
    { supporter: 'David Wilson', date: 'Jan 12, 3:00 PM', duration: '60 min', type: 'Completed' },
  ];

  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const handleBookSession = (supporter) => {
    setSelectedSupporter(supporter);
    setBookingDialogOpen(true);
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    toast.success('Audio call started!');
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    toast.success('Call ended. Thank you for your session!');
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(!isMuted ? 'Microphone muted' : 'Microphone unmuted');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredSupporters = supporters.filter(supporter => {
    const matchesSearch = supporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supporter.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           supporter.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ mb: 4, borderRadius: 3, bgcolor: 'secondary.light', color: 'white' }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  Audio Counseling Sessions
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Private, voice-only sessions with certified mental health professionals.
                  Connect from anywhere, anytime.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<Phone />} 
                    label="Voice Only" 
                    sx={{ bgcolor: 'white', color: 'secondary.main' }} 
                  />
                  <Chip 
                    icon={<CheckCircle />} 
                    label="Certified Professionals" 
                    sx={{ bgcolor: 'white', color: 'secondary.main' }} 
                  />
                  <Chip 
                    icon={<Headphones />} 
                    label="Completely Private" 
                    sx={{ bgcolor: 'white', color: 'secondary.main' }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Phone sx={{ fontSize: 120, opacity: 0.2 }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Call Section */}
      {isCallActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{ mb: 4, borderRadius: 3, border: '2px solid', borderColor: 'secondary.main' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mr: 3,
                        bgcolor: selectedSupporter?.avatarColor || 'secondary.main',
                        fontSize: '2rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedSupporter?.name?.split(' ').map(n => n[0]).join('') || 'SC'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {selectedSupporter?.name || 'Support Call'}
                      </Typography>
                      <Typography color="text.secondary">
                        Audio Session in Progress
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Timer sx={{ fontSize: 16, mr: 1, color: 'secondary.main' }} />
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {formatTime(callDuration)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <IconButton
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: isMuted ? 'error.main' : 'grey.200',
                        '&:hover': { bgcolor: isMuted ? 'error.dark' : 'grey.300' },
                      }}
                      onClick={handleToggleMute}
                    >
                      {isMuted ? <MicOff /> : <Mic />}
                    </IconButton>
                    <IconButton
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'secondary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'secondary.dark' },
                      }}
                      onClick={handleEndCall}
                    >
                      <Phone sx={{ transform: 'rotate(135deg)' }} />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VolumeUp />
                      <LinearProgress
                        variant="determinate"
                        value={callVolume}
                        sx={{ width: 100, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search and Filter */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search supporters by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.label}
                onClick={() => setSelectedCategory(category.id)}
                color={selectedCategory === category.id ? 'secondary' : 'default'}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Two Column Layout */}
      <Grid container spacing={4}>
        {/* Supporters List */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {filteredSupporters.map((supporter, index) => (
              <Grid item xs={12} key={supporter.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Grid container alignItems="center" spacing={3}>
                        <Grid item xs={12} md={8}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                width: 80,
                                height: 80,
                                mr: 3,
                                bgcolor: supporter.avatarColor,
                                fontSize: '2rem',
                                fontWeight: 600,
                              }}
                            >
                              {supporter.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {supporter.name}
                              </Typography>
                              <Typography color="text.secondary" sx={{ mb: 1 }}>
                                {supporter.specialization}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Rating value={supporter.rating} precision={0.1} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary">
                                  {supporter.rating} ({supporter.reviews} reviews)
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {supporter.experience}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Language sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {supporter.languages.join(', ')}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={supporter.price}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Chip
                              icon={<Schedule />}
                              label={supporter.availability}
                              color={supporter.availability.includes('Now') ? 'success' : 'warning'}
                              variant="outlined"
                              sx={{ alignSelf: 'flex-start' }}
                            />
                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<Phone />}
                              onClick={() => handleBookSession(supporter)}
                              sx={{ py: 1.5 }}
                            >
                              Book Session
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<RecordVoiceOver />}
                              onClick={() => {
                                setSelectedSupporter(supporter);
                                handleStartCall();
                              }}
                              disabled={!supporter.availability.includes('Now')}
                            >
                              Start Now
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Recent Calls */}
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Recent Calls
              </Typography>
              <List>
                {recentCalls.map((call, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.light' }}>
                          <Phone />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={call.supporter}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {call.date} • {call.duration}
                            </Typography>
                          </>
                        }
                      />
                      <Chip
                        label={call.type}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </ListItem>
                    {index < recentCalls.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Calls
              </Button>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Tips for Audio Sessions
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.light', width: 32, height: 32 }}>
                      1
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Find a quiet, private space" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.light', width: 32, height: 32 }}>
                      2
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Use headphones for better audio" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.light', width: 32, height: 32 }}>
                      3
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Test your microphone before starting" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.light', width: 32, height: 32 }}>
                      4
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Have water nearby" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Book Audio Session
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedSupporter && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: selectedSupporter.avatarColor }}>
                  {selectedSupporter.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedSupporter.name}
                  </Typography>
                  <Typography color="text.secondary">
                    {selectedSupporter.specialization}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                    {selectedSupporter.price}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Select Time Slot
          </Typography>
          <Grid container spacing={2}>
            {availableTimes.map((time) => (
              <Grid item xs={6} sm={4} key={time}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    fullWidth
                    variant={bookingTime === time ? 'contained' : 'outlined'}
                    onClick={() => setBookingTime(time)}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    {time}
                  </Button>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Session Duration
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['30 min', '45 min', '60 min'].map((duration) => (
                <Chip
                  key={duration}
                  label={duration}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setBookingDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!bookingTime) {
                toast.error('Please select a time slot');
                return;
              }
              toast.success(`Audio session booked with ${selectedSupporter.name} at ${bookingTime}`);
              setBookingDialogOpen(false);
              setBookingTime('');
            }}
            disabled={!bookingTime}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Custom Rating component since Material-UI Rating is not imported
const Rating = ({ value, precision, readOnly, size }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const partialStar = value - fullStars;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} sx={{ fontSize: size === 'small' ? 20 : 24, color: '#FFD700' }} />);
  }
  
  if (partialStar > 0) {
    stars.push(
      <Box key="partial" sx={{ position: 'relative', display: 'inline-block' }}>
        <Star sx={{ fontSize: size === 'small' ? 20 : 24, color: '#E5E7EB' }} />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${partialStar * 100}%`,
            overflow: 'hidden',
          }}
        >
          <Star sx={{ fontSize: size === 'small' ? 20 : 24, color: '#FFD700' }} />
        </Box>
      </Box>
    );
  }
  
  for (let i = stars.length; i < 5; i++) {
    stars.push(<Star key={i} sx={{ fontSize: size === 'small' ? 20 : 24, color: '#E5E7EB' }} />);
  }
  
  return <Box sx={{ display: 'flex' }}>{stars}</Box>;
};

export default AudioSupport;