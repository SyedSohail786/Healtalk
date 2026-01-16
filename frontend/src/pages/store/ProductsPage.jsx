import React, { useState } from 'react';
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
  TextField,
  InputAdornment,
  IconButton,
  CardMedia,
  CardActions,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Tabs,
  Tab,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Favorite,
  Share,
  LocalShipping,
  Security,
  Replay,
  Star,
  FilterList,
  Sort,
  Add,
  Remove,
  Inventory,
  Nature,  // Changed from Eco to Nature
  Category,
  Psychology,
  Spa,
  MusicNote,
  Book,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Products', count: 48, icon: <Psychology /> },
    { id: 'books', label: 'Books & Guides', count: 12, icon: <Book /> },
    { id: 'meditation', label: 'Meditation', count: 8, icon: <Spa /> },
    { id: 'stress-relief', label: 'Stress Relief', count: 10, icon: <Nature /> }, // Changed to Nature
    { id: 'mindfulness', label: 'Mindfulness Tools', count: 6, icon: <MusicNote /> },
  ];

  const products = [
    {
      id: 1,
      name: 'Mindfulness Meditation Set',
      description: 'Complete meditation kit with cushion, bell, and guidebook',
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.8,
      reviews: 124,
      category: 'Meditation',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1545389336-cf09022229c9?auto=format&fit=crop&w=800',
      tags: ['Bestseller', 'New'],
    },
    {
      id: 2,
      name: 'Anxiety Relief Workbook',
      description: 'Interactive workbook with CBT exercises and tracking',
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.9,
      reviews: 89,
      category: 'Books & Guides',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800',
      tags: ['Digital', 'Instant Access'],
    },
    {
      id: 3,
      name: 'Stress Relief Essential Oil Diffuser',
      description: 'Ultrasonic diffuser with calming essential oils bundle',
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.7,
      reviews: 203,
      category: 'Stress Relief',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800',
      tags: ['Bestseller'],
    },
    {
      id: 4,
      name: 'Therapy Journal',
      description: 'Premium guided journal for emotional processing',
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.6,
      reviews: 56,
      category: 'Books & Guides',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1531346688376-ab6275c4725e?auto=format&fit=crop&w=800',
      tags: ['New'],
    },
    {
      id: 5,
      name: 'Weighted Anxiety Blanket',
      description: '15lb weighted blanket for deep pressure therapy',
      price: 129.99,
      originalPrice: 159.99,
      rating: 4.9,
      reviews: 312,
      category: 'Stress Relief',
      inStock: false,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800',
      tags: ['Popular'],
    },
    {
      id: 6,
      name: 'Mindfulness Bell & Timer',
      description: 'Traditional singing bowl with meditation timer',
      price: 34.99,
      originalPrice: 49.99,
      rating: 4.5,
      reviews: 78,
      category: 'Mindfulness Tools',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1568315058100-4d6d8b8a8c8a?auto=format&fit=crop&w=800',
      tags: [],
    },
  ];

  const benefits = [
    'Free shipping on orders over $50',
    '30-day return policy',
    'Secure payment processing',
    'Certified mental wellness products',
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (product) => {
    setWishlist([...wishlist, product]);
    toast.success(`${product.name} added to wishlist!`);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
    setQuantity(1);
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
    setQuantity(1);
  };

  const handleCheckout = () => {
    setProductDialogOpen(false);
    toast.success('Order placed successfully!');
    // In real app, navigate to checkout page
    // navigate('/checkout');
  };

  const filteredProducts = products.filter(product => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return product.category === 'Books & Guides';
    if (activeTab === 2) return product.category === 'Meditation';
    if (activeTab === 3) return product.category === 'Stress Relief';
    return true;
  }).filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
            Wellness Store
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mb: 4 }}>
            Discover tools, resources, and products to support your mental health journey
          </Typography>
        </Box>

        {/* Stats Bar */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ borderRadius: 3, height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    {index === 0 && <LocalShipping sx={{ color: 'primary.main', fontSize: 32 }} />}
                    {index === 1 && <Replay sx={{ color: 'primary.main', fontSize: 32 }} />}
                    {index === 2 && <Security sx={{ color: 'primary.main', fontSize: 32 }} />}
                    {index === 3 && <Inventory sx={{ color: 'primary.main', fontSize: 32 }} />}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {benefit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Search and Filters */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products..."
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
                    bgcolor: 'background.paper',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                  >
                    {categories.map((cat, index) => (
                      <MenuItem key={cat.id} value={index}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="outlined" startIcon={<FilterList />}>
                  Filter
                </Button>
                <Button variant="outlined" startIcon={<Sort />}>
                  Sort
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Categories */}
        <Box sx={{ mb: 6, overflowX: 'auto', py: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, pb: 2 }}>
            {categories.map((category, index) => (
              <motion.div key={category.id} whileHover={{ scale: 1.05 }}>
                <Card
                  sx={{
                    minWidth: 180,
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: activeTab === index ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    bgcolor: activeTab === index ? 'primary.light' : 'background.paper',
                  }}
                  onClick={() => setActiveTab(index)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: activeTab === index ? 'primary.main' : 'text.secondary', mb: 2 }}>
                      {category.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {category.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.count} items
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={4}>
          {filteredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Product Image */}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                      {product.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          color="primary"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <IconButton
                        sx={{ bgcolor: 'background.paper' }}
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <Favorite />
                      </IconButton>
                    </Box>
                    {!product.inStock && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Chip label="Out of Stock" color="error" />
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {product.name}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={product.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviews})
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${product.price}
                      </Typography>
                      {product.originalPrice && (
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          ${product.originalPrice}
                        </Typography>
                      )}
                      {product.originalPrice && (
                        <Chip
                          label={`Save $${(product.originalPrice - product.price).toFixed(2)}`}
                          size="small"
                          color="success"
                        />
                      )}
                    </Box>

                    <Typography variant="caption" color="text.secondary" display="block">
                      Category: {product.category}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleViewProduct(product)}
                          disabled={!product.inStock}
                        >
                          View Details
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                        >
                          Add to Cart
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Cart Summary */}
        <Box sx={{ mt: 6, p: 4, bgcolor: 'primary.light', borderRadius: 3, color: 'white' }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {cart.length} items in your cart
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Complete your wellness journey with these essential products
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
                disabled={cart.length === 0}
              >
                Checkout Now
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Product Details Dialog */}
        <Dialog
          open={productDialogOpen}
          onClose={() => setProductDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedProduct && (
            <>
              <DialogTitle>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {selectedProduct.name}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <CardMedia
                      component="img"
                      height="400"
                      image={selectedProduct.image}
                      alt={selectedProduct.name}
                      sx={{ borderRadius: 2, objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                        ${selectedProduct.price}
                        {selectedProduct.originalPrice && (
                          <Typography
                            component="span"
                            variant="h6"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through', ml: 2 }}
                          >
                            ${selectedProduct.originalPrice}
                          </Typography>
                        )}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={selectedProduct.rating} precision={0.1} readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({selectedProduct.reviews} reviews)
                        </Typography>
                      </Box>
                      <Chip label={selectedProduct.category} color="primary" sx={{ mr: 1 }} />
                      {selectedProduct.tags.map((tag) => (
                        <Chip key={tag} label={tag} variant="outlined" sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </Box>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      {selectedProduct.description}
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Quantity
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                          <Remove />
                        </IconButton>
                        <Typography variant="h6">{quantity}</Typography>
                        <IconButton onClick={() => setQuantity(quantity + 1)}>
                          <Add />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                          ${(selectedProduct.price * quantity).toFixed(2)} total
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="large"
                          startIcon={<Favorite />}
                          onClick={() => handleAddToWishlist(selectedProduct)}
                        >
                          Wishlist
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          startIcon={<ShoppingCart />}
                          onClick={handleCheckout}
                          disabled={!selectedProduct.inStock}
                        >
                          {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setProductDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCheckout}
                  disabled={!selectedProduct.inStock}
                >
                  Buy Now
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default ProductsPage;