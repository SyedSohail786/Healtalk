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
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  TrendingUp,
  Warning,
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
  Delete,
  Visibility,
  Mail,
  Phone,
  CalendarToday,
  Refresh,
  Download,
  FilterList,
  Search,
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

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data initialization
    const mockUsers = [
      { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1 (555) 123-4567', status: 'active', role: 'user', joined: '2024-01-15', lastActive: '2 hours ago', sessions: 12 },
      { id: 2, name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 (555) 987-6543', status: 'pending', role: 'supporter', joined: '2024-01-14', lastActive: '5 hours ago', sessions: 0 },
      { id: 3, name: 'Alex Chen', email: 'alex@example.com', phone: '+1 (555) 456-7890', status: 'active', role: 'user', joined: '2024-01-13', lastActive: '1 day ago', sessions: 5 },
      { id: 4, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 (555) 234-5678', status: 'suspended', role: 'supporter', joined: '2024-01-12', lastActive: '2 days ago', sessions: 24 },
      { id: 5, name: 'Mike Brown', email: 'mike@example.com', phone: '+1 (555) 345-6789', status: 'active', role: 'user', joined: '2024-01-11', lastActive: '3 days ago', sessions: 8 },
      { id: 6, name: 'Lisa Wang', email: 'lisa@example.com', phone: '+1 (555) 567-8901', status: 'active', role: 'admin', joined: '2024-01-10', lastActive: 'Just now', sessions: 0 },
      { id: 7, name: 'David Kim', email: 'david@example.com', phone: '+1 (555) 678-9012', status: 'pending', role: 'user', joined: '2024-01-09', lastActive: '4 days ago', sessions: 0 },
      { id: 8, name: 'Maria Garcia', email: 'maria@example.com', phone: '+1 (555) 789-0123', status: 'active', role: 'supporter', joined: '2024-01-08', lastActive: '1 hour ago', sessions: 18 },
    ];

    const mockReports = [
      { id: 1, user: 'John Doe', type: 'Inappropriate Content', status: 'pending', date: '2024-01-15', priority: 'high' },
      { id: 2, user: 'Jane Smith', type: 'Harassment', status: 'investigating', date: '2024-01-14', priority: 'high' },
      { id: 3, user: 'Bob Wilson', type: 'Spam', status: 'resolved', date: '2024-01-13', priority: 'medium' },
      { id: 4, user: 'Alice Brown', type: 'Technical Issue', status: 'pending', date: '2024-01-12', priority: 'low' },
    ];

    setUsers(mockUsers);
    setReports(mockReports);
    setLoading(false);
  }, []);

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: <People />, color: 'primary' },
    { label: 'Active Sessions', value: '142', change: '+8%', icon: <Chat />, color: 'secondary' },
    { label: 'Revenue', value: '$12,847', change: '+23%', icon: <AttachMoney />, color: 'success' },
    { label: 'Support Groups', value: '48', change: '+5%', icon: <Groups />, color: 'warning' },
    { label: 'Reports', value: '24', change: '-3%', icon: <Warning />, color: 'error' },
    { label: 'Avg. Rating', value: '4.8', change: '+0.2', icon: <Psychology />, color: 'info' },
  ];

  const growthChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New Users',
        data: [65, 78, 92, 85, 105, 120, 142],
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Sessions',
        data: [45, 58, 72, 65, 85, 100, 122],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [8500, 9200, 10500, 9800, 11200, 12500, 13400, 12800, 14200, 15600, 14800, 16800],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ['Anxiety', 'Depression', 'Stress', 'Relationships', 'Trauma', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 10, 5, 5],
        backgroundColor: [
          '#4F46E5',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#6B7280',
        ],
      },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUserAction = (userId, action) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: action } : user
    ));
    toast.success(`User ${action} successfully`);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handleCloseUserDialog = () => {
    setUserDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = () => {
    // Update user logic here
    toast.success('User updated successfully');
    setUserDialogOpen(false);
  };

  const handleExportData = () => {
    toast.success('Data exported successfully');
  };

  const getStatusChip = (status) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      suspended: 'error',
      investigating: 'info',
      resolved: 'success',
    };
    const icons = {
      active: <CheckCircle sx={{ fontSize: 14 }} />,
      pending: <Warning sx={{ fontSize: 14 }} />,
      suspended: <Block sx={{ fontSize: 14 }} />,
      investigating: <Warning sx={{ fontSize: 14 }} />,
      resolved: <CheckCircle sx={{ fontSize: 14 }} />,
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

  const getPriorityChip = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success',
    };
    return (
      <Chip
        label={priority.toUpperCase()}
        color={colors[priority]}
        size="small"
      />
    );
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
              Admin Dashboard
            </Typography>
            <Typography color="text.secondary">
              Manage users, sessions, and platform analytics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              select
              size="small"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="day">Last 24 Hours</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </TextField>
            <Button variant="outlined" startIcon={<Refresh />}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<Download />} onClick={handleExportData}>
              Export
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
          <Tab label="Users" />
          <Tab label="Reports" />
          <Tab label="Analytics" />
          <Tab label="Settings" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Platform Growth
                    </Typography>
                    <Chip icon={<TrendingUp />} label="Growing" color="success" size="small" />
                  </Box>
                  <Box sx={{ height: 400 }}>
                    <Bar
                      data={growthChartData}
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
                        Revenue Trend
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <Line
                          data={revenueChartData}
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
                        Support Categories
                      </Typography>
                      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pie
                          data={categoryData}
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
                    Recent Activity
                  </Typography>
                  <List>
                    {[
                      { user: 'John Smith', action: 'joined the platform', time: '2 hours ago' },
                      { user: 'Dr. Sarah', action: 'completed 5 sessions', time: '3 hours ago' },
                      { user: 'System', action: 'platform update v2.1', time: '5 hours ago' },
                      { user: 'Mike Brown', action: 'reported content', time: '1 day ago' },
                      { user: 'Admin', action: 'resolved 3 reports', time: '1 day ago' },
                    ].map((activity, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              <Typography component="span" sx={{ fontWeight: 600 }}>
                                {activity.user}
                              </Typography>{' '}
                              {activity.action}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Add New User', icon: <People /> },
                      { label: 'View Reports', icon: <Warning /> },
                      { label: 'Manage Sessions', icon: <Chat /> },
                      { label: 'System Settings', icon: <AdminPanelSettings /> },
                    ].map((action, index) => (
                      <Grid item xs={6} key={index}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={action.icon}
                          onClick={() => setActiveTab(index + 1)}
                          sx={{ py: 1.5 }}
                        >
                          {action.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Users Tab */}
        {activeTab === 1 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  User Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search users..."
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                  <Button variant="contained" startIcon={<People />}>
                    Add User
                  </Button>
                </Box>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Sessions</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.light' }}>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(user.status)}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            variant="outlined"
                            color={user.role === 'admin' ? 'error' : user.role === 'supporter' ? 'secondary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.sessions}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.joined}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last active: {user.lastActive}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => handleViewUser(user)}>
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            {user.status === 'active' ? (
                              <Tooltip title="Suspend">
                                <IconButton size="small" onClick={() => handleUserAction(user.id, 'suspended')}>
                                  <Block color="warning" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Activate">
                                <IconButton size="small" onClick={() => handleUserAction(user.id, 'active')}>
                                  <CheckCircle color="success" />
                                </IconButton>
                              </Tooltip>
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

        {/* Reports Tab */}
        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Incident Reports
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select label="Filter" defaultValue="all">
                      <MenuItem value="all">All Reports</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="investigating">Investigating</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="outlined" startIcon={<FilterList />}>
                    Filters
                  </Button>
                </Box>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Report ID</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            #{report.id.toString().padStart(4, '0')}
                          </Typography>
                        </TableCell>
                        <TableCell>{report.user}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{getPriorityChip(report.priority)}</TableCell>
                        <TableCell>{getStatusChip(report.status)}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button size="small" variant="outlined">
                              View
                            </Button>
                            <Button size="small" variant="contained">
                              Resolve
                            </Button>
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

        {/* Analytics Tab */}
        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Session Analytics
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line
                      data={revenueChartData}
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
                    User Demographics
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Pie
                      data={categoryData}
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
        )}

        {/* Settings Tab */}
        {activeTab === 4 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                Platform Settings
              </Typography>
              <Grid container spacing={4}>
                {[
                  {
                    title: 'General Settings',
                    settings: [
                      { label: 'Platform Name', value: 'HealTalk', editable: true },
                      { label: 'Contact Email', value: 'support@healtalk.com', editable: true },
                      { label: 'Platform URL', value: 'https://healtalk.com', editable: true },
                    ],
                  },
                  {
                    title: 'Session Settings',
                    settings: [
                      { label: 'Session Duration', value: '45 minutes', editable: true },
                      { label: 'Max Sessions/Day', value: '5', editable: true },
                      { label: 'Session Buffer', value: '15 minutes', editable: true },
                    ],
                  },
                  {
                    title: 'Notification Settings',
                    settings: [
                      { label: 'Email Notifications', value: true, type: 'switch' },
                      { label: 'Push Notifications', value: true, type: 'switch' },
                      { label: 'SMS Notifications', value: false, type: 'switch' },
                    ],
                  },
                  {
                    title: 'Security Settings',
                    settings: [
                      { label: 'Two-Factor Auth', value: true, type: 'switch' },
                      { label: 'Session Timeout', value: '30 minutes', editable: true },
                      { label: 'Password Policy', value: 'Strong', editable: true },
                    ],
                  },
                ].map((section, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                          {section.title}
                        </Typography>
                        <List>
                          {section.settings.map((setting, settingIndex) => (
                            <ListItem key={settingIndex} sx={{ px: 0 }}>
                              <ListItemText
                                primary={setting.label}
                                secondary={
                                  setting.type === 'switch' ? (
                                    <Switch checked={setting.value} />
                                  ) : setting.editable ? (
                                    <TextField
                                      size="small"
                                      value={setting.value}
                                      sx={{ mt: 1 }}
                                    />
                                  ) : (
                                    setting.value
                                  )
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* User Details Dialog */}
        <Dialog
          open={userDialogOpen}
          onClose={handleCloseUserDialog}
          maxWidth="sm"
          fullWidth
        >
          {selectedUser && (
            <>
              <DialogTitle>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  User Details
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main', fontSize: '2rem' }}>
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {selectedUser.name}
                      </Typography>
                      <Typography color="text.secondary">
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {getStatusChip(selectedUser.status)}
                      </Box>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={selectedUser.email}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <Mail sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={selectedUser.phone}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Joined Date"
                        value={selectedUser.joined}
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
                        label="Last Active"
                        value={selectedUser.lastActive}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Total Sessions"
                        value={selectedUser.sessions}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <Chat sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={handleCloseUserDialog}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleUpdateUser}>
                  Save Changes
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </motion.div>
    </Container>
  );
};


export default AdminDashboard;