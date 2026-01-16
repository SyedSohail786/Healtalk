const router = require("express").Router();
const db = require("../config/db");

router.post("/send", (req, res) => {
  const { user_id, message } = req.body;

  db.query(
    "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
    [user_id, message],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Notification sent" });
    }
  );
});

router.get("/:user_id", (req, res) => {
  db.query(
    "SELECT * FROM notifications WHERE user_id = ?",
    [req.params.user_id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
});

module.exports = router;
