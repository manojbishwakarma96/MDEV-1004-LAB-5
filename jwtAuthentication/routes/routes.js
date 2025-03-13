const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

// Login route (for testing purposes)
router.post("/login", (req, res) => {
  // This is a simplified login for demonstration
  // In a real app, you would verify credentials against a database
  const username = "Sarthak Patel";

  const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Protected dashboard route
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome to the dashboard, ${req.user.username}` });
});

module.exports = router;
