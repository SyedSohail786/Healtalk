// routes/supporterRoutes.js
const router = require("express").Router();
const db = require("../config/db");
const { authMiddleware, requireRole } = require("../middleware/auth");

// Get all verified supporters
router.get("/", authMiddleware, (req, res) => {
  const { type } = req.query;
  
  let query = `
    SELECT 
      ps.supporter_id,
      u.user_id,
      u.name,
      u.email,
      ps.bio,
      ps.experience,
      ps.status,
      ps.qualifications,
      ps.is_verified,
      ps.availability,
      COALESCE(AVG(f.rating), 4.5) as rating,
      COUNT(f.feedback_id) as reviews
    FROM peer_supporters ps
    JOIN users u ON ps.user_id = u.user_id
    LEFT JOIN feedback f ON ps.supporter_id = f.supporter_id
    WHERE ps.is_verified = 1
    GROUP BY ps.supporter_id
    ORDER BY rating DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching supporters:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }
    
    res.json({
      success: true,
      supporters: results
    });
  });
});


// routes/supporterRoutes.js - Add this route
router.put("/status", authMiddleware, requireRole('supporter'), (req, res) => {
  const { isOnline } = req.body;
  const userId = req.user.id;

  // First get supporter_id from user_id
  db.query(
    `SELECT supporter_id FROM peer_supporters WHERE user_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error getting supporter:", err);
        return res.status(500).json({ success: false, error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, error: "Supporter not found" });
      }

      const supporterId = results[0].supporter_id;

      // Update supporter status
      const newStatus = isOnline ? 'online' : 'offline';
      db.query(
        `UPDATE peer_supporters SET status = ? WHERE supporter_id = ?`,
        [newStatus, supporterId],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating status:", updateErr);
            return res.status(500).json({ success: false, error: "Database error" });
          }

          res.json({
            success: true,
            message: `Status updated to ${newStatus}`,
            status: newStatus
          });
        }
      );
    }
  );
});


// Update supporter status
router.put("/status", authMiddleware, requireRole('supporter'), async (req, res) => {
  const { isOnline } = req.body;
  const userId = req.user.id;
  
  try {
    // First, get supporter_id from user_id
    const [supporterResults] = await db.promise().query(
      `SELECT supporter_id FROM peer_supporters WHERE user_id = ?`,
      [userId]
    );
    
    if (supporterResults.length === 0) {
      return res.status(404).json({ success: false, error: "Supporter not found" });
    }
    
    const supporterId = supporterResults[0].supporter_id;
    const status = isOnline ? 'online' : 'offline';
    
    await db.promise().query(
      `UPDATE peer_supporters SET status = ? WHERE supporter_id = ?`,
      [status, supporterId]
    );
    
    res.json({
      success: true,
      message: `Status updated to ${status}`,
      status: status
    });
  } catch (error) {
    console.error("Error updating supporter status:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});


module.exports = router;