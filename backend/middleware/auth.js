// middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'No token, authorization denied' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key-change-this'
    );
    
    // Check if user exists in database
    db.query(
      `SELECT u.*, r.role_name as role
       FROM users u
       LEFT JOIN user_roles ur ON u.user_id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.role_id
       WHERE u.user_id = ?`,
      [decoded.userId],
      (err, results) => {
        if (err) {
          console.error('Database error in auth middleware:', err);
          return res.status(500).json({ 
            success: false, 
            error: 'Database error' 
          });
        }
        
        if (results.length === 0) {
          return res.status(401).json({ 
            success: false, 
            error: 'User not found' 
          });
        }
        
        const user = results[0];
        
        // Add user info to request object
        req.user = {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          ...decoded
        };
        
        next();
      }
    );
  } catch (err) {
    console.error('Token verification error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token has expired' 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }
    
    res.status(401).json({ 
      success: false, 
      error: 'Token is not valid' 
    });
  }
};

// Optional: Role-based middleware
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }
    
    next();
  };
};

module.exports = { authMiddleware, requireRole };