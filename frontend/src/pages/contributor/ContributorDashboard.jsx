import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  Switch,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  SupportAgent,
  People,
  TrendingUp,
  Schedule,
  CheckCircle,
  Block,
  MoreVert,
  BarChart,
  AttachMoney,
  Groups,
  Chat,
  Videocam,
  Psychology,
  NotificationsActive,
  Edit,
  Visibility,
  CalendarToday,
  Refresh,
  Download,
  FilterList,
  Search,
  Star,
  AccessTime,
  Timer,
  PendingActions,
  DoneAll,
  Cancel,
  Mic,
  Headset,
  Message,
  EmojiEvents,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ContributorDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState(0);
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '10:00', end: '14:00' },
    sunday: { enabled: false, start: '10:00', end: '14:00' },
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);

  useEffect(() => {
    // Mock data initialization
    const mockSessions = [
      { id: 1, user: 'John Smith', type: 'Video', scheduled: '2024-01-15 14:00', duration: '45 min', status: 'upcoming', rating: null },
      { id: 2, user: 'Emma Wilson', type: 'Audio', scheduled: '2024-01-15 11:00', duration: '30 min', status: 'completed', rating: 5 },
      { id: 3, user: 'Alex Chen', type: 'Chat', scheduled: '2024-01-14 16:00', duration: '60 min', status: 'completed', rating: 4 },
      { id: 4, user: 'Sarah Johnson', type: 'Video', scheduled: '2024-01-14 10:00', duration: '45 min', status: 'completed', rating: 5 },
      { id: 5, user: 'Mike Brown', type: 'Audio', scheduled: '2024-01-13 15:00', duration: '30 min', status: 'completed', rating: 4 },
      { id: 6, user: 'Lisa Wang', type: 'Chat', scheduled: '2024-01-13 09:00', duration: '45 min', status: 'cancelled', rating: null },
      { id: 7, user: 'David Kim', type: 'Video', scheduled: '2024-01-12 13:00', duration: '60 min', status: 'completed', rating: 5 },
      { id: 8, user: 'Maria Garcia', type: 'Audio', scheduled: '2024-01-12 11:00', duration: '30 min', status: 'completed', rating: 5 },
    ];

    setSessions(mockSessions);
    setLoading(false);
  }, []);

  const stats = [
    { label: 'Total Sessions', value: '124', change: '+18%', icon: <Chat />, color: 'primary' },
    { label: 'Avg. Rating', value: '4.8/5', change: '+0.2', icon: <Star />, color: 'secondary' },
    { label: 'Earnings', value: '$2,847', change: '+23%', icon: <AttachMoney />, color: 'success' },
    { label: 'Active Hours', value: '68h', change: '+12%', icon: <Timer />, color: 'warning' },
    { label: 'Upcoming', value: '3', change: '-1', icon: <Schedule />, color: 'info' },
    { label: 'Satisfaction', value: '96%', change: '+3%', icon: <EmojiEvents />, color: 'error' },
  ];

  const performanceChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sessions',
        data: [8, 12, 10, 14, 16, 6, 4],
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Rating (x10)',
        data: [46, 48, 47, 49, 48, 46, 47],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const earningsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Earnings',
        data: [1200, 1500, 1800, 2100, 2400, 2800, 3000, 3200, 3500, 3800, 4000, 4200],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const sessionTypeData = {
    labels: ['Video', 'Audio', 'Chat'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: [
          '#4F46E5',
          '#10B981',
          '#F59E0B',
        ],
      },
    ],
  };

  const recentReviews = [
    { user: 'John Smith', comment: 'Very helpful and understanding. Great listener!', rating: 5, date: '2 hours ago' },
    { user: 'Emma Wilson', comment: 'Provided excellent coping strategies. Thank you!', rating: 5, date: '1 day ago' },
    { user: 'Alex Chen', comment: 'Patient and knowledgeable. Highly recommend.', rating: 4, date: '2 days ago' },
    { user: 'Sarah Johnson', comment: 'Made me feel heard and understood. Great session.', rating: 5, date: '3 days ago' },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value,
      },
    });
  };

  const handleSessionAction = (sessionId, action) => {
    setSessions(sessions.map(session => 
      session.id === sessionId ? { ...session, status: action } : session
    ));
    toast.success(`Session ${action} successfully`);
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setSessionDialogOpen(true);
  };

  const handleCloseSessionDialog = () => {
    setSessionDialogOpen(false);
    setSelectedSession(null);
  };

  const handleStartSession = (sessionId) => {
    toast.success('Session started! Redirecting to chat...');
    // In real app, navigate to session interface
  };

  const getStatusChip = (status) => {
    const colors = {
      upcoming: 'warning',
      completed: 'success',
      cancelled: 'error',
      in_progress: 'info',
    };
    const icons = {
      upcoming: <Schedule sx={{ fontSize: 14 }} />,
      completed: <CheckCircle sx={{ fontSize: 14 }} />,
      cancelled: <Cancel sx={{ fontSize: 14 }} />,
      in_progress: <Timer sx={{ fontSize: 14 }} />,
    };
    return (
      <Chip
        icon={icons[status]}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={colors[status]}
        size="small"
        variant="outlined"
      />
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video': return <Videocam sx={{ color: 'primary.main' }} />;
      case 'Audio': return <Mic sx={{ color: 'secondary.main' }} />;
      case 'Chat': return <Message sx={{ color: 'success.main' }} />;
      default: return <Chat />;
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        sx={{
          fontSize: 16,
          color: rating && i < rating ? '#FFD700' : '#E5E7EB',
        }}
      />
    ));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Contributor Dashboard
            </Typography>
            <Typography color="text.secondary">
              Manage your sessions, availability, and support activities
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<CheckCircle />}
              label="Available"
              color="success"
              variant="outlined"
            />
            <Button variant="contained" startIcon={<SupportAgent />}>
              Update Profile
            </Button>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="text.secondary" variant="body2" gutterBottom>
                          {stat.label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: stat.change.startsWith('+') ? 'success.main' : 'error.main',
                            mt: 0.5,
                          }}
                        >
                          {stat.change} from last {timeRange}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: `${stat.color}.light`,
                          color: `${stat.color}.main`,
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        mt: 3,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: `${stat.color}.main`,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Sessions" />
          <Tab label="Availability" />
          <Tab label="Reviews" />
          <Tab label="Analytics" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Weekly Performance
                    </Typography>
                    <Chip icon={<TrendingUp />} label="Improving" color="success" size="small" />
                  </Box>
                  <Box sx={{ height: 400 }}>
                    <Bar
                      data={performanceChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Earnings Trend
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <Line
                          data={earningsChartData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'top',
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Session Types
                      </Typography>
                      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pie
                          data={sessionTypeData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'right',
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Start Session', icon: <Videocam />, color: 'primary' },
                      { label: 'View Schedule', icon: <CalendarToday />, color: 'secondary' },
                      { label: 'Check Messages', icon: <Message />, color: 'success' },
                      { label: 'Update Profile', icon: <Edit />, color: 'warning' },
                    ].map((action, index) => (
                      <Grid item xs={6} key={index}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={action.icon}
                          sx={{
                            py: 1.5,
                            borderColor: `${action.color}.main`,
                            color: `${action.color}.main`,
                            '&:hover': {
                              borderColor: `${action.color}.dark`,
                              bgcolor: `${action.color}10`,
                            },
                          }}
                        >
                          {action.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Reviews
                  </Typography>
                  <List>
                    {recentReviews.map((review, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar>
                              {review.user.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {review.user}
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                  {getRatingStars(review.rating)}
                                </Box>
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary">
                                  {review.comment}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {review.date}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < recentReviews.length - 1 && <Divider variant="inset" />}
                      </React.Fragment>
                    ))}
                  </List>
                  <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                    View All Reviews
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Sessions Tab */}
        {activeTab === 1 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Session Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search sessions..."
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select label="Filter" defaultValue="all">
                      <MenuItem value="all">All Sessions</MenuItem>
                      <MenuItem value="upcoming">Upcoming</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Scheduled Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.light' }}>
                              {session.user.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {session.user}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getTypeIcon(session.type)}
                            <Typography variant="body2">
                              {session.type}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {session.scheduled}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {session.duration}
                          </Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(session.status)}</TableCell>
                        <TableCell>
                          {session.rating ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getRatingStars(session.rating)}
                              <Typography variant="body2" sx={{ ml: 0.5 }}>
                                ({session.rating}/5)
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No rating yet
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            {session.status === 'upcoming' && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleStartSession(session.id)}
                                >
                                  Start
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleSessionAction(session.id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            {session.status === 'completed' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleViewSession(session)}
                              >
                                Details
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Availability Tab */}
        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                Manage Availability
              </Typography>
              <Grid container spacing={3}>
                {Object.entries(availability).map(([day, schedule]) => (
                  <Grid item xs={12} key={day}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Grid container alignItems="center" spacing={3}>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Switch
                                checked={schedule.enabled}
                                onChange={(e) => handleAvailabilityChange(day, 'enabled', e.target.checked)}
                              />
                              <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                {day}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={9}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={5}>
                                <TextField
                                  fullWidth
                                  label="Start Time"
                                  type="time"
                                  value={schedule.start}
                                  onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                                  disabled={!schedule.enabled}
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={5}>
                                <TextField
                                  fullWidth
                                  label="End Time"
                                  type="time"
                                  value={schedule.end}
                                  onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                                  disabled={!schedule.enabled}
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Chip
                                  label={schedule.enabled ? 'Available' : 'Unavailable'}
                                  color={schedule.enabled ? 'success' : 'error'}
                                  size="small"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Availability Summary
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                  You are available {Object.values(availability).filter(a => a.enabled).length} days per week
                </Typography>
                <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main' }}>
                  Save Changes
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Reviews Tab */}
        {activeTab === 3 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Client Reviews & Ratings
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      4.8/5
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                      {getRatingStars(4.8)}
                    </Box>
                    <Typography color="text.secondary">
                      (124 reviews)
                    </Typography>
                  </Box>
                </Box>
                <Button variant="outlined" startIcon={<Download />}>
                  Export Reviews
                </Button>
              </Box>

              <Grid container spacing={3}>
                {recentReviews.concat(recentReviews).map((review, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ mr: 2 }}>
                            {review.user.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {review.user}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getRatingStars(review.rating)}
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                {review.date}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          "{review.comment}"
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button variant="outlined">
                  Load More Reviews
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Session Analytics
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line
                      data={earningsChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Session Types Distribution
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Pie
                      data={sessionTypeData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Performance Metrics
                  </Typography>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Response Time', value: '2.3 min', target: '< 5 min', status: 'good' },
                      { label: 'Session Completion', value: '98%', target: '> 95%', status: 'good' },
                      { label: 'Client Satisfaction', value: '96%', target: '> 90%', status: 'good' },
                      { label: 'Repeat Clients', value: '65%', target: '> 60%', status: 'good' },
                    ].map((metric, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                          <CardContent>
                            <Typography color="text.secondary" variant="body2" gutterBottom>
                              {metric.label}
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                              {metric.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Target: {metric.target}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={metric.status === 'good' ? 100 : 70}
                              color={metric.status === 'good' ? 'success' : 'warning'}
                              sx={{ mt: 2, height: 6, borderRadius: 3 }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Session Details Dialog */}
        <Dialog
          open={sessionDialogOpen}
          onClose={handleCloseSessionDialog}
          maxWidth="sm"
          fullWidth
        >
          {selectedSession && (
            <>
              <DialogTitle>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Session Details
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main', fontSize: '2rem' }}>
                      {selectedSession.user.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {selectedSession.user}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        {getTypeIcon(selectedSession.type)}
                        <Typography variant="body1">
                          {selectedSession.type} Session
                        </Typography>
                        {getStatusChip(selectedSession.status)}
                      </Box>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Scheduled Time"
                        value={selectedSession.scheduled}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={selectedSession.duration}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <Timer sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        multiline
                        rows={4}
                        placeholder="Add session notes here..."
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    {selectedSession.rating && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Rating:
                          </Typography>
                          <Box sx={{ display: 'flex' }}>
                            {getRatingStars(selectedSession.rating)}
                          </Box>
                          <Typography variant="body1">
                            ({selectedSession.rating}/5)
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={handleCloseSessionDialog}>
                  Close
                </Button>
                <Button variant="contained">
                  Save Notes
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </motion.div>
    </Container>
  );
};

// Add toast import at the top

export default ContributorDashboard;