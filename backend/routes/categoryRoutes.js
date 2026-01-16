const router = require("express").Router();
const db = require("../config/db");

router.post("/add", (req, res) => {
  const { name, description } = req.body;

  db.query(
    "INSERT INTO categories (name, description) VALUES (?, ?)",
    [name, description],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category Added" });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

module.exports = router;
