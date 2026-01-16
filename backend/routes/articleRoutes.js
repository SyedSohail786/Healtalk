const router = require("express").Router();
const db = require("../config/db");

// Add Article
router.post("/add", (req, res) => {
  const { title, content, created_by } = req.body;

  db.query(
    "INSERT INTO articles (title, content, created_by) VALUES (?, ?, ?)",
    [title, content, created_by],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Article added" });
    }
  );
});

// Get Articles
router.get("/", (req, res) => {
  db.query("SELECT * FROM articles", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

module.exports = router;
