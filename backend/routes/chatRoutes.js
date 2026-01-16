const router = require("express").Router();
const db = require("../config/db");

// Start new chat session
router.post("/start", (req, res) => {
  const { user_id, supporter_id } = req.body;

  db.query(
    "INSERT INTO chat_sessions (user_id, supporter_id, start_time) VALUES (?, ?, NOW())",
    [user_id, supporter_id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Chat session started" });
    }
  );
});


router.post("/message", (req, res) => {
  const { session_id, sender_id, message } = req.body;

  db.query(
    "INSERT INTO messages (session_id, sender_id, message) VALUES (?, ?, ?)",
    [session_id, sender_id, message],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Message sent" });
    }
  );
});


router.get("/:session_id", (req, res) => {
  const session_id = req.params.session_id;

  db.query(
    "SELECT * FROM messages WHERE session_id = ?",
    [session_id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
});


module.exports = router;
