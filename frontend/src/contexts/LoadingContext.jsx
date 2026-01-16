import React, { createContext, useState, useContext, useCallback } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const LoadingContext = createContext({});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showLoading = useCallback((message = '') => {
    setLoading(true);
    setLoadingMessage(message);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
    setLoadingMessage('');
  }, []);

  const value = {
    loading,
    loadingMessage,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        open={loading}
      >
        <div style={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          {loadingMessage && (
            <p style={{ marginTop: '16px', fontSize: '16px' }}>
              {loadingMessage}
            </p>
          )}
        </div>
      </Backdrop>
    </LoadingContext.Provider>
  );
};