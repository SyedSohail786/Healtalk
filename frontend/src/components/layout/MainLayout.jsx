import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  VideoCall,
  Call,
  Chat,
  Groups,
  Article,
  ShoppingCart,
  Person,
  Notifications,
  Logout,
  AdminPanelSettings,
  SupportAgent,
  Home,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'; // ADD Outlet
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const drawerWidth = 280;

const MainLayout = () => { // REMOVE { children } prop
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
    toast.success('Logged out successfully!');
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Video Support', icon: <VideoCall />, path: '/support/video' },
    { text: 'Audio Support', icon: <Call />, path: '/support/audio' },
    { text: 'Chat Support', icon: <Chat />, path: '/support/chat' },
    { text: 'Groups', icon: <Groups />, path: '/groups' },
    { text: 'Articles', icon: <Article />, path: '/articles' },
    { text: 'Products', icon: <ShoppingCart />, path: '/products' },
  ];

  if (user?.role === 'admin') {
    navigationItems.push({ text: 'Admin', icon: <AdminPanelSettings />, path: '/admin' });
  }

  if (user?.role === 'supporter') {
    navigationItems.push({ text: 'Contributor', icon: <SupportAgent />, path: '/contributor' });
  }

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
          >
            HealTalk
          </Typography>
        </motion.div>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Mental Wellness Platform
        </Typography>
      </Box>

      <Box sx={{ px: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'white',
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {user?.role || 'Member'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              mb: 1,
              mx: 2,
              borderRadius: 2,
              bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
              color: isActive(item.path) ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: isActive(item.path) ? 'primary.dark' : 'action.hover',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3, mt: 'auto' }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navigationItems.find((item) => isActive(item.path))?.text || 'Dashboard'}
          </Typography>

          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleUserMenuClick} size="small">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              onClick={() => {
                navigate('/profile');
                handleUserMenuClose();
              }}
            >
              <Person sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              position: 'fixed',
              height: '100vh',
              overflowY: 'auto',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
        }}
      >
        <Outlet /> {/* CHANGE children to Outlet */}
      </Box>
    </Box>
  );
};

export default MainLayout;