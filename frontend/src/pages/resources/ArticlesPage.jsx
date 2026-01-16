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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ArticlesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All', count: 48 },
    { id: 'anxiety', label: 'Anxiety', count: 12 },
    { id: 'depression', label: 'Depression', count: 8 },
    { id: 'stress', label: 'Stress Management', count: 10 },
    { id: 'mindfulness', label: 'Mindfulness', count: 6 },
    { id: 'relationships', label: 'Relationships', count: 5 },
    { id: 'self-care', label: 'Self-Care', count: 7 },
  ];

  const articles = [
    {
      id: 1,
      title: '10 Mindfulness Techniques for Daily Anxiety',
      excerpt: 'Learn simple mindfulness practices that can help reduce anxiety and bring peace to your daily life...',
      author: 'Dr. Sarah Johnson',
      authorRole: 'Clinical Psychologist',
      readTime: '5 min read',
      category: 'Anxiety',
      date: 'Jan 15, 2024',
      likes: 245,
      comments: 42,
      featured: true,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800',
    },
    {
      id: 2,
      title: 'Understanding Depression: A Comprehensive Guide',
      excerpt: 'An in-depth look at depression symptoms, causes, and evidence-based treatment options...',
      author: 'Michael Chen',
      authorRole: 'Counselor',
      readTime: '8 min read',
      category: 'Depression',
      date: 'Jan 12, 2024',
      likes: 189,
      comments: 31,
      featured: false,
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800',
    },
    {
      id: 3,
      title: 'Stress Management in the Modern Workplace',
      excerpt: 'Practical strategies for managing work-related stress and maintaining mental wellbeing...',
      author: 'Priya Sharma',
      authorRole: 'Mindfulness Coach',
      readTime: '6 min read',
      category: 'Stress Management',
      date: 'Jan 10, 2024',
      likes: 312,
      comments: 56,
      featured: true,
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800',
    },
    {
      id: 4,
      title: 'The Power of Gratitude Journaling',
      excerpt: 'How maintaining a gratitude journal can transform your mental health and overall outlook on life...',
      author: 'David Wilson',
      authorRole: 'Trauma Specialist',
      readTime: '4 min read',
      category: 'Self-Care',
      date: 'Jan 8, 2024',
      likes: 167,
      comments: 28,
      featured: false,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800',
    },
    {
      id: 5,
      title: 'Building Resilience Through Adversity',
      excerpt: 'Learn how to develop emotional resilience and bounce back stronger from life\'s challenges...',
      author: 'Dr. Sarah Johnson',
      authorRole: 'Clinical Psychologist',
      readTime: '7 min read',
      category: 'Mindfulness',
      date: 'Jan 5, 2024',
      likes: 278,
      comments: 39,
      featured: false,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800',
    },
    {
      id: 6,
      title: 'Healthy Communication in Relationships',
      excerpt: 'Essential communication skills for maintaining healthy relationships and resolving conflicts...',
      author: 'Michael Chen',
      authorRole: 'Counselor',
      readTime: '6 min read',
      category: 'Relationships',
      date: 'Jan 3, 2024',
      likes: 194,
      comments: 45,
      featured: false,
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800',
    },
  ];

  const trendingArticles = [
    { title: 'The Science of Sleep and Mental Health', views: '2.4k' },
    { title: 'Digital Detox: Reclaiming Your Mind', views: '1.8k' },
    { title: 'Managing Social Anxiety in the Digital Age', views: '1.5k' },
    { title: 'Mindful Eating for Emotional Wellbeing', views: '1.2k' },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleReadArticle = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const filteredArticles = articles.filter(article => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return article.featured;
    if (activeTab === 2) return article.category === 'Anxiety';
    if (activeTab === 3) return article.category === 'Depression';
    return true;
  }).filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                label={`${category.label} (${category.count})`}
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
            <Grid container spacing={4}>
              {filteredArticles.map((article, index) => (
                <Grid item xs={12} key={article.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                      <Grid container>
                        <Grid item xs={12} md={4}>
                          <CardMedia
                            component="img"
                            height="240"
                            image={article.image}
                            alt={article.title}
                            sx={{ objectFit: 'cover', height: '100%' }}
                          />
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ mb: 2 }}>
                              <Chip
                                label={article.category}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 2 }}
                              />
                              {article.featured && (
                                <Chip
                                  label="Featured"
                                  size="small"
                                  color="warning"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>

                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}>
                              {article.title}
                            </Typography>

                            <Typography color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                              {article.excerpt}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 40, height: 40 }}>
                                  {article.author.split(' ').map(n => n[0]).join('')}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {article.author}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {article.authorRole}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Favorite sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {article.likes}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Comment sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {article.comments}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {article.readTime}
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
                              onClick={() => handleReadArticle(article.id)}
                            >
                              Read Article
                            </Button>
                          </CardActions>
                        </Grid>
                      </Grid>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={5}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
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
      </motion.div>
    </Container>
  );
};

export default ArticlesPage;