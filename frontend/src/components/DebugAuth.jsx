// components/DebugAuth.jsx
import React, { useEffect, useState } from 'react';
import { supportService } from '../services/supportService';

const DebugAuth = () => {
  const [authStatus, setAuthStatus] = useState('Checking...');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const testAuth = async () => {
      try {
        const result = await supportService.testAuth();
        setAuthStatus(`Authenticated as: ${result.user?.name} (${result.user?.role})`);
      } catch (error) {
        setAuthStatus(`Auth failed: ${error.response?.data?.error || error.message}`);
      }
    };

    testAuth();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h3>Authentication Debug</h3>
      <p><strong>Token in localStorage:</strong> {token ? 'Present' : 'Missing'}</p>
      <p><strong>Token value:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
      <p><strong>Auth Status:</strong> {authStatus}</p>
      <button onClick={() => console.log('Token:', localStorage.getItem('token'))}>
        Log Token to Console
      </button>
      <button onClick={() => localStorage.removeItem('token') && window.location.reload()}>
        Clear Token & Refresh
      </button>
    </div>
  );
};

export default DebugAuth;