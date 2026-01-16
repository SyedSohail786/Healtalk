const router = require("express").Router();
const db = require("../config/db");

router.post("/assign", (req, res) => {
  const { user_id, role_id } = req.body;

  db.query(
    "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
    [user_id, role_id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Role Assigned" });
    }
  );
});

module.exports = router;
