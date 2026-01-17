// routes/adminRoutes.js
const router = require("express").Router();
const db = require("../config/db");
const { authMiddleware, requireRole } = require("../middleware/auth");

// Admin middleware - only allow admins
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: "Admin access required" });
  }
  next();
};

// Dashboard statistics
router.get("/dashboard-stats", authMiddleware, requireAdmin, (req, res) => {
  const queries = {
    totalUsers: "SELECT COUNT(*) as count FROM users",
    totalSupporters: "SELECT COUNT(*) as count FROM peer_supporters WHERE is_verified = 1",
    totalSessions: "SELECT COUNT(*) as count FROM chat_sessions WHERE status = 'active'",
    totalGroups: "SELECT COUNT(*) as count FROM groups",
    totalReports: "SELECT COUNT(*) as count FROM reports WHERE status = 'pending'",
    totalArticles: "SELECT COUNT(*) as count FROM articles"
  };

  Promise.all(
    Object.entries(queries).map(([key, query]) => 
      new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
          if (err) reject(err);
          resolve({ [key]: results[0].count });
        });
      })
    )
  )
  .then(results => {
    const stats = {
      totalUsers: 0,
      totalSupporters: 0,
      totalSessions: 0,
      totalGroups: 0,
      totalReports: 0,
      totalArticles: 0
    };
    
    results.forEach(result => {
      Object.assign(stats, result);
    });

    // Format for dashboard
    const formattedStats = [
      { label: 'Total Users', value: stats.totalUsers.toString(), change: '+12%', icon: 'People' },
      { label: 'Active Supporters', value: stats.totalSupporters.toString(), change: '+8%', icon: 'Groups' },
      { label: 'Active Sessions', value: stats.totalSessions.toString(), change: '+23%', icon: 'Chat' },
      { label: 'Support Groups', value: stats.totalGroups.toString(), change: '+5%', icon: 'Category' },
      { label: 'Pending Reports', value: stats.totalReports.toString(), change: '-3%', icon: 'Warning' },
      { label: 'Articles', value: stats.totalArticles.toString(), change: '+2%', icon: 'Article' }
    ];

    res.json(formattedStats);
  })
  .catch(err => {
    console.error("Error fetching stats:", err);
    res.status(500).json({ success: false, error: "Database error" });
  });
});

// Users CRUD
router.get("/users", authMiddleware, requireAdmin, (req, res) => {
  const query = `
    SELECT 
      u.*,
      r.role_name as role
    FROM users u
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    ORDER BY u.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    res.json(results);
  });
});

router.post("/users", authMiddleware, requireAdmin, async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  
  try {
    // Hash password
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(password, 10);
    
    // Insert user
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash],
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ success: false, error: "Database error" });
        }
        
        const userId = result.insertId;
        
        // Get role ID
        db.query("SELECT role_id FROM roles WHERE role_name = ?", [role], (roleErr, roleResults) => {
          if (roleErr || roleResults.length === 0) {
            console.error("Error getting role:", roleErr);
            return res.status(500).json({ success: false, error: "Role not found" });
          }
          
          const roleId = roleResults[0].role_id;
          
          // Assign role
          db.query(
            "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
            [userId, roleId],
            (assignErr) => {
              if (assignErr) {
                console.error("Error assigning role:", assignErr);
                return res.status(500).json({ success: false, error: "Database error" });
              }
              
              res.json({ success: true, message: "User created successfully", userId });
            }
          );
        });
      }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.put("/users/:id", authMiddleware, requireAdmin, (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;
  
  db.query(
    "UPDATE users SET name = ?, email = ? WHERE user_id = ?",
    [name, email, userId],
    (err) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      
      if (role) {
        db.query("SELECT role_id FROM roles WHERE role_name = ?", [role], (roleErr, roleResults) => {
          if (roleErr || roleResults.length === 0) {
            return res.status(500).json({ success: false, error: "Role not found" });
          }
          
          const roleId = roleResults[0].role_id;
          
          db.query(
            "UPDATE user_roles SET role_id = ? WHERE user_id = ?",
            [roleId, userId],
            (updateErr) => {
              if (updateErr) console.error("Error updating role:", updateErr);
              res.json({ success: true, message: "User updated successfully" });
            }
          );
        });
      } else {
        res.json({ success: true, message: "User updated successfully" });
      }
    }
  );
});

router.delete("/users/:id", authMiddleware, requireAdmin, (req, res) => {
  const userId = req.params.id;
  
  // First delete from user_roles
  db.query("DELETE FROM user_roles WHERE user_id = ?", [userId], (roleErr) => {
    if (roleErr) {
      console.error("Error deleting user roles:", roleErr);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    
    // Then delete user
    db.query("DELETE FROM users WHERE user_id = ?", [userId], (userErr) => {
      if (userErr) {
        console.error("Error deleting user:", userErr);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      
      res.json({ success: true, message: "User deleted successfully" });
    });
  });
});

// Articles CRUD
router.delete("/articles/:id", authMiddleware, requireAdmin, (req, res) => {
  const articleId = req.params.id;
  
  db.query("DELETE FROM articles WHERE article_id = ?", [articleId], (err) => {
    if (err) {
      console.error("Error deleting article:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    
    res.json({ success: true, message: "Article deleted successfully" });
  });
});

// Groups CRUD
router.delete("/groups/:id", authMiddleware, requireAdmin, (req, res) => {
  const groupId = req.params.id;
  
  // First delete group members
  db.query("DELETE FROM group_members WHERE group_id = ?", [groupId], (memberErr) => {
    if (memberErr) {
      console.error("Error deleting group members:", memberErr);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    
    // Delete group posts
    db.query("DELETE FROM posts WHERE group_id = ?", [groupId], (postErr) => {
      if (postErr) console.error("Error deleting group posts:", postErr);
      
      // Delete group
      db.query("DELETE FROM groups WHERE group_id = ?", [groupId], (groupErr) => {
        if (groupErr) {
          console.error("Error deleting group:", groupErr);
          return res.status(500).json({ success: false, error: "Database error" });
        }
        
        res.json({ success: true, message: "Group deleted successfully" });
      });
    });
  });
});

// Chat Sessions CRUD
router.get("/chat-sessions", authMiddleware, requireAdmin, (req, res) => {
  const query = `
    SELECT cs.*, 
      u1.name as user_name,
      u2.name as supporter_name
    FROM chat_sessions cs
    LEFT JOIN users u1 ON cs.user_id = u1.user_id
    LEFT JOIN users u2 ON cs.supporter_id = u2.user_id
    ORDER BY cs.start_time DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching chat sessions:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    res.json(results);
  });
});

router.delete("/chat-sessions/:id", authMiddleware, requireAdmin, (req, res) => {
  const sessionId = req.params.id;
  
  // First delete chat messages
  db.query("DELETE FROM chat_messages WHERE session_id = ?", [sessionId], (msgErr) => {
    if (msgErr) {
      console.error("Error deleting chat messages:", msgErr);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    
    // Delete chat session
    db.query("DELETE FROM chat_sessions WHERE session_id = ?", [sessionId], (sessionErr) => {
      if (sessionErr) {
        console.error("Error deleting chat session:", sessionErr);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      
      res.json({ success: true, message: "Chat session deleted successfully" });
    });
  });
});

// Scheduled Sessions CRUD
router.get("/scheduled-sessions", authMiddleware, requireAdmin, (req, res) => {
  const query = `
    SELECT ss.*,
      u1.name as user_name,
      u2.name as supporter_name
    FROM scheduled_sessions ss
    LEFT JOIN users u1 ON ss.user_id = u1.user_id
    LEFT JOIN users u2 ON ss.supporter_id = u2.user_id
    ORDER BY ss.scheduled_time DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching scheduled sessions:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    res.json(results);
  });
});

// Roles CRUD
router.get("/roles", authMiddleware, requireAdmin, (req, res) => {
  db.query("SELECT * FROM roles ORDER BY role_id", (err, results) => {
    if (err) {
      console.error("Error fetching roles:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    res.json(results);
  });
});

router.post("/roles", authMiddleware, requireAdmin, (req, res) => {
  const { role_name } = req.body;
  
  db.query("INSERT INTO roles (role_name) VALUES (?)", [role_name], (err) => {
    if (err) {
      console.error("Error creating role:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    
    res.json({ success: true, message: "Role created successfully" });
  });
});

router.put("/roles/:id", authMiddleware, requireAdmin, (req, res) => {
  const roleId = req.params.id;
  const { role_name } = req.body;
  
  db.query("UPDATE roles SET role_name = ? WHERE role_id = ?", [role_name, roleId], (err) => {
    if (err) {
      console.error("Error updating role:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    
    res.json({ success: true, message: "Role updated successfully" });
  });
});

router.delete("/roles/:id", authMiddleware, requireAdmin, (req, res) => {
  const roleId = req.params.id;
  
  // Check if role is being used
  db.query("SELECT COUNT(*) as count FROM user_roles WHERE role_id = ?", [roleId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error checking role usage:", checkErr);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    
    if (checkResults[0].count > 0) {
      return res.status(400).json({ success: false, error: "Cannot delete role that is assigned to users" });
    }
    
    db.query("DELETE FROM roles WHERE role_id = ?", [roleId], (err) => {
      if (err) {
        console.error("Error deleting role:", err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      
      res.json({ success: true, message: "Role deleted successfully" });
    });
  });
});

// Supporters CRUD
router.get("/supporters", authMiddleware, requireAdmin, (req, res) => {
  const query = `
    SELECT ps.*, u.name as user_name, u.email
    FROM peer_supporters ps
    LEFT JOIN users u ON ps.user_id = u.user_id
    ORDER BY ps.supporter_id DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching supporters:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    res.json(results);
  });
});

// Notifications
router.get("/notifications", authMiddleware, requireAdmin, (req, res) => {
  const query = `
    SELECT n.*, u.name as user_name
    FROM notifications n
    LEFT JOIN users u ON n.user_id = u.user_id
    ORDER BY n.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;