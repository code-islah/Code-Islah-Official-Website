const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const authMiddleware = require("../middleware/auth"); // to protect route

router.post("/run-updates", authMiddleware, (req, res) => {
  // Only allow if user is admin
  if (req.user.email !== "alaminkhan00710@gmail.com") {
    return res.status(403).json({ message: "Forbidden" });
  }

  exec("node js/update.js", (error, stdout, stderr) => {
    if (error) return res.status(500).json({ message: error.message });
    if (stderr) return res.status(500).json({ message: stderr });

    res.json({
      message: "Update scripts executed successfully!",
      output: stdout,
    });
  });
});

module.exports = router;
