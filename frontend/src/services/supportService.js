// services/supportService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create a custom axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasToken: !!token
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const supportService = {
  // Fetch supporters from database
  async getSupporters(type = 'all') {
    try {
      console.log('Fetching supporters...');
      const response = await api.get('/supporters');
      
      if (response.data && response.data.success) {
        console.log('Supporters fetched successfully:', response.data.supporters?.length);
        return response.data.supporters || [];
      }
      console.log('No supporters data found');
      return [];
    } catch (error) {
      console.error('Error fetching supporters:', error.message);
      if (error.response?.data) {
        console.error('Error details:', error.response.data);
      }
      throw error;
    }
  },

  // Book a session
  async bookSession(sessionData) {
    try {
      console.log('Booking session with data:', sessionData);
      const response = await api.post('/sessions/book', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error booking session:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get available supporters for chat
  async getAvailableSupporters() {
    try {
      const response = await api.get('/sessions/available-supporters');
      
      if (response.data && response.data.success) {
        return response.data.supporters || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching available supporters:', error.response?.data || error.message);
      throw error;
    }
  },

  // Start a chat session
  async startChatSession(chatData) {
    try {
      const response = await api.post('/chat/start', chatData);
      return response.data;
    } catch (error) {
      console.error('Error starting chat:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get chat messages
  async getChatMessages(sessionId) {
    try {
      const response = await api.get(`/chat/${sessionId}/messages`);
      if (response.data && response.data.success) {
        return response.data.messages || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error.message);
      throw error;
    }
  },

  // Send message
  async sendMessage(messageData) {
    try {
      const response = await api.post('/chat/send', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw error;
    }
  },

  // Test authentication
  async testAuth() {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Auth test failed:', error.response?.data || error.message);
      throw error;
    }
  }
};