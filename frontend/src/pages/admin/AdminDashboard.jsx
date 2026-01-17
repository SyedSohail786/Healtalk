// AdminDashboard.jsx - Complete version with all CRUD operations
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
  List,
  ListItem,
  ListItemText,
  Tooltip, // MUI Tooltip
  CircularProgress,
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  TrendingUp,
  Warning,
  CheckCircle,
  Block,
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
  Add,
  Article,
  Category,
  Group,
  Report,
  Schedule,
  Feedback,
  NotificationImportant,
  PersonAdd,
  Security,
  Settings as SettingsIcon,
  Image,
  Description,
  Upload,
  Check,
  Clear,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  Sort,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
// Rename the Tooltip import from chart.js to avoid conflict
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip as ChartTooltip, // Renamed to avoid conflict
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Use the renamed ChartTooltip
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, ChartTooltip, Legend, ArcElement);

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// API Service functions
const api = {
  // Users
  getUsers: () => axios.get(`${API_BASE_URL}/admin/users`),
  createUser: (userData) => axios.post(`${API_BASE_URL}/admin/users`, userData),
  updateUser: (id, userData) => axios.put(`${API_BASE_URL}/admin/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`${API_BASE_URL}/admin/users/${id}`),
  assignRole: (userId, roleId) => axios.post(`${API_BASE_URL}/admin/users/${userId}/role`, { roleId }),

  // Articles
  getArticles: () => axios.get(`${API_BASE_URL}/articles`),
  createArticle: (articleData) => axios.post(`${API_BASE_URL}/articles/add`, articleData),
  updateArticle: (id, articleData) => axios.put(`${API_BASE_URL}/articles/${id}`, articleData),
  deleteArticle: (id) => axios.delete(`${API_BASE_URL}/articles/${id}`),

  // Groups
  getGroups: () => axios.get(`${API_BASE_URL}/groups`),
  createGroup: (groupData) => axios.post(`${API_BASE_URL}/groups/create`, groupData),
  updateGroup: (id, groupData) => axios.put(`${API_BASE_URL}/groups/${id}`, groupData),
  deleteGroup: (id) => axios.delete(`${API_BASE_URL}/groups/${id}`),
  getGroupMembers: (groupId) => axios.get(`${API_BASE_URL}/groups/${groupId}/members`),
  addGroupMember: (groupId, userId) => axios.post(`${API_BASE_URL}/groups/join`, { group_id: groupId, user_id: userId }),
  removeGroupMember: (groupId, userId) => axios.delete(`${API_BASE_URL}/groups/${groupId}/members/${userId}`),

  // Chat Sessions
  getChatSessions: () => axios.get(`${API_BASE_URL}/admin/chat-sessions`),
  deleteChatSession: (id) => axios.delete(`${API_BASE_URL}/admin/chat-sessions/${id}`),

  // Scheduled Sessions
  getScheduledSessions: () => axios.get(`${API_BASE_URL}/admin/scheduled-sessions`),
  createScheduledSession: (sessionData) => axios.post(`${API_BASE_URL}/admin/scheduled-sessions`, sessionData),
  updateScheduledSession: (id, sessionData) => axios.put(`${API_BASE_URL}/admin/scheduled-sessions/${id}`, sessionData),
  deleteScheduledSession: (id) => axios.delete(`${API_BASE_URL}/admin/scheduled-sessions/${id}`),

  // Roles
  getRoles: () => axios.get(`${API_BASE_URL}/admin/roles`),
  createRole: (roleData) => axios.post(`${API_BASE_URL}/admin/roles`, roleData),
  updateRole: (id, roleData) => axios.put(`${API_BASE_URL}/admin/roles/${id}`, roleData),
  deleteRole: (id) => axios.delete(`${API_BASE_URL}/admin/roles/${id}`),

  // Categories
  getCategories: () => axios.get(`${API_BASE_URL}/categories`),
  createCategory: (categoryData) => axios.post(`${API_BASE_URL}/categories/add`, categoryData),
  updateCategory: (id, categoryData) => axios.put(`${API_BASE_URL}/categories/${id}`, categoryData),
  deleteCategory: (id) => axios.delete(`${API_BASE_URL}/categories/${id}`),

  // Supporters
  getSupporters: () => axios.get(`${API_BASE_URL}/admin/supporters`),
  createSupporter: (supporterData) => axios.post(`${API_BASE_URL}/admin/supporters`, supporterData),
  updateSupporter: (id, supporterData) => axios.put(`${API_BASE_URL}/admin/supporters/${id}`, supporterData),
  deleteSupporter: (id) => axios.delete(`${API_BASE_URL}/admin/supporters/${id}`),
  verifySupporter: (id) => axios.post(`${API_BASE_URL}/admin/supporters/${id}/verify`),

  // Reports
  getReports: () => axios.get(`${API_BASE_URL}/reports`),
  updateReportStatus: (id, status) => axios.put(`${API_BASE_URL}/reports/${id}/status`, { status }),
  deleteReport: (id) => axios.delete(`${API_BASE_URL}/reports/${id}`),

  // Feedback
  getFeedback: () => axios.get(`${API_BASE_URL}/feedback`),
  deleteFeedback: (id) => axios.delete(`${API_BASE_URL}/feedback/${id}`),

  // Notifications
  getNotifications: () => axios.get(`${API_BASE_URL}/admin/notifications`),
  createNotification: (notificationData) => axios.post(`${API_BASE_URL}/notifications/send`, notificationData),
  deleteNotification: (id) => axios.delete(`${API_BASE_URL}/notifications/${id}`),

  // Dashboard Stats
  getDashboardStats: () => axios.get(`${API_BASE_URL}/admin/dashboard-stats`),
};

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [articleForm, setArticleForm] = useState({ title: '', content: '', created_by: '', image: null });
  const [groupForm, setGroupForm] = useState({ name: '', category_id: '', created_by: '' });
  const [sessionForm, setSessionForm] = useState({ 
    user_id: '', 
    supporter_id: '', 
    session_type: 'chat', 
    scheduled_time: '', 
    duration_minutes: 60, 
    title: '', 
    notes: '' 
  });
  const [roleForm, setRoleForm] = useState({ role_name: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [supporterForm, setSupporterForm] = useState({ 
    user_id: '', 
    bio: '', 
    experience: '', 
    qualifications: '', 
    status: 'pending', 
    is_verified: false 
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        statsRes,
        usersRes,
        articlesRes,
        groupsRes,
        chatSessionsRes,
        scheduledSessionsRes,
        rolesRes,
        categoriesRes,
        supportersRes,
        reportsRes,
        feedbackRes,
        notificationsRes
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getUsers(),
        api.getArticles(),
        api.getGroups(),
        api.getChatSessions(),
        api.getScheduledSessions(),
        api.getRoles(),
        api.getCategories(),
        api.getSupporters(),
        api.getReports(),
        api.getFeedback(),
        api.getNotifications()
      ]);

      setStats(statsRes.data || []);
      setUsers(usersRes.data || []);
      setArticles(articlesRes.data || []);
      setGroups(groupsRes.data || []);
      setChatSessions(chatSessionsRes.data || []);
      setScheduledSessions(scheduledSessionsRes.data || []);
      setRoles(rolesRes.data || []);
      setCategories(categoriesRes.data || []);
      setSupporters(supportersRes.data || []);
      setReports(reportsRes.data || []);
      setFeedback(feedbackRes.data || []);
      setNotifications(notificationsRes.data || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setEditMode(!!item);
    
    // Reset forms based on type
    switch(type) {
      case 'user':
        setUserForm(item || { name: '', email: '', password: '', phone: '', role: 'user' });
        break;
      case 'article':
        setArticleForm(item || { title: '', content: '', created_by: '', image: null });
        break;
      case 'group':
        setGroupForm(item || { name: '', category_id: '', created_by: '' });
        break;
      case 'session':
        setSessionForm(item || { 
          user_id: '', 
          supporter_id: '', 
          session_type: 'chat', 
          scheduled_time: '', 
          duration_minutes: 60, 
          title: '', 
          notes: '' 
        });
        break;
      case 'role':
        setRoleForm(item || { role_name: '' });
        break;
      case 'category':
        setCategoryForm(item || { name: '', description: '' });
        break;
      case 'supporter':
        setSupporterForm(item || { 
          user_id: '', 
          bio: '', 
          experience: '', 
          qualifications: '', 
          status: 'pending', 
          is_verified: false 
        });
        break;
    }
    
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType('');
    setSelectedItem(null);
    setEditMode(false);
  };

  // CRUD Operations
  const handleCreateUser = async () => {
    try {
      await api.createUser(userForm);
      toast.success('User created successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await api.updateUser(selectedItem.user_id, userForm);
      toast.success('User updated successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(id);
        toast.success('User deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleCreateArticle = async () => {
    try {
      await api.createArticle(articleForm);
      toast.success('Article created successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to create article');
    }
  };

  const handleUpdateArticle = async () => {
    try {
      await api.updateArticle(selectedItem.article_id, articleForm);
      toast.success('Article updated successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to update article');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.deleteArticle(id);
        toast.success('Article deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete article');
      }
    }
  };

  const handleCreateGroup = async () => {
    try {
      await api.createGroup(groupForm);
      toast.success('Group created successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const handleUpdateGroup = async () => {
    try {
      await api.updateGroup(selectedItem.group_id, groupForm);
      toast.success('Group updated successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to update group');
    }
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await api.deleteGroup(id);
        toast.success('Group deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete group');
      }
    }
  };

  const handleDeleteChatSession = async (id) => {
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      try {
        await api.deleteChatSession(id);
        toast.success('Chat session deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete chat session');
      }
    }
  };

  const handleCreateRole = async () => {
    try {
      await api.createRole(roleForm);
      toast.success('Role created successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to create role');
    }
  };

  const handleUpdateRole = async () => {
    try {
      await api.updateRole(selectedItem.role_id, roleForm);
      toast.success('Role updated successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await api.deleteRole(id);
        toast.success('Role deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete role');
      }
    }
  };

  const handleCreateCategory = async () => {
    try {
      await api.createCategory(categoryForm);
      toast.success('Category created successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await api.updateCategory(selectedItem.category_id, categoryForm);
      toast.success('Category updated successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(id);
        toast.success('Category deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleCreateSupporter = async () => {
    try {
      await api.createSupporter(supporterForm);
      toast.success('Supporter created successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to create supporter');
    }
  };

  const handleUpdateSupporter = async () => {
    try {
      await api.updateSupporter(selectedItem.supporter_id, supporterForm);
      toast.success('Supporter updated successfully');
      fetchDashboardData();
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to update supporter');
    }
  };

  const handleDeleteSupporter = async (id) => {
    if (window.confirm('Are you sure you want to delete this supporter?')) {
      try {
        await api.deleteSupporter(id);
        toast.success('Supporter deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete supporter');
      }
    }
  };

  const handleExportData = () => {
    const data = { users, articles, groups, chatSessions, scheduledSessions };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Data exported successfully');
  };

  const getStatusChip = (status) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      suspended: 'error',
      investigating: 'info',
      resolved: 'success',
      online: 'success',
      offline: 'default',
      busy: 'warning',
      scheduled: 'info',
      completed: 'success',
      cancelled: 'error',
    };
    
    const icons = {
      active: <CheckCircle sx={{ fontSize: 14 }} />,
      pending: <Warning sx={{ fontSize: 14 }} />,
      suspended: <Block sx={{ fontSize: 14 }} />,
      investigating: <Warning sx={{ fontSize: 14 }} />,
      resolved: <CheckCircle sx={{ fontSize: 14 }} />,
      online: <CheckCircle sx={{ fontSize: 14 }} />,
      offline: <Clear sx={{ fontSize: 14 }} />,
      busy: <Warning sx={{ fontSize: 14 }} />,
    };
    
    return (
      <Chip
        icon={icons[status] || <Warning sx={{ fontSize: 14 }} />}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={colors[status] || 'default'}
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
        label={priority?.toUpperCase() || 'N/A'}
        color={colors[priority] || 'default'}
        size="small"
      />
    );
  };

  // Handler for dialog submit based on type
  const handleDialogSubmit = () => {
    switch(dialogType) {
      case 'user':
        editMode ? handleUpdateUser() : handleCreateUser();
        break;
      case 'article':
        editMode ? handleUpdateArticle() : handleCreateArticle();
        break;
      case 'group':
        editMode ? handleUpdateGroup() : handleCreateGroup();
        break;
      case 'role':
        editMode ? handleUpdateRole() : handleCreateRole();
        break;
      case 'category':
        editMode ? handleUpdateCategory() : handleCreateCategory();
        break;
      case 'supporter':
        editMode ? handleUpdateSupporter() : handleCreateSupporter();
        break;
      default:
        toast.error('Unknown dialog type');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Admin Dashboard</Typography>
            <Typography color="text.secondary">Manage users, sessions, and platform analytics</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField select size="small" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} sx={{ minWidth: 120 }}>
              <MenuItem value="day">Last 24 Hours</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </TextField>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchDashboardData}>Refresh</Button>
            <Button variant="contained" startIcon={<Download />} onClick={handleExportData}>Export</Button>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="text.secondary" variant="body2" gutterBottom>{stat.label}</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                        <Typography variant="body2" sx={{ color: stat.change?.startsWith('+') ? 'success.main' : 'error.main', mt: 0.5 }}>
                          {stat.change || '+0%'} from last {timeRange}
                        </Typography>
                      </Box>
                      <Box sx={{ width: 56, height: 56, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.light', color: 'primary.main' }}>
                        {stat.icon || <People />}
                      </Box>
                    </Box>
                    <LinearProgress variant="determinate" value={75} sx={{ mt: 3, height: 6, borderRadius: 3, bgcolor: 'grey.200' }} />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label="Users" />
          <Tab label="Articles" />
          <Tab label="Groups" />
          <Tab label="Sessions" />
          <Tab label="Supporters" />
          <Tab label="Reports" />
          <Tab label="Settings" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Platform Growth</Typography>
                    <Chip icon={<TrendingUp />} label="Growing" color="success" size="small" />
                  </Box>
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography>Growth chart would go here</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Recent Activity</Typography>
                  <List>
                    {users.slice(0, 5).map((user) => (
                      <ListItem key={user.user_id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={<Typography variant="body2"><strong>{user.name}</strong> joined the platform</Typography>}
                          secondary={<Typography variant="caption" color="text.secondary">{new Date(user.created_at).toLocaleDateString()}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
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
                <Typography variant="h6" sx={{ fontWeight: 600 }}>User Management</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField size="small" placeholder="Search users..." InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                  <Button variant="contained" startIcon={<PersonAdd />} onClick={() => handleOpenDialog('user')}>Add User</Button>
                </Box>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.user_id} hover>
                        <TableCell>{user.user_id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.light' }}>{user.name?.[0] || 'U'}</Avatar>
                            {user.name}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip label={user.role || 'user'} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenDialog('user', user)}><Edit /></IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => handleDeleteUser(user.user_id)}><Delete color="error" /></IconButton>
                            </Tooltip>
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

        {/* Articles Tab */}
        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Article Management</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField size="small" placeholder="Search articles..." InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                  <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog('article')}>Add Article</Button>
                </Box>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.article_id} hover>
                        <TableCell>{article.article_id}</TableCell>
                        <TableCell>{article.title}</TableCell>
                        <TableCell>{users.find(u => u.user_id === article.created_by)?.name || article.created_by}</TableCell>
                        <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenDialog('article', article)}><Edit /></IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => handleDeleteArticle(article.article_id)}><Delete color="error" /></IconButton>
                            </Tooltip>
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

        {/* Groups Tab */}
        {activeTab === 3 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Group Management</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField size="small" placeholder="Search groups..." InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                  <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog('group')}>Add Group</Button>
                </Box>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groups.map((group) => (
                      <TableRow key={group.group_id} hover>
                        <TableCell>{group.group_id}</TableCell>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{categories.find(c => c.category_id === group.category_id)?.name || 'N/A'}</TableCell>
                        <TableCell>{users.find(u => u.user_id === group.created_by)?.name || group.created_by}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenDialog('group', group)}><Edit /></IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => handleDeleteGroup(group.group_id)}><Delete color="error" /></IconButton>
                            </Tooltip>
                            <Tooltip title="Manage Members">
                              <IconButton size="small"><People /></IconButton>
                            </Tooltip>
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

        {/* Sessions Tab */}
        {activeTab === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Scheduled Sessions</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>User</TableCell>
                          <TableCell>Supporter</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Scheduled Time</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scheduledSessions.map((session) => (
                          <TableRow key={session.session_id} hover>
                            <TableCell>{session.session_id}</TableCell>
                            <TableCell>{users.find(u => u.user_id === session.user_id)?.name || session.user_id}</TableCell>
                            <TableCell>{supporters.find(s => s.supporter_id === session.supporter_id)?.name || session.supporter_id}</TableCell>
                            <TableCell>{session.session_type}</TableCell>
                            <TableCell>{new Date(session.scheduled_time).toLocaleString()}</TableCell>
                            <TableCell>{getStatusChip(session.status)}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Tooltip title="Edit">
                                  <IconButton size="small" onClick={() => handleOpenDialog('session', session)}><Edit /></IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton size="small"><Delete color="error" /></IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Chat Sessions</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>User</TableCell>
                          <TableCell>Supporter</TableCell>
                          <TableCell>Start Time</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {chatSessions.map((session) => (
                          <TableRow key={session.session_id} hover>
                            <TableCell>{session.session_id}</TableCell>
                            <TableCell>{users.find(u => u.user_id === session.user_id)?.name || session.user_id}</TableCell>
                            <TableCell>{supporters.find(s => s.supporter_id === session.supporter_id)?.name || session.supporter_id}</TableCell>
                            <TableCell>{new Date(session.start_time).toLocaleString()}</TableCell>
                            <TableCell>{getStatusChip(session.status)}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Tooltip title="View Messages">
                                  <IconButton size="small"><Visibility /></IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton size="small" onClick={() => handleDeleteChatSession(session.session_id)}><Delete color="error" /></IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Supporters Tab */}
        {activeTab === 5 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Supporter Management</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField size="small" placeholder="Search supporters..." InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                  <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog('supporter')}>Add Supporter</Button>
                </Box>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Verified</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supporters.map((supporter) => (
                      <TableRow key={supporter.supporter_id} hover>
                        <TableCell>{supporter.supporter_id}</TableCell>
                        <TableCell>{users.find(u => u.user_id === supporter.user_id)?.name || supporter.user_id}</TableCell>
                        <TableCell>{supporter.experience}</TableCell>
                        <TableCell>{getStatusChip(supporter.status)}</TableCell>
                        <TableCell>{supporter.is_verified ? <Check color="success" /> : <Clear color="error" />}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenDialog('supporter', supporter)}><Edit /></IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => handleDeleteSupporter(supporter.supporter_id)}><Delete color="error" /></IconButton>
                            </Tooltip>
                            <Tooltip title="Verify">
                              <IconButton size="small" onClick={() => api.verifySupporter(supporter.supporter_id).then(() => fetchDashboardData())}><Check color="success" /></IconButton>
                            </Tooltip>
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
        {activeTab === 6 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Incident Reports</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select label="Filter" defaultValue="all">
                      <MenuItem value="all">All Reports</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="outlined" startIcon={<FilterList />}>Filters</Button>
                </Box>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Reporter</TableCell>
                      <TableCell>Reported User</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.report_id} hover>
                        <TableCell>{report.report_id}</TableCell>
                        <TableCell>{users.find(u => u.user_id === report.reporter_id)?.name || report.reporter_id}</TableCell>
                        <TableCell>{users.find(u => u.user_id === report.reported_user_id)?.name || report.reported_user_id}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>{getStatusChip(report.status)}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button size="small" variant="outlined">View</Button>
                            <Button size="small" variant="contained">Resolve</Button>
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

        {/* Settings Tab */}
        {activeTab === 7 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>Platform Settings</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Roles Management</Typography>
                      <List>
                        {roles.map((role) => (
                          <ListItem key={role.role_id} sx={{ px: 0 }}>
                            <ListItemText primary={role.role_name} />
                            <IconButton size="small" onClick={() => handleOpenDialog('role', role)}><Edit /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteRole(role.role_id)}><Delete color="error" /></IconButton>
                          </ListItem>
                        ))}
                        <Button startIcon={<Add />} onClick={() => handleOpenDialog('role')} sx={{ mt: 2 }}>Add Role</Button>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Categories Management</Typography>
                      <List>
                        {categories.map((category) => (
                          <ListItem key={category.category_id} sx={{ px: 0 }}>
                            <ListItemText primary={category.name} secondary={category.description} />
                            <IconButton size="small" onClick={() => handleOpenDialog('category', category)}><Edit /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteCategory(category.category_id)}><Delete color="error" /></IconButton>
                          </ListItem>
                        ))}
                        <Button startIcon={<Add />} onClick={() => handleOpenDialog('category')} sx={{ mt: 2 }}>Add Category</Button>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Dialogs for CRUD operations */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editMode ? 'Edit' : 'Add New'} {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {dialogType === 'user' && (
              <Box sx={{ mt: 2 }}>
                <TextField fullWidth label="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} sx={{ mb: 2 }} />
                <TextField fullWidth label="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} sx={{ mb: 2 }} />
                <TextField fullWidth label="Password" type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} sx={{ mb: 2 }} />
                <TextField fullWidth label="Phone" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} sx={{ mb: 2 }} />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Role</InputLabel>
                  <Select label="Role" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="supporter">Supporter</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {dialogType === 'article' && (
              <Box sx={{ mt: 2 }}>
                <TextField fullWidth label="Title" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} sx={{ mb: 2 }} />
                <TextField fullWidth label="Content" multiline rows={4} value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} sx={{ mb: 2 }} />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Author</InputLabel>
                  <Select label="Author" value={articleForm.created_by} onChange={(e) => setArticleForm({ ...articleForm, created_by: e.target.value })}>
                    {users.map((user) => (
                      <MenuItem key={user.user_id} value={user.user_id}>{user.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="outlined" component="label" startIcon={<Upload />} sx={{ mb: 2 }}>
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={(e) => setArticleForm({ ...articleForm, image: e.target.files[0] })} />
                </Button>
              </Box>
            )}

            {dialogType === 'group' && (
              <Box sx={{ mt: 2 }}>
                <TextField fullWidth label="Group Name" value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} sx={{ mb: 2 }} />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category" value={groupForm.category_id} onChange={(e) => setGroupForm({ ...groupForm, category_id: e.target.value })}>
                    {categories.map((category) => (
                      <MenuItem key={category.category_id} value={category.category_id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Created By</InputLabel>
                  <Select label="Created By" value={groupForm.created_by} onChange={(e) => setGroupForm({ ...groupForm, created_by: e.target.value })}>
                    {users.map((user) => (
                      <MenuItem key={user.user_id} value={user.user_id}>{user.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {dialogType === 'role' && (
              <Box sx={{ mt: 2 }}>
                <TextField fullWidth label="Role Name" value={roleForm.role_name} onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })} sx={{ mb: 2 }} />
              </Box>
            )}

            {dialogType === 'category' && (
              <Box sx={{ mt: 2 }}>
                <TextField fullWidth label="Category Name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} sx={{ mb: 2 }} />
                <TextField fullWidth label="Description" multiline rows={3} value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} sx={{ mb: 2 }} />
              </Box>
            )}

            {dialogType === 'supporter' && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>User</InputLabel>
                  <Select label="User" value={supporterForm.user_id} onChange={(e) => setSupporterForm({ ...supporterForm, user_id: e.target.value })}>
                    {users.map((user) => (
                      <MenuItem key={user.user_id} value={user.user_id}>{user.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField fullWidth label="Bio" multiline rows={3} value={supporterForm.bio} onChange={(e) => setSupporterForm({ ...supporterForm, bio: e.target.value })} sx={{ mb: 2 }} />
                <TextField fullWidth label="Experience" value={supporterForm.experience} onChange={(e) => setSupporterForm({ ...supporterForm, experience: e.target.value })} sx={{ mb: 2 }} />
                <TextField fullWidth label="Qualifications" value={supporterForm.qualifications} onChange={(e) => setSupporterForm({ ...supporterForm, qualifications: e.target.value })} sx={{ mb: 2 }} />
                <FormControlLabel control={<Switch checked={supporterForm.is_verified} onChange={(e) => setSupporterForm({ ...supporterForm, is_verified: e.target.checked })} />} label="Verified" />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleDialogSubmit}>
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;