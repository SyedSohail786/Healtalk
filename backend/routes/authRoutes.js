const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Add this
const db = require("../config/db");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hash],
    (err, result) => {
      if (err) return res.status(500).json(err);
      
      // Get user role (default to user role)
      db.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES (?, 1)",
        [result.insertId],
        (roleErr) => {
          if (roleErr) console.error("Role assignment failed:", roleErr);
          res.json({ message: "User Registered", userId: result.insertId });
        }
      );
    }
  );
});

// Login - UPDATED VERSION
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    `SELECT u.*, r.role_name as role 
     FROM users u
     LEFT JOIN user_roles ur ON u.user_id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.role_id
     WHERE u.email = ?`, 
    [email], 
    async (err, data) => {
      if (err) return res.status(500).json({ success: false, error: "Database error" });
      
      if (data.length === 0) {
        return res.status(401).json({ success: false, error: "User not found" });
      }

      const user = data[0];
      const valid = await bcrypt.compare(password, user.password);
      
      if (!valid) {
        return res.status(401).json({ success: false, error: "Wrong password" });
      }

      // Create JWT token
      const token = jwt.sign(
        { 
          userId: user.user_id, 
          email: user.email, 
          name: user.name,
          role: user.role || 'user' 
        },
        process.env.JWT_SECRET || "your-secret-key-change-this",
        { expiresIn: "24h" }
      );

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: "Login success",
        token: token, // Add token here
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          createdAt: user.created_at
        }
      });
    }
  );
});

module.exports = router;