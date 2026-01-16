const router = require("express").Router();
const db = require("../config/db");

router.post("/add", (req, res) => {
  const { user_id, supporter_id, rating, comments } = req.body;

  db.query(
    "INSERT INTO feedback (user_id, supporter_id, rating, comments) VALUES (?, ?, ?, ?)",
    [user_id, supporter_id, rating, comments],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Feedback submitted" });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM feedback", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

module.exports = router;
