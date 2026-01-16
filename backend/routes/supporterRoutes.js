const router = require("express").Router();
const db = require("../config/db");

// Create supporter profile
router.post("/create", (req, res) => {
  const { user_id, bio, experience, status } = req.body;

  db.query(
    "INSERT INTO peer_supporters (user_id, bio, experience, status) VALUES (?, ?, ?, ?)",
    [user_id, bio, experience, status],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Supporter profile created" });
    }
  );
});

// View all supporters
router.get("/", (req, res) => {
  db.query("SELECT * FROM peer_supporters", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

module.exports = router;
