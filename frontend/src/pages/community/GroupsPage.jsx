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
  IconButton,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Groups,
  Add,
  People,
  Chat,
  Lock,
  Public,
  TrendingUp,
  CalendarToday,
  MoreVert,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const GroupsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userGroups, setUserGroups] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // New group form state
  const [newGroup, setNewGroup] = useState({
    name: '',
    category_id: '',
    created_by: '',
  });

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setIsLoggedIn(true);
        setNewGroup(prev => ({ ...prev, created_by: parsedData.id }));
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
    
    fetchGroups();
    fetchCategories();
    
    if (userData?.id) {
      fetchUserGroups();
    }
  }, []);

  // Update when userData changes
  useEffect(() => {
    if (userData?.id) {
      setNewGroup(prev => ({ ...prev, created_by: userData.id }));
      fetchUserGroups();
    }
  }, [userData]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/groups`);
      setGroups(response.data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      showSnackbar('Failed to load groups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUserGroups = async () => {
    if (!userData?.id) return;
    
    try {
      // Fetch groups where user is a member
      const response = await axios.get(`${API_BASE_URL}/groups`);
      const allGroups = response.data || [];
      
      // For now, we'll get user's groups from a separate endpoint
      // You should implement this endpoint in your backend
      try {
        const userGroupsResponse = await axios.get(`${API_BASE_URL}/groups/user/${userData.id}`);
        const userGroupIds = userGroupsResponse.data?.map(g => g.group_id) || [];
        setUserGroups(userGroupIds);
        
        // Also update groups with membership info
        setGroups(allGroups.map(group => ({
          ...group,
          isMember: userGroupIds.includes(group.group_id)
        })));
      } catch (err) {
        // If endpoint doesn't exist yet, use localStorage as fallback
        const storedUserGroups = localStorage.getItem(`userGroups_${userData.id}`);
        if (storedUserGroups) {
          const userGroupIds = JSON.parse(storedUserGroups);
          setUserGroups(userGroupIds);
          
          // Update groups with membership info
          setGroups(allGroups.map(group => ({
            ...group,
            isMember: userGroupIds.includes(group.group_id)
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    if (!userData?.id) {
      showSnackbar('Please login to join groups', 'warning');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/groups/join`, {
        group_id: groupId,
        user_id: userData.id,
      });

      if (response.data.message === 'Joined group') {
        // Update local state
        const updatedUserGroups = [...userGroups, groupId];
        setUserGroups(updatedUserGroups);
        
        // Update groups to show user as member
        setGroups(groups.map(group => 
          group.group_id === groupId 
            ? { 
                ...group, 
                isMember: true, 
                members: (group.members || 0) + 1 
              }
            : group
        ));
        
        // Save to localStorage
        localStorage.setItem(`userGroups_${userData.id}`, JSON.stringify(updatedUserGroups));
        
        showSnackbar('Successfully joined group!', 'success');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      if (error.response?.status === 409) {
        showSnackbar('You are already a member of this group', 'info');
      } else {
        showSnackbar('Failed to join group', 'error');
      }
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!userData?.id) return;
    
    try {
      // You'll need to implement this API endpoint in your backend
      await axios.post(`${API_BASE_URL}/groups/leave`, {
        group_id: groupId,
        user_id: userData.id,
      });
      
      // For now, update local state
      const updatedUserGroups = userGroups.filter(id => id !== groupId);
      setUserGroups(updatedUserGroups);
      localStorage.setItem(`userGroups_${userData.id}`, JSON.stringify(updatedUserGroups));
      
      // Update groups state
      setGroups(groups.map(group => 
        group.group_id === groupId 
          ? { 
              ...group, 
              isMember: false, 
              members: Math.max(0, (group.members || 1) - 1) 
            }
          : group
      ));
      
      showSnackbar('Left the group', 'success');
    } catch (error) {
      console.error('Error leaving group:', error);
      showSnackbar('Failed to leave group', 'error');
    }
  };

  const handleCreateGroup = async () => {
    if (!userData?.id) {
      showSnackbar('Please login to create groups', 'warning');
      navigate('/login');
      return;
    }

    if (!newGroup.name.trim()) {
      showSnackbar('Group name is required', 'error');
      return;
    }

    if (!newGroup.category_id) {
      showSnackbar('Please select a category', 'error');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/groups/create`, {
        name: newGroup.name,
        category_id: newGroup.category_id,
        created_by: userData.id,
      });
      
      if (response.data.message === 'Group created') {
        showSnackbar('Group created successfully!', 'success');
        setCreateDialogOpen(false);
        setNewGroup({ name: '', category_id: '', created_by: userData.id });
        fetchGroups(); // Refresh groups list
        
        // Auto-join the creator
        if (response.data.groupId) {
          setTimeout(() => handleJoinGroup(response.data.groupId), 1000);
        }
      }
    } catch (error) {
      console.error('Error creating group:', error);
      showSnackbar('Failed to create group', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredGroups = groups.filter(group => {
    if (activeTab === 0) return true; // All groups
    if (activeTab === 1) return group.isMember; // My groups
    if (activeTab === 2) return (group.members || 0) > 10; // Popular
    if (activeTab === 3) {
      // New groups (created in last 7 days)
      const createdDate = new Date(group.created_at || new Date());
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }
    return true;
  }).filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    categories.find(c => c.category_id === group.category_id)?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Support Groups
            </Typography>
            <Typography color="text.secondary">
              Join communities with shared experiences
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            disabled={!userData}
          >
            Create Group
          </Button>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search groups..."
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
                    key={category.category_id}
                    label={category.name}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                    onClick={() => setSearchQuery(category.name)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Groups" />
          <Tab label="My Groups" disabled={!userData} />
          <Tab label="Popular" />
          <Tab label="New" />
        </Tabs>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Groups sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No groups found
            </Typography>
            {!userData && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please login to view and join groups
              </Typography>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredGroups.map((group, index) => {
              const category = categories.find(c => c.category_id === group.category_id);
              const memberCount = group.members || 0;
              const progress = Math.min(100, (memberCount / 10) * 100); // Progress based on members

              return (
                <Grid item xs={12} md={6} key={group.group_id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              mr: 3,
                              bgcolor: 'primary.main',
                            }}
                          >
                            <Groups />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {group.name}
                              </Typography>
                              {group.privacy === 'private' ? (
                                <Lock sx={{ fontSize: 16, color: 'text.secondary' }} />
                              ) : (
                                <Public sx={{ fontSize: 16, color: 'text.secondary' }} />
                              )}
                            </Box>
                            <Typography color="text.secondary" variant="body2">
                              {group.description || 'No description available'}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Group Activity
                            </Typography>
                            <Typography variant="body2" color="primary">
                              {progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {memberCount} members
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chat sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {Math.floor(memberCount / 10)} active
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                          <Chip 
                            label={category?.name || 'Uncategorized'} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {group.isMember ? (
                              <Button 
                                size="small" 
                                variant="contained" 
                                color="secondary"
                                onClick={() => handleLeaveGroup(group.group_id)}
                                disabled={!userData}
                              >
                                Leave
                              </Button>
                            ) : (
                              <Button 
                                size="small" 
                                variant="contained"
                                onClick={() => handleJoinGroup(group.group_id)}
                                disabled={!userData}
                              >
                                Join
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Create Group Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Group Name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                sx={{ mb: 3 }}
              />
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newGroup.category_id}
                  onChange={(e) => setNewGroup({ ...newGroup, category_id: e.target.value })}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.category_id} value={category.category_id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description (Optional)"
                multiline
                rows={3}
                placeholder="Describe your group..."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateGroup} disabled={!userData}>
              Create Group
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default GroupsPage;