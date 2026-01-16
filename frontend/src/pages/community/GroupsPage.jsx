import React, { useState } from 'react';
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

const GroupsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const groups = [
    {
      id: 1,
      name: 'Anxiety Support Circle',
      description: 'A safe space to discuss anxiety and coping strategies',
      members: 245,
      active: 12,
      category: 'Anxiety',
      privacy: 'public',
      progress: 75,
    },
    {
      id: 2,
      name: 'Mindful Meditation',
      description: 'Daily meditation and mindfulness practices',
      members: 189,
      active: 8,
      category: 'Mindfulness',
      privacy: 'public',
      progress: 60,
    },
    {
      id: 3,
      name: 'Depression Recovery',
      description: 'Support for depression recovery journey',
      members: 156,
      active: 6,
      category: 'Depression',
      privacy: 'private',
      progress: 45,
    },
    {
      id: 4,
      name: 'Stress Management',
      description: 'Workplace and life stress management techniques',
      members: 312,
      active: 15,
      category: 'Stress',
      privacy: 'public',
      progress: 85,
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Support Groups
            </Typography>
            <Typography color="text.secondary">
              Join communities with shared experiences
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />}>
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
                {['All', 'Anxiety', 'Depression', 'Stress', 'Mindfulness'].map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
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
          <Tab label="My Groups" />
          <Tab label="Popular" />
          <Tab label="New" />
        </Tabs>

        {/* Groups Grid */}
        <Grid container spacing={3}>
          {groups.map((group, index) => (
            <Grid item xs={12} md={6} key={group.id}>
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
                          {group.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Group Activity
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {group.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={group.progress}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {group.members} members
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chat sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {group.active} active
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                      <Chip label={group.category} size="small" color="primary" variant="outlined" />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                        <Button size="small" variant="contained">
                          Join
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default GroupsPage;