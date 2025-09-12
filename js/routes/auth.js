// routes/auth.js
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Import the User model
const jwt = require("jsonwebtoken");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    // 1. Get user data from the request body (sent by your frontend)
    const { name, email, password, imageFile} = req.body;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Create a new user instance using the Model
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // NOTE: We will hash this password next
      imageFile,
    });

    // 3. Save the new user to the database
    const savedUser = await newUser.save();

    // 4. Send a success response back to the frontend
    res.status(201).json({
      message: "User created successfully!",
      user: { id: savedUser._id, name: savedUser.name },
    });
  } catch (error) {
    // 5. Handle errors (e.g., duplicate email, validation failure)
    console.error(error);

    // Check for a duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists!" });
    }
    // Check for validation errors (like missing fields)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // make sure JWT_SECRET exists in .env & Render
      { expiresIn: "1h" }
    );

  res.json({
    message: "Login successful",
    token: token,
    user: { id: user._id, name: user.name, email: user.email, imageFile: user.imageFile, },
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});


router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "No token, authorization denied" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is not valid" });
  }
});

module.exports = router;
