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

  // First check if already a member
  db.query(
    "SELECT * FROM group_members WHERE group_id = ? AND user_id = ?",
    [group_id, user_id],
    (checkErr, checkResults) => {
      if (checkErr) return res.status(500).json(err);
      
      if (checkResults.length > 0) {
        return res.status(409).json({ message: "Already a member" });
      }
      
      // If not a member, add them
      db.query(
        "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
        [group_id, user_id],
        err => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Joined group" });
        }
      );
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


// Get groups with member count
router.get("/with-members", (req, res) => {
  const query = `
    SELECT g.*, 
           COUNT(gm.user_id) as members,
           c.name as category_name
    FROM groups g
    LEFT JOIN group_members gm ON g.group_id = gm.group_id
    LEFT JOIN categories c ON g.category_id = c.category_id
    GROUP BY g.group_id
    ORDER BY g.group_id DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Check if user is member of a group
router.get("/:groupId/is-member/:userId", (req, res) => {
  const { groupId, userId } = req.params;
  
  db.query(
    "SELECT * FROM group_members WHERE group_id = ? AND user_id = ?",
    [groupId, userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ isMember: results.length > 0 });
    }
  );
});

// Get user's groups
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;
  
  const query = `
    SELECT g.*, 
           COUNT(gm2.user_id) as members,
           c.name as category_name
    FROM groups g
    JOIN group_members gm ON g.group_id = gm.group_id
    LEFT JOIN group_members gm2 ON g.group_id = gm2.group_id
    LEFT JOIN categories c ON g.category_id = c.category_id
    WHERE gm.user_id = ?
    GROUP BY g.group_id
    ORDER BY g.group_id DESC
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.post("/leave", (req, res) => {
  const { group_id, user_id } = req.body;

  db.query(
    "DELETE FROM group_members WHERE group_id = ? AND user_id = ?",
    [group_id, user_id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Left group" });
    }
  );
});


module.exports = router;
