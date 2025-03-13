const express = require("express");
const router = express.Router();
const { register, login, dashboard } = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/dashboard", verifyToken, dashboard);

module.exports = router;
