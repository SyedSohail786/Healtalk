import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (data) => api.post('/api/auth/register', data),
};

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
};

export const supportAPI = {
  getSupporters: () => api.get('/api/supporters'),
  startSession: (data) => api.post('/api/chat/start', data),
  sendMessage: (data) => api.post('/api/chat/message', data),
  getMessages: (sessionId) => api.get(`/api/chat/${sessionId}`),
};

export const groupAPI = {
  getGroups: () => api.get('/api/groups'),
  createGroup: (data) => api.post('/api/groups/create', data),
  joinGroup: (data) => api.post('/api/groups/join', data),
  getGroupPosts: (groupId) => api.get(`/api/groups/posts/${groupId}`),
  createPost: (data) => api.post('/api/groups/post', data),
};

export const articleAPI = {
  getArticles: () => api.get('/api/articles'),
  createArticle: (data) => api.post('/api/articles/add', data),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/api/admin/stats'),
  getUsers: () => api.get('/api/admin/users'),
  updateUser: (userId, data) => api.put(`/api/admin/users/${userId}`, data),
};

export default api;