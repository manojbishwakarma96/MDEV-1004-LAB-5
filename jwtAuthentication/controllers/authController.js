const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/models");

// Register Controller
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    // Validate input
    if (!(firstName && lastName && email && username && password)) {
      return res.status(400).json({ message: "All input fields are required" });
    }

    // Check if user already exists (by email or username)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
    });

    // Create token
    const token = jwt.sign(
      {
        user_id: user._id,
        username,
        firstName,
        lastName,
        email,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!(username && password)) {
      return res.status(400).json({ message: "All input fields are required" });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      {
        user_id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Dashboard Controller
const dashboard = (req, res) => {
  try {
    res.status(200).json({
      message: `Welcome to the dashboard, ${req.user.firstName} ${req.user.lastName}`,
      user: req.user,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res
      .status(500)
      .json({ message: "Error accessing dashboard", error: error.message });
  }
};

module.exports = {
  register,
  login,
  dashboard,
};
