import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            textAlign: 'center',
            bgcolor: 'background.default',
          }}
        >
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Oops! Something went wrong
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '600px' }}>
            We're sorry for the inconvenience. An unexpected error has occurred.
            Please try again or contact support if the problem persists.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={this.handleRetry}
              sx={{ px: 4 }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={this.handleGoHome}
              sx={{ px: 4 }}
            >
              Go to Home
            </Button>
          </Box>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'error.light', borderRadius: 2, textAlign: 'left', maxWidth: '800px' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'error.dark' }}>
                {this.state.error.toString()}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;