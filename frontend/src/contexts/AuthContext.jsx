import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useLoading } from './LoadingContext';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  // contexts/AuthContext.jsx - Update the useEffect
  useEffect(() => {
    console.log('AuthContext mount - checking token:', token);

    // Set up axios defaults
    const setupAxiosDefaults = () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        console.log('Axios default header set with token');
      } else {
        delete axios.defaults.headers.common['Authorization'];
        console.log('No token found, removed axios header');
      }
    };

    setupAxiosDefaults();

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log('Token decoded successfully:', decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    showLoading('Signing in...');
    try {
      console.log('Login attempt for:', email); // Debug

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login API response:', data); // Debug

      hideLoading();

      if (data.success && data.token) {
        // Store token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        // Update state
        setToken(data.token);
        setUser(data.user);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        console.log('Login successful, token stored:', data.token); // Debug
        toast.success('Login successful!');
        return { success: true, user: data.user };
      } else {
        const errorMsg = data.error || data.message || 'Login failed';
        toast.error(errorMsg);
        return {
          success: false,
          error: errorMsg
        };
      }
    } catch (error) {
      hideLoading();
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  };

  const register = async (userData) => {
    showLoading(`Creating your ${userData.userType || 'user'} account...`);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      hideLoading();

      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Registration successful!');
        return {
          success: true,
          data: response.data,
          user: response.data.user
        };
      } else {
        const errorMsg = response.data?.message || response.data?.error || 'Registration failed';
        toast.error(errorMsg);
        return {
          success: false,
          error: errorMsg
        };
      }
    } catch (error) {
      hideLoading();
      const errorMsg = error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Registration failed. Please try again.';

      if (errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
        toast.error('Email already registered. Please use a different email or login.');
      } else if (errorMsg.includes('Invalid admin')) {
        toast.error('Invalid admin authorization code.');
      } else {
        toast.error(errorMsg);
      }

      return {
        success: false,
        error: errorMsg
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token,
    loading,
  };

  console.log('AuthContext value:', {
    user,
    token,
    isAuthenticated: !!token,
    loading
  }); // Debug

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};