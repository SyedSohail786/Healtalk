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
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const Navigation = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuOpen = Boolean(anchorEl);

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
  };

  const isActive = (path) => location.pathname === path;

  const userMenuItems = [
    { text: 'Profile', icon: <Person />, onClick: () => navigate('/profile') },
    { text: 'Logout', icon: <Logout />, onClick: handleLogout },
  ];

  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Video Support', icon: <VideoCall />, path: '/support/video' },
    { text: 'Audio Support', icon: <Call />, path: '/support/audio' },
    { text: 'Chat Support', icon: <Chat />, path: '/support/chat' },
    { text: 'Groups', icon: <Groups />, path: '/groups' },
    { text: 'Articles', icon: <Article />, path: '/articles' },
    // { text: 'Products', icon: <ShoppingCart />, path: '/products' },
  ];

  if (user?.role === 'admin') {
    navigationItems.push({ text: 'Admin', icon: <AdminPanelSettings />, path: '/admin' });
  }

  if (user?.role === 'supporter') {
    navigationItems.push({ text: 'Contributor', icon: <SupportAgent />, path: '/contributor' });
  }

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            HealTalk
          </Typography>
        </motion.div>
      </Box>
      
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              mx: 2,
              borderRadius: 2,
              bgcolor: isActive(item.path) ? 'primary.light' : 'transparent',
              color: isActive(item.path) ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: isActive(item.path) ? 'primary.main' : 'action.hover',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 400 }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
            {navigationItems.find(item => isActive(item.path))?.text || 'Dashboard'}
          </Typography>

          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleUserMenuClick}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.name || 'User'}
              </Typography>
            </MenuItem>
            {userMenuItems.map((item) => (
              <MenuItem key={item.text} onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                {item.text}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
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
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Navigation;