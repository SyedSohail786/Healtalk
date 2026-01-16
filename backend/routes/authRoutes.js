const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { authMiddleware } = require("../middleware/auth");

// Register - UPDATED to handle different user types
router.post("/register", async (req, res) => {
  const { name, email, password, phone, bio, experience, qualifications, userType, adminCode } = req.body;
  
  // Validate admin registration
  if (userType === 'admin') {
    // You can set this in your .env file: ADMIN_REGISTRATION_CODE=HEALTALK_ADMIN_2024
    const validAdminCode = process.env.ADMIN_REGISTRATION_CODE || 'HEALTALK_ADMIN_2024';
    if (adminCode !== validAdminCode) {
      return res.status(403).json({ 
        success: false, 
        message: "Invalid admin authorization code" 
      });
    }
  }

  try {
    // Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, data) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Database error" 
        });
      }
      
      if (data.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: "User already exists" 
        });
      }

      // Hash password
      const hash = await bcrypt.hash(password, 10);

      // Insert basic user info into users table
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hash],
        (err, result) => {
          if (err) {
            console.error("User insertion error:", err);
            return res.status(500).json({ 
              success: false, 
              message: "Registration failed" 
            });
          }
          
          const userId = result.insertId;
          let roleId;
          
          // Determine role ID based on userType
          switch(userType) {
            case 'supporter':
              roleId = 2; // supporter role
              break;
            case 'admin':
              roleId = 3; // admin role
              break;
            default:
              roleId = 1; // user role
          }
          
          // Assign role in user_roles table
          db.query(
            "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
            [userId, roleId],
            (roleErr) => {
              if (roleErr) {
                console.error("Role assignment failed:", roleErr);
                // Continue even if role assignment fails
              }
              
              // If user is registering as supporter, insert into peer_supporters table
              if (userType === 'supporter') {
                db.query(
                  `INSERT INTO peer_supporters 
                  (user_id, bio, experience, qualifications, status, is_verified) 
                  VALUES (?, ?, ?, ?, ?, ?)`,
                  [userId, bio, experience, qualifications, 'online', 1],
                  (supporterErr) => {
                    if (supporterErr) {
                      console.error("Supporter registration failed:", supporterErr);
                      // You might want to rollback user insertion here
                      // For now, we'll still consider it a success but log the error
                    }
                    
                    sendSuccessResponse();
                  }
                );
              } else if (userType === 'admin') {
                // For admin, you might want to log this or set special flags
                console.log(`Admin user registered: ${email} (ID: ${userId})`);
                sendSuccessResponse();
              } else {
                // Regular user
                sendSuccessResponse();
              }
            }
          );
          
          function sendSuccessResponse() {
            // Return success response
            res.json({ 
              success: true, 
              message: `Account created successfully as ${userType}`,
              user: {
                id: userId,
                name: name,
                email: email,
                role: userType,
                createdAt: new Date()
              }
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during registration" 
    });
  }
});

// Login - Updated to include supporter/admin info
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    `SELECT u.*, r.role_name as role,
     ps.supporter_id, ps.bio as supporter_bio, ps.experience as supporter_experience,
     ps.qualifications as supporter_qualifications, ps.status as supporter_status,
     ps.is_verified as supporter_is_verified
     FROM users u
     LEFT JOIN user_roles ur ON u.user_id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.role_id
     LEFT JOIN peer_supporters ps ON u.user_id = ps.user_id
     WHERE u.email = ?`, 
    [email], 
    async (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
          success: false, 
          error: "Database error" 
        });
      }
      
      if (data.length === 0) {
        return res.status(401).json({ 
          success: false, 
          error: "Invalid email or password" 
        });
      }

      const user = data[0];
      
      try {
        const valid = await bcrypt.compare(password, user.password);
        
        if (!valid) {
          return res.status(401).json({ 
            success: false, 
            error: "Invalid email or password" 
          });
        }

        // Create JWT token with additional supporter info if applicable
        const tokenPayload = { 
          userId: user.user_id, 
          email: user.email, 
          name: user.name,
          role: user.role || 'user'
        };

        // Add supporter info to token if user is a supporter
        if (user.role === 'supporter' && user.supporter_id) {
          tokenPayload.supporterId = user.supporter_id;
          tokenPayload.supporterIsVerified = user.supporter_is_verified;
        }

        const token = jwt.sign(
          tokenPayload,
          process.env.JWT_SECRET || "your-secret-key-change-this",
          { expiresIn: "24h" }
        );

        // Prepare user object for response
        const userResponse = {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          createdAt: user.created_at
        };

        // Add supporter info to response if applicable
        if (user.role === 'supporter' && user.supporter_id) {
          userResponse.supporterInfo = {
            supporterId: user.supporter_id,
            bio: user.supporter_bio,
            experience: user.supporter_experience,
            qualifications: user.supporter_qualifications,
            status: user.supporter_status,
            isVerified: user.supporter_is_verified
          };
        }

        res.json({
          success: true,
          message: "Login successful",
          token: token,
          user: userResponse
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
          success: false, 
          error: "Server error during login" 
        });
      }
    }
  );
});

// Get user profile (optional - for frontend to get detailed info)
router.get("/profile/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    `SELECT u.*, r.role_name as role,
     ps.supporter_id, ps.bio as supporter_bio, ps.experience as supporter_experience,
     ps.qualifications as supporter_qualifications, ps.status as supporter_status,
     ps.is_verified as supporter_is_verified, ps.availability as supporter_availability
     FROM users u
     LEFT JOIN user_roles ur ON u.user_id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.role_id
     LEFT JOIN peer_supporters ps ON u.user_id = ps.user_id
     WHERE u.user_id = ?`, 
    [userId], 
    (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
          success: false, 
          error: "Database error" 
        });
      }
      
      if (data.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: "User not found" 
        });
      }

      const user = data[0];
      
      // Prepare response object
      const userProfile = {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        createdAt: user.created_at
      };

      // Add supporter info if applicable
      if (user.role === 'supporter' && user.supporter_id) {
        userProfile.supporterInfo = {
          supporterId: user.supporter_id,
          bio: user.supporter_bio,
          experience: user.supporter_experience,
          qualifications: user.supporter_qualifications,
          status: user.supporter_status,
          isVerified: user.supporter_is_verified,
          availability: user.supporter_availability
        };
      }

      res.json({
        success: true,
        user: userProfile
      });
    }
  );
});


router.get("/verify", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: req.user
  });
});


module.exports = router;