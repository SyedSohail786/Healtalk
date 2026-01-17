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
  CardMedia,
  CardActions,
  CardHeader,
  Pagination,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search,
  Article,
  Favorite,
  Share,
  Bookmark,
  Comment,
  TrendingUp,
  Schedule,
  Person,
  Category,
  FilterList,
  Sort,
  ExpandMore,
  Edit,
  Delete,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const ArticlesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    created_by: '',
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'depression', label: 'Depression' },
    { id: 'stress', label: 'Stress Management' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'self-care', label: 'Self-Care' },
  ];

  const trendingArticles = [
    { title: 'The Science of Sleep and Mental Health', views: '2.4k' },
    { title: 'Digital Detox: Reclaiming Your Mind', views: '1.8k' },
    { title: 'Managing Social Anxiety in the Digital Age', views: '1.5k' },
    { title: 'Mindful Eating for Emotional Wellbeing', views: '1.2k' },
  ];

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setNewArticle(prev => ({ ...prev, created_by: parsedData.id }));
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
    
    fetchArticles();
    fetchUsers();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/articles`);
      setArticles(response.data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      showSnackbar('Failed to load articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleReadArticle = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const handleCreateArticle = async () => {
    if (!newArticle.title.trim()) {
      showSnackbar('Article title is required', 'error');
      return;
    }

    if (!newArticle.content.trim()) {
      showSnackbar('Article content is required', 'error');
      return;
    }

    if (!userData?.id) {
      showSnackbar('Please login to create articles', 'warning');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/articles/add`, {
        ...newArticle,
        created_by: userData.id,
      });
      
      if (response.data.message === 'Article added') {
        showSnackbar('Article created successfully!', 'success');
        setCreateDialogOpen(false);
        setNewArticle({ title: '', content: '', created_by: userData.id });
        fetchArticles(); // Refresh articles list
      }
    } catch (error) {
      console.error('Error creating article:', error);
      showSnackbar('Failed to create article', 'error');
    }
  };

  const handleEditArticle = async () => {
    if (!selectedArticle) return;

    if (!selectedArticle.title.trim()) {
      showSnackbar('Article title is required', 'error');
      return;
    }

    if (!selectedArticle.content.trim()) {
      showSnackbar('Article content is required', 'error');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/admin/articles/${selectedArticle.article_id}`, {
        title: selectedArticle.title,
        content: selectedArticle.content,
      });
      
      if (response.data.success) {
        showSnackbar('Article updated successfully!', 'success');
        setEditDialogOpen(false);
        setSelectedArticle(null);
        fetchArticles(); // Refresh articles list
      }
    } catch (error) {
      console.error('Error updating article:', error);
      showSnackbar('Failed to update article', 'error');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/articles/${articleId}`);
      
      if (response.data.success) {
        showSnackbar('Article deleted successfully!', 'success');
        fetchArticles(); // Refresh articles list
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      showSnackbar('Failed to delete article', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredArticles = articles.filter(article => {
    if (activeTab === 0) return true; // All articles
    if (activeTab === 1) return article.featured; // Featured (you might want to add a featured field to your database)
    if (activeTab === 2) {
      // You'll need to add categories to your articles table
      return true; // Filter by category
    }
    return true;
  }).filter(article =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    users.find(u => u.user_id === article.created_by)?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const itemsPerPage = 4;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
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
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
            Mental Wellness Articles
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
            Discover evidence-based articles, guides, and resources to support your mental health journey
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <FilterList />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Sort />}
                  sx={{ flex: 1 }}
                >
                  Sort By
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Article />}
                  sx={{ flex: 1 }}
                  onClick={() => setCreateDialogOpen(true)}
                  disabled={!userData}
                >
                  Write Article
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Categories */}
        <Box sx={{ mb: 6, overflowX: 'auto', py: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, pb: 2 }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.label}
                onClick={() => setActiveTab(category.id === 'all' ? 0 : categories.findIndex(c => c.id === category.id))}
                color={activeTab === (category.id === 'all' ? 0 : categories.findIndex(c => c.id === category.id)) ? 'primary' : 'default'}
                variant="filled"
                sx={{
                  px: 2,
                  py: 3,
                  fontSize: '0.95rem',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content - Articles Grid */}
          <Grid item xs={12} lg={8}>
            {paginatedArticles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Article sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No articles found
                </Typography>
                {!userData && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Please login to create articles
                  </Typography>
                )}
              </Box>
            ) : (
              <>
                <Grid container spacing={4}>
                  {paginatedArticles.map((article, index) => {
                    const author = users.find(u => u.user_id === article.created_by);
                    const authorName = author?.author_name || 'Unknown Author';
                    const authorInitials = authorName.split(' ').map(n => n[0]).join('');
                    const excerpt = article.content?.substring(0, 150) + '...' || 'No content available';
                    const readTime = Math.ceil((article.content?.length || 0) / 200); // Approx 200 words per minute
                    
                    return (
                      <Grid item xs={12} key={article.article_id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <Grid container>
                              {/* Article Image - You might want to add an image field to your articles table */}
                              <Grid item xs={12} md={4}>
                                <CardMedia
                                  component="img"
                                  height="240"
                                  image={`https://images.unsplash.com/photo-${150 + index}?auto=format&fit=crop&w=800`}
                                  alt={article.title}
                                  sx={{ objectFit: 'cover', height: '100%' }}
                                />
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Chip
                                      label={article.category || 'General'}
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                    {userData?.role === 'admin' && (
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton 
                                          size="small" 
                                          onClick={() => {
                                            setSelectedArticle(article);
                                            setEditDialogOpen(true);
                                          }}
                                        >
                                          <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton 
                                          size="small" 
                                          color="error"
                                          onClick={() => handleDeleteArticle(article.article_id)}
                                        >
                                          <Delete fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    )}
                                  </Box>

                                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}>
                                    {article.title}
                                  </Typography>

                                  <Typography color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                                    {excerpt}
                                  </Typography>

                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Avatar sx={{ width: 40, height: 40 }}>
                                        {authorInitials}
                                      </Avatar>
                                      <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                          {authorName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {new Date(article.created_at).toLocaleDateString()}
                                        </Typography>
                                      </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                          {readTime} min read
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </CardContent>

                                <Divider />

                                <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton size="small">
                                      <Favorite />
                                    </IconButton>
                                    <IconButton size="small">
                                      <Bookmark />
                                    </IconButton>
                                    <IconButton size="small">
                                      <Share />
                                    </IconButton>
                                  </Box>
                                  <Button
                                    variant="contained"
                                    onClick={() => handleReadArticle(article.article_id)}
                                  >
                                    Read Article
                                  </Button>
                                </CardActions>
                              </Grid>
                            </Grid>
                          </Card>
                        </motion.div>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Trending Articles */}
            <Card sx={{ borderRadius: 3, mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Trending Now
                  </Typography>
                </Box>
                <List>
                  {trendingArticles.map((article, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        button
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {article.title}
                            </Typography>
                          }
                          secondary={`${article.views} views`}
                        />
                      </ListItem>
                      {index < trendingArticles.length - 1 && <Divider variant="inset" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card sx={{ borderRadius: 3, mb: 4, bgcolor: 'primary.light', color: 'white' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Article sx={{ fontSize: 48, mb: 2, opacity: 0.8 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Stay Updated
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                  Get weekly mental wellness articles delivered to your inbox
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Your email address"
                  size="small"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Mental Health Resources
                </Typography>
                <List>
                  {[
                    'Crisis Helpline: 1-800-273-8255',
                    '24/7 Chat Support',
                    'Free Counseling Sessions',
                    'Support Group Finder',
                    'Self-Assessment Tools',
                  ].map((resource, index) => (
                    <ListItem
                      key={index}
                      button
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemText primary={resource} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Create Article Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Write New Article</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Article Title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Article Content"
                multiline
                rows={10}
                value={newArticle.content}
                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                placeholder="Write your article content here..."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateArticle}>
              Publish Article
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Article Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Article</DialogTitle>
          <DialogContent>
            {selectedArticle && (
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="Article Title"
                  value={selectedArticle.title}
                  onChange={(e) => setSelectedArticle({ ...selectedArticle, title: e.target.value })}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Article Content"
                  multiline
                  rows={10}
                  value={selectedArticle.content}
                  onChange={(e) => setSelectedArticle({ ...selectedArticle, content: e.target.value })}
                  placeholder="Write your article content here..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleEditArticle}>
              Update Article
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

export default ArticlesPage;