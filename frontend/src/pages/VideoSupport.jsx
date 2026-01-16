import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  Videocam,
  Schedule,
  Star,
  Person,
  Language,
  Timer,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VideoSupport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSupporter, setSelectedSupporter] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingTime, setBookingTime] = useState('');

  const categories = [
    { id: 'all', label: 'All Categories', count: 24 },
    { id: 'anxiety', label: 'Anxiety', count: 8 },
    { id: 'depression', label: 'Depression', count: 6 },
    { id: 'stress', label: 'Stress', count: 5 },
    { id: 'relationships', label: 'Relationships', count: 3 },
    { id: 'trauma', label: 'Trauma', count: 2 },
  ];

  const supporters = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Clinical Psychologist',
      experience: '15 years',
      rating: 4.9,
      reviews: 128,
      languages: ['English', 'Spanish'],
      availability: 'Available Now',
      avatarColor: '#4F46E5',
      categories: ['anxiety', 'depression'],
    },
    {
      id: 2,
      name: 'Michael Chen',
      specialization: 'Counselor & Therapist',
      experience: '8 years',
      rating: 4.8,
      reviews: 94,
      languages: ['English', 'Mandarin'],
      availability: 'Available in 30 min',
      avatarColor: '#10B981',
      categories: ['stress', 'relationships'],
    },
    {
      id: 3,
      name: 'Priya Sharma',
      specialization: 'Mindfulness Coach',
      experience: '6 years',
      rating: 4.7,
      reviews: 76,
      languages: ['English', 'Hindi'],
      availability: 'Available Now',
      avatarColor: '#F59E0B',
      categories: ['anxiety', 'stress'],
    },
    {
      id: 4,
      name: 'David Wilson',
      specialization: 'Trauma Specialist',
      experience: '12 years',
      rating: 4.9,
      reviews: 112,
      languages: ['English'],
      availability: 'Tomorrow',
      avatarColor: '#EF4444',
      categories: ['trauma', 'depression'],
    },
  ];

  const availableTimes = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleBookSession = (supporter) => {
    setSelectedSupporter(supporter);
    setBookingDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!bookingTime) {
      toast.error('Please select a time slot');
      return;
    }
    
    toast.success(`Session booked with ${selectedSupporter.name} at ${bookingTime}`);
    setBookingDialogOpen(false);
    setBookingTime('');
    // Navigate to video call interface
    navigate('/support/video/call');
  };

  const filteredSupporters = supporters.filter(supporter => {
    const matchesSearch = supporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supporter.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           supporter.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ mb: 4, borderRadius: 3, bgcolor: 'primary.light', color: 'white' }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  Video Counseling Sessions
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Connect face-to-face with certified mental health professionals.
                  Private, secure, and effective support from the comfort of your home.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<Videocam />} 
                    label="HD Video" 
                    sx={{ bgcolor: 'white', color: 'primary.main' }} 
                  />
                  <Chip 
                    icon={<CheckCircle />} 
                    label="Certified Professionals" 
                    sx={{ bgcolor: 'white', color: 'primary.main' }} 
                  />
                  <Chip 
                    icon={<Timer />} 
                    label="Flexible Scheduling" 
                    sx={{ bgcolor: 'white', color: 'primary.main' }} 
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

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
                label={`${category.label} (${category.count})`}
                onClick={() => setSelectedCategory(category.id)}
                color={selectedCategory === category.id ? 'primary' : 'default'}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Supporters Grid */}
      <Grid container spacing={3}>
        {filteredSupporters.map((supporter, index) => (
          <Grid item xs={12} md={6} key={supporter.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card sx={{ borderRadius: 3, height: '100%', position: 'relative' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {supporter.experience} experience
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Language sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {supporter.languages.join(', ')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Specializes in:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {supporter.categories.map((cat) => (
                        <Chip
                          key={cat}
                          label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      icon={<Schedule />}
                      label={supporter.availability}
                      color={supporter.availability.includes('Now') ? 'success' : 'warning'}
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      startIcon={<Videocam />}
                      onClick={() => handleBookSession(supporter)}
                    >
                      Book Session
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
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
            Book Video Session
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
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={60} 
                sx={{ height: 8, borderRadius: 4, mb: 3 }}
              />
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
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setBookingDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={!bookingTime}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoSupport;