const router = require("express").Router();
const db = require("../config/db");

router.post("/add", (req, res) => {
  const { reporter_id, reported_user_id, reason } = req.body;

  db.query(
    "INSERT INTO reports (reporter_id, reported_user_id, reason, status) VALUES (?, ?, ?, 'pending')",
    [reporter_id, reported_user_id, reason],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Report submitted" });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM reports", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

module.exports = router;
