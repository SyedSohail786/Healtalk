// routes/chatRoutes.js
const router = require("express").Router();
const db = require("../config/db");
const { authMiddleware } = require("../middleware/auth");

// Start a chat session
router.post("/start", authMiddleware, (req, res) => {
  const { supporter_id, title } = req.body;
  const user_id = req.user.id;
  
  if (!supporter_id) {
    return res.status(400).json({ 
      success: false, 
      error: "Supporter ID is required" 
    });
  }
  
  // Check if supporter exists and is verified
  db.query(
    `SELECT ps.*, u.name as supporter_name 
     FROM peer_supporters ps
     JOIN users u ON ps.user_id = u.user_id
     WHERE ps.supporter_id = ? AND ps.is_verified = 1`,
    [supporter_id],
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
      
      // Check for existing active chat
      db.query(
        `SELECT * FROM chat_sessions 
         WHERE user_id = ? AND supporter_id = ? AND status = 'active'`,
        [user_id, supporter_id],
        (existingErr, existingResults) => {
          if (existingErr) {
            console.error("Error checking existing chats:", existingErr);
            return res.status(500).json({ success: false, error: "Database error" });
          }
          
          if (existingResults.length > 0) {
            // Return existing chat
            const existingChat = existingResults[0];
            existingChat.supporter = supporter;
            
            return res.json({
              success: true,
              session_id: existingChat.session_id,
              chat: existingChat
            });
          }
          
          // Create new chat session
          db.query(
            `INSERT INTO chat_sessions 
             (user_id, supporter_id, start_time, session_type, status, title)
             VALUES (?, ?, NOW(), 'chat', 'active', ?)`,
            [user_id, supporter_id, title || `Chat with ${supporter.supporter_name}`],
            (insertErr, result) => {
              if (insertErr) {
                console.error("Error creating chat session:", insertErr);
                return res.status(500).json({ success: false, error: "Database error" });
              }
              
              const newChat = {
                session_id: result.insertId,
                user_id,
                supporter_id,
                start_time: new Date(),
                session_type: 'chat',
                status: 'active',
                title: title || `Chat with ${supporter.supporter_name}`,
                supporter: supporter
              };
              
              res.json({
                success: true,
                session_id: result.insertId,
                chat: newChat
              });
            }
          );
        }
      );
    }
  );
});

// Get chat messages
router.get("/:sessionId/messages", authMiddleware, (req, res) => {
  const { sessionId } = req.params;
  
  // Check if user has access to this chat
  db.query(
    `SELECT user_id, supporter_id FROM chat_sessions WHERE session_id = ?`,
    [sessionId],
    (accessErr, accessResults) => {
      if (accessErr) {
        console.error("Error checking chat access:", accessErr);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      
      if (accessResults.length === 0) {
        return res.status(404).json({ success: false, error: "Chat session not found" });
      }
      
      const chat = accessResults[0];
      
      // Check if user is part of this chat
      if (req.user.id !== chat.user_id && req.user.id !== chat.supporter_id) {
        return res.status(403).json({ 
          success: false, 
          error: "Access denied to this chat" 
        });
      }
      
      // Get messages
      db.query(
        `SELECT 
          cm.*,
          u.name as sender_name
         FROM chat_messages cm
         JOIN users u ON cm.sender_id = u.user_id
         WHERE cm.session_id = ?
         ORDER BY cm.created_at ASC`,
        [sessionId],
        (err, results) => {
          if (err) {
            console.error("Error fetching messages:", err);
            return res.status(500).json({ success: false, error: "Database error" });
          }
          
          // Mark messages as read for the current user
          db.query(
            `UPDATE chat_messages 
             SET is_read = 1 
             WHERE session_id = ? AND sender_id != ? AND is_read = 0`,
            [sessionId, req.user.id],
            (updateErr) => {
              if (updateErr) console.error("Error updating read status:", updateErr);
              
              res.json({
                success: true,
                messages: results
              });
            }
          );
        }
      );
    }
  );
});

// Send a message
router.post("/send", authMiddleware, (req, res) => {
  const { session_id, content, message_type = 'text' } = req.body;
  const sender_id = req.user.id;
  
  if (!session_id || !content) {
    return res.status(400).json({ 
      success: false, 
      error: "Session ID and content are required" 
    });
  }
  
  // Check if user has access to this chat
  db.query(
    `SELECT user_id, supporter_id FROM chat_sessions WHERE session_id = ?`,
    [session_id],
    (accessErr, accessResults) => {
      if (accessErr) {
        console.error("Error checking chat access:", accessErr);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      
      if (accessResults.length === 0) {
        return res.status(404).json({ success: false, error: "Chat session not found" });
      }
      
      const chat = accessResults[0];
      
      // Check if user is part of this chat
      if (sender_id !== chat.user_id && sender_id !== chat.supporter_id) {
        return res.status(403).json({ 
          success: false, 
          error: "Access denied to this chat" 
        });
      }
      
      // Insert the message
      db.query(
        `INSERT INTO chat_messages 
         (session_id, sender_id, message_type, content, is_read, created_at)
         VALUES (?, ?, ?, ?, 0, NOW())`,
        [session_id, sender_id, message_type, content],
        (err, result) => {
          if (err) {
            console.error("Error sending message:", err);
            return res.status(500).json({ success: false, error: "Database error" });
          }
          
          // Get the newly created message with sender name
          db.query(
            `SELECT 
              cm.*,
              u.name as sender_name
             FROM chat_messages cm
             JOIN users u ON cm.sender_id = u.user_id
             WHERE cm.message_id = ?`,
            [result.insertId],
            (msgErr, msgResults) => {
              if (msgErr) {
                console.error("Error fetching new message:", msgErr);
                return res.status(500).json({ success: false, error: "Database error" });
              }
              
              res.json({
                success: true,
                message: msgResults[0]
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;