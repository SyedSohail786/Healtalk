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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Videocam,
  Schedule,
  Star,
  Person,
  Language,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { supportService } from '../../services/supportService';

// Helper functions
const getInitials = (name) => {
  if (!name) return 'S';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const getRandomColor = () => {
  const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const VideoSupport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSupporter, setSelectedSupporter] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDuration, setBookingDuration] = useState('30 min');
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'depression', label: 'Depression' },
    { id: 'stress', label: 'Stress' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'trauma', label: 'Trauma' },
  ];

  const availableTimes = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  useEffect(() => {
    fetchSupporters();
  }, [selectedCategory]);

  // In the fetchSupporters function in VideoSupport.jsx
  const fetchSupporters = async () => {
    try {
      setLoading(true);
      const data = await supportService.getSupporters('video');
      console.log('Fetched supporters:', data);

      if (Array.isArray(data)) {
        const transformedSupporters = data.map(supporter => ({
          id: supporter.supporter_id,
          supporter_id: supporter.supporter_id,
          name: supporter.name || 'Anonymous Supporter',
          specialization: supporter.qualifications || 'Mental Health Supporter',
          experience: supporter.experience || '5 years',
          rating: parseFloat(supporter.rating) || 4.5,
          reviews: supporter.reviews || 0,
          languages: ['English'],
          availability: supporter.availability || 'Check Availability',
          avatarColor: getRandomColor(),
          categories: supporter.categories ? supporter.categories.split(',') : [],
          price: '$50/session',
          role: supporter.qualifications || 'Mental Health Supporter'
        }));

        setSupporters(transformedSupporters);
      } else {
        setSupporters([]);
      }
    } catch (error) {
      console.error('Error fetching supporters:', error);
      toast.error('Failed to load supporters');
      setSupporters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = (supporter) => {
    if (!user) {
      toast.error('Please login to book a session');
      navigate('/login');
      return;
    }
    setSelectedSupporter(supporter);
    setBookingDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!bookingTime || !selectedSupporter || !user) {
      toast.error('Please select a time slot and make sure you are logged in');
      return;
    }

    try {
      const sessionData = {
        user_id: user.id,
        supporter_id: selectedSupporter.supporter_id || selectedSupporter.id,
        session_type: 'video',
        scheduled_time: bookingTime,
        duration_minutes: parseInt(bookingDuration),
        title: `Video Session with ${selectedSupporter.name || 'Supporter'}`,
        notes: 'Video counseling session booked'
      };

      await supportService.bookSession(sessionData);

      toast.success(`Video session booked with ${selectedSupporter.name || 'Supporter'} at ${bookingTime}`);
      setBookingDialogOpen(false);
      setBookingTime('');
      setBookingDuration('30 min');

      navigate('/sessions');

    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book session. Please try again.');
    }
  };

  const filteredSupporters = supporters.filter(supporter => {
    if (!supporter) return false;

    const name = supporter.name || '';
    const specialization = supporter.specialization || supporter.role || '';
    const categories = supporter.categories || [];

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      name.toLowerCase().includes(searchLower) ||
      specialization.toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategory === 'all' ||
      categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const CustomRating = ({ value }) => {
    const ratingValue = value || 0;
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const partialStar = ratingValue - fullStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} sx={{ fontSize: 20, color: '#FFD700' }} />);
    }

    if (partialStar > 0) {
      stars.push(
        <Box key="partial" sx={{ position: 'relative', display: 'inline-block' }}>
          <Star sx={{ fontSize: 20, color: '#E5E7EB' }} />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${partialStar * 100}%`,
              overflow: 'hidden',
            }}
          >
            <Star sx={{ fontSize: 20, color: '#FFD700' }} />
          </Box>
        </Box>
      );
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} sx={{ fontSize: 20, color: '#E5E7EB' }} />);
    }

    return <Box sx={{ display: 'flex' }}>{stars}</Box>;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
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
                    icon={<Schedule />}
                    label="Flexible Scheduling"
                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

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
                  color={selectedCategory === category.id ? 'primary' : 'default'}
                  variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Supporters Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredSupporters.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No supporters found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {supporters.length === 0
                ? 'No supporters available at the moment.'
                : 'Try adjusting your search or filter.'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredSupporters.map((supporter, index) => (
              <Grid item xs={12} md={6} key={supporter.supporter_id || supporter.id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ borderRadius: 3, height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            mr: 3,
                            bgcolor: supporter.avatarColor || getRandomColor(),
                            fontSize: '2rem',
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(supporter.name)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {supporter.name || 'Anonymous Supporter'}
                          </Typography>
                          <Typography color="text.secondary" sx={{ mb: 1 }}>
                            {supporter.specialization || supporter.role || 'Mental Health Supporter'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <CustomRating value={supporter.rating} />
                            <Typography variant="body2" color="text.secondary">
                              {(supporter.rating || 4.5).toFixed(1)} ({supporter.reviews || 0} reviews)
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {supporter.experience || '5 years'} years of experience
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Language sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {supporter.languages || 'English'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Specializes in:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {supporter.categories?.map((cat) => (
                            <Chip
                              key={cat}
                              label={typeof cat === 'string' ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'General'}
                              size="small"
                              variant="outlined"
                            />
                          )) || <Chip label="General Support" size="small" variant="outlined" />}
                        </Box>
                      </Box> */}

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Chip
                          icon={<Schedule />}
                          label={supporter.availability || 'Check Availability'}
                          color={(supporter.availability || '').includes('Now') ? 'success' : 'warning'}
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
        )}

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
                  <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: selectedSupporter.avatarColor || getRandomColor() }}>
                    {getInitials(selectedSupporter.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedSupporter.name || 'Supporter'}
                    </Typography>
                    <Typography color="text.secondary">
                      {selectedSupporter.specialization || selectedSupporter.role || 'Mental Health Supporter'}
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
                    onClick={() => setBookingDuration(duration)}
                    color={bookingDuration === duration ? 'primary' : 'default'}
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
              onClick={handleConfirmBooking}
              disabled={!bookingTime}
            >
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default VideoSupport;