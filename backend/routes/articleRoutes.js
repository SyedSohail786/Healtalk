const router = require("express").Router();
const db = require("../config/db");
const { authMiddleware, requireRole } = require("../middleware/auth");

// Get Articles with author info
router.get("/", (req, res) => {
  const query = `
    SELECT a.*, u.name as author_name
    FROM articles a
    LEFT JOIN users u ON a.created_by = u.user_id
    ORDER BY a.created_at DESC
  `;
  
  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
    console.log(data);
  });
});

// Get single article by ID
router.get("/:id", (req, res) => {
  const articleId = req.params.id;
  
  const query = `
    SELECT a.*, u.name as author_name
    FROM articles a
    LEFT JOIN users u ON a.created_by = u.user_id
    WHERE a.article_id = ?
  `;
  
  db.query(query, [articleId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(results[0]);
  });
});

// Add Article with authentication
router.post("/add", authMiddleware, (req, res) => {
  const { title, content } = req.body;
  const created_by = req.user.id;

  db.query(
    "INSERT INTO articles (title, content, created_by) VALUES (?, ?, ?)",
    [title, content, created_by],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Article added" });
    }
  );
});

// Update Article (admin or author only)
router.put("/:id", authMiddleware, (req, res) => {
  const articleId = req.params.id;
  const { title, content } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  // First check if article exists and user has permission
  db.query(
    "SELECT created_by FROM articles WHERE article_id = ?",
    [articleId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) {
        return res.status(404).json({ message: "Article not found" });
      }

      const articleCreator = results[0].created_by;
      
      // Check if user is admin or the article creator
      if (userRole !== 'admin' && userId !== articleCreator) {
        return res.status(403).json({ message: "Not authorized to edit this article" });
      }

      // Update article
      db.query(
        "UPDATE articles SET title = ?, content = ? WHERE article_id = ?",
        [title, content, articleId],
        updateErr => {
          if (updateErr) return res.status(500).json(updateErr);
          res.json({ message: "Article updated" });
        }
      );
    }
  );
});

// Delete Article (admin only)
router.delete("/:id", authMiddleware, requireRole('admin'), (req, res) => {
  const articleId = req.params.id;
  
  db.query("DELETE FROM articles WHERE article_id = ?", [articleId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Article deleted" });
  });
});

module.exports = router;