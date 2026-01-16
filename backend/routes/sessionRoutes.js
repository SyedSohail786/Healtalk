// routes/sessionRoutes.js
const router = require("express").Router();
const db = require("../config/db");
const { authMiddleware, requireRole } = require("../middleware/auth");

// Get all scheduled sessions for supporter
router.get("/supporter/:supporterId", authMiddleware, requireRole('supporter', 'admin'), (req, res) => {
     const { supporterId } = req.params;

     // Verify the authenticated user is accessing their own data
     if (req.user.supporterId !== parseInt(supporterId) && req.user.role !== 'admin') {
          return res.status(403).json({
               success: false,
               error: "Access denied"
          });
     }

     db.query(
          `SELECT 
      ss.*,
      u.name as user_name,
      u.email as user_email
     FROM scheduled_sessions ss
     JOIN users u ON ss.user_id = u.user_id
     WHERE ss.supporter_id = ? AND ss.status = 'scheduled'
     ORDER BY ss.scheduled_time ASC`,
          [supporterId],
          (err, results) => {
               if (err) {
                    console.error("Error fetching sessions:", err);
                    return res.status(500).json({ success: false, error: "Database error" });
               }

               res.json({
                    success: true,
                    sessions: results
               });
          }
     );
});

// Get active chats for supporter
router.get("/chats/supporter/:supporterId", authMiddleware, requireRole('supporter', 'admin'), (req, res) => {
     const { supporterId } = req.params;

     // Verify the authenticated user is accessing their own data
     if (req.user.supporterId !== parseInt(supporterId) && req.user.role !== 'admin') {
          return res.status(403).json({
               success: false,
               error: "Access denied"
          });
     }

     // Get chat sessions where this supporter is the supporter
     db.query(
          `SELECT 
               cs.session_id,
               cs.user_id,
               u.name as user_name,
               cs.start_time,
               cs.status,
               cs.title,
               (SELECT content FROM chat_messages 
                WHERE session_id = cs.session_id 
                ORDER BY created_at DESC LIMIT 1) as last_message,
               (SELECT created_at FROM chat_messages 
                WHERE session_id = cs.session_id 
                ORDER BY created_at DESC LIMIT 1) as last_message_time,
               (SELECT COUNT(*) FROM chat_messages 
                WHERE session_id = cs.session_id AND sender_id != ? AND is_read = 0) as unread_count
          FROM chat_sessions cs
          JOIN users u ON cs.user_id = u.user_id
          WHERE cs.supporter_id = ?
          ORDER BY cs.start_time DESC`,
          [supporterId, supporterId],
          (err, results) => {
               if (err) {
                    console.error("Error fetching chats:", err);
                    return res.status(500).json({ success: false, error: "Database error" });
               }

               res.json({
                    success: true,
                    chats: results
               });
          }
     );
});

// Get chat messages
router.get("/chat/:sessionId/messages", authMiddleware, (req, res) => {
     const { sessionId } = req.params;

     // First check if user has access to this session
     db.query(
          `SELECT user_id, supporter_id FROM chat_sessions WHERE session_id = ?`,
          [sessionId],
          (err, results) => {
               if (err) {
                    console.error("Error checking session access:", err);
                    return res.status(500).json({ success: false, error: "Database error" });
               }

               if (results.length === 0) {
                    return res.status(404).json({ success: false, error: "Session not found" });
               }

               const session = results[0];

               // Check if user is part of this session
               if (req.user.id !== session.user_id && req.user.id == session.supporter_id && req.user.role !== 'admin') {
                    return res.status(403).json({
                         success: false,
                         error: "Access denied to this session"
                    });
               }

               // Now fetch messages
               db.query(
                    `SELECT 
          cm.*,
          u.name as sender_name
         FROM chat_messages cm
         JOIN users u ON cm.sender_id = u.user_id
         WHERE cm.session_id = ?
         ORDER BY cm.created_at ASC`,
                    [sessionId],
                    (err, messages) => {
                         if (err) {
                              console.error("Error fetching messages:", err);
                              return res.status(500).json({ success: false, error: "Database error" });
                         }

                         res.json({
                              success: true,
                              messages: messages
                         });
                    }
               );
          }
     );
});

// Start a session
router.post("/start/:sessionId", authMiddleware, requireRole('supporter', 'admin'), (req, res) => {
     const { sessionId } = req.params;
     const { sessionType } = req.body;

     // First check if supporter owns this session
     db.query(
          `SELECT supporter_id FROM scheduled_sessions WHERE session_id = ?`,
          [sessionId],
          (err, results) => {
               if (err) {
                    console.error("Error checking session ownership:", err);
                    return res.status(500).json({ success: false, error: "Database error" });
               }

               if (results.length === 0) {
                    return res.status(404).json({ success: false, error: "Session not found" });
               }

               const session = results[0];
               console.log(req.user)
               // Check if supporter owns this session
               if (req.user.supporterId !== session.supporter_id && req.user.role !== 'admin') {
                    return res.status(403).json({
                         success: false,
                         error: "You don't have permission to start this session"
                    });
               }

               // Start the session
               db.query(
                    "UPDATE scheduled_sessions SET status = 'active' WHERE session_id = ?",
                    [sessionId],
                    (updateErr) => {
                         if (updateErr) {
                              console.error("Error starting session:", updateErr);
                              return res.status(500).json({ success: false, error: "Database error" });
                         }

                         // Also create a chat session if it doesn't exist and session type is chat
                         if (sessionType === 'chat') {
                              db.query(
                                   `INSERT INTO chat_sessions (user_id, supporter_id, session_type, status, start_time)
               SELECT user_id, supporter_id, 'chat', 'active', NOW()
               FROM scheduled_sessions WHERE session_id = ?
               ON DUPLICATE KEY UPDATE status = 'active'`,
                                   [sessionId],
                                   (chatErr) => {
                                        if (chatErr) console.error("Error creating/updating chat session:", chatErr);

                                        res.json({
                                             success: true,
                                             message: "Session started successfully"
                                        });
                                   }
                              );
                         } else {
                              res.json({
                                   success: true,
                                   message: "Session started successfully"
                              });
                         }
                    }
               );
          }
     );
});

// End a session
router.post("/end/:sessionId", authMiddleware, (req, res) => {
     const { sessionId } = req.params;

     // First check if user has access to this session
     db.query(
          `SELECT user_id, supporter_id FROM scheduled_sessions WHERE session_id = ?`,
          [sessionId],
          (err, results) => {
               if (err) {
                    console.error("Error checking session access:", err);
                    return res.status(500).json({ success: false, error: "Database error" });
               }

               if (results.length === 0) {
                    return res.status(404).json({ success: false, error: "Session not found" });
               }

               const session = results[0];

               // Check if user is part of this session
               if (req.user.id !== session.user_id && req.user.id !== session.supporter_id && req.user.role !== 'admin') {
                    return res.status(403).json({
                         success: false,
                         error: "You don't have permission to end this session"
                    });
               }

               // End the session
               db.query(
                    "UPDATE scheduled_sessions SET status = 'completed', end_time = NOW() WHERE session_id = ?",
                    [sessionId],
                    (updateErr) => {
                         if (updateErr) {
                              console.error("Error ending session:", updateErr);
                              return res.status(500).json({ success: false, error: "Database error" });
                         }

                         // Also end any associated chat session
                         db.query(
                              "UPDATE chat_sessions SET status = 'completed', end_time = NOW() WHERE session_id = ?",
                              [sessionId],
                              (chatErr) => {
                                   if (chatErr) console.error("Error ending chat session:", chatErr);

                                   res.json({
                                        success: true,
                                        message: "Session ended successfully"
                                   });
                              }
                         );
                    }
               );
          }
     );
});

// Schedule a new session
router.post("/schedule", authMiddleware, (req, res) => {
     const { supporterId, sessionType, scheduledTime, duration, title, notes } = req.body;
     const userId = req.user.id;

     // Validate required fields
     if (!supporterId || !sessionType || !scheduledTime) {
          return res.status(400).json({
               success: false,
               error: "Missing required fields"
          });
     }

     // Validate scheduled time is in the future
     const scheduledDate = new Date(scheduledTime);
     if (scheduledDate <= new Date()) {
          return res.status(400).json({
               success: false,
               error: "Scheduled time must be in the future"
          });
     }

     // Check if supporter exists and is available
     db.query(
          `SELECT ps.*, u.name as supporter_name 
     FROM peer_supporters ps
     JOIN users u ON ps.user_id = u.user_id
     WHERE ps.supporter_id = ? AND ps.is_verified = 1`,
          [supporterId],
          (supporterErr, supporterResults) => {
               if (supporterErr) {
                    console.error("Error checking supporter:", supporterErr);
                    return res.status(500).json({ success: false, error: "Database error" });
               }

               if (supporterResults.length === 0) {
                    return res.status(404).json({
                         success: false,
                         error: "Supporter not found or not verified"
                    });
               }

               const supporter = supporterResults[0];

               // Check for scheduling conflicts
               db.query(
                    `SELECT * FROM scheduled_sessions 
         WHERE supporter_id = ? 
         AND scheduled_time BETWEEN DATE_SUB(?, INTERVAL ? MINUTE) AND DATE_ADD(?, INTERVAL ? MINUTE)
         AND status IN ('scheduled', 'active')`,
                    [supporterId, scheduledTime, duration || 60, scheduledTime, duration || 60],
                    (conflictErr, conflictResults) => {
                         if (conflictErr) {
                              console.error("Error checking conflicts:", conflictErr);
                              return res.status(500).json({ success: false, error: "Database error" });
                         }

                         if (conflictResults.length > 0) {
                              return res.status(409).json({
                                   success: false,
                                   error: "Time slot is not available"
                              });
                         }

                         // Schedule the session
                         db.query(
                              `INSERT INTO scheduled_sessions 
             (user_id, supporter_id, session_type, scheduled_time, duration_minutes, title, notes, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
                              [userId, supporterId, sessionType, scheduledTime, duration || 60, title || `${sessionType} Session`, notes],
                              (insertErr, result) => {
                                   if (insertErr) {
                                        console.error("Error scheduling session:", insertErr);
                                        return res.status(500).json({ success: false, error: "Database error" });
                                   }

                                   res.json({
                                        success: true,
                                        message: "Session scheduled successfully",
                                        sessionId: result.insertId,
                                        session: {
                                             sessionId: result.insertId,
                                             userId,
                                             supporterId,
                                             supporterName: supporter.supporter_name,
                                             sessionType,
                                             scheduledTime,
                                             duration: duration || 60,
                                             title: title || `${sessionType} Session`,
                                             notes,
                                             status: 'scheduled'
                                        }
                                   });
                              }
                         );
                    }
               );
          }
     );
});


// routes/sessionRoutes.js - Add this route at the top after imports
// Add to the existing file or modify it

// Get available supporters for audio/video
router.get("/supporters", authMiddleware, (req, res) => {
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
      COUNT(f.feedback_id) as reviews,
      GROUP_CONCAT(DISTINCT sc.category_id) as categories
    FROM peer_supporters ps
    JOIN users u ON ps.user_id = u.user_id
    LEFT JOIN feedback f ON ps.supporter_id = f.supporter_id
    LEFT JOIN supporter_categories sc ON ps.supporter_id = sc.supporter_id
    WHERE ps.is_verified = 1
    GROUP BY ps.supporter_id
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

// Book a session
// Book a session
router.post("/book", authMiddleware, (req, res) => {
     const { supporter_id, session_type, scheduled_time, duration_minutes, title, notes } = req.body;
     const user_id = req.user.id;

     // Validate required fields
     if (!supporter_id || !session_type || !scheduled_time) {
          return res.status(400).json({
               success: false,
               error: "Missing required fields"
          });
     }

     // Parse the scheduled time (assuming format like "9:00 AM")
     // You might need to adjust this based on your frontend format
     const parseTime = (timeStr) => {
          // Parse time like "9:00 AM" or "2:30 PM"
          const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (!match) {
               return null;
          }

          let hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const meridiem = match[3].toUpperCase();

          // Convert 12-hour format to 24-hour format
          if (meridiem === 'PM' && hours < 12) {
               hours += 12;
          } else if (meridiem === 'AM' && hours === 12) {
               hours = 0;
          }

          // Create a date for today with this time
          const today = new Date();
          today.setHours(hours, minutes, 0, 0);

          // If the time has already passed today, schedule for tomorrow
          if (today <= new Date()) {
               today.setDate(today.getDate() + 1);
          }

          return today;
     };

     // Try to parse the time
     const scheduledDate = parseTime(scheduled_time);

     // Check if the date is valid
     if (!scheduledDate || isNaN(scheduledDate.getTime())) {
          return res.status(400).json({
               success: false,
               error: "Invalid time format. Please use format like '9:00 AM' or '2:30 PM'"
          });
     }

     // Format the scheduled time for MySQL
     const formattedTime = scheduledDate.toISOString().slice(0, 19).replace('T', ' ');

     // Schedule the session
     db.query(
          `INSERT INTO scheduled_sessions 
     (user_id, supporter_id, session_type, scheduled_time, duration_minutes, title, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
          [user_id, supporter_id, session_type, formattedTime, duration_minutes || 60, title || `${session_type} Session`, notes || ''],
          (err, result) => {
               if (err) {
                    console.error("Error booking session:", err);
                    return res.status(500).json({ success: false, error: "Database error" });
               }

               res.json({
                    success: true,
                    message: "Session booked successfully",
                    session_id: result.insertId
               });
          }
     );
});

// Get available supporters for chat
router.get("/available-supporters", authMiddleware, (req, res) => {
     const query = `
    SELECT 
      ps.supporter_id,
      u.user_id,
      u.name,
      ps.status as availability_status,
      ps.experience,
      COALESCE(AVG(f.rating), 4.5) as rating
    FROM peer_supporters ps
    JOIN users u ON ps.user_id = u.user_id
    LEFT JOIN feedback f ON ps.supporter_id = f.supporter_id
    WHERE ps.is_verified = 1 
    AND ps.status IN ('online', 'available')
    GROUP BY ps.supporter_id
  `;

     db.query(query, (err, results) => {
          if (err) {
               console.error("Error fetching available supporters:", err);
               return res.status(500).json({ success: false, error: "Database error" });
          }

          res.json({
               success: true,
               supporters: results
          });
     });
});

// In sessionRoutes.js - for users (not just supporters)
router.get('/chat/sessions/:userId', authMiddleware, (req, res) => {
  const userId = req.params.userId;
  if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }
  db.query(`
    SELECT cs.*, u.name as username, 
    (SELECT content FROM chatmessages WHERE sessionid = cs.sessionid ORDER BY createdat DESC LIMIT 1) as lastmessage,
    (SELECT COUNT(*) FROM chatmessages WHERE sessionid = cs.sessionid AND senderid != ? AND isread = 0) as unreadcount
    FROM chatsessions cs 
    JOIN users u ON cs.userid = u.userid 
    WHERE cs.userid = ? 
    ORDER BY cs.starttime DESC
  `, [userId, userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    res.json({ success: true, chats: results });
  });
});


module.exports = router;