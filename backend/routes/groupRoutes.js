const router = require("express").Router();
const db = require("../config/db");

router.post("/create", (req, res) => {
  const { name, category_id, created_by } = req.body;

  db.query(
    "INSERT INTO groups (name, category_id, created_by) VALUES (?, ?, ?)",
    [name, category_id, created_by],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Group created" });
    }
  );
});


router.post("/join", (req, res) => {
  const { group_id, user_id } = req.body;

  db.query(
    "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
    [group_id, user_id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Joined group" });
    }
  );
});


router.post("/post", (req, res) => {
  const { group_id, user_id, content } = req.body;

  db.query(
    "INSERT INTO posts (group_id, user_id, content) VALUES (?, ?, ?)",
    [group_id, user_id, content],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Post created" });
    }
  );
});


router.get("/posts/:group_id", (req, res) => {
  db.query(
    "SELECT * FROM posts WHERE group_id = ?",
    [req.params.group_id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
});


router.get("/", (req, res) => {
  db.query("SELECT * FROM groups", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

module.exports = router;
