// routes/auth.js
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // 1. Get user data from the request body (sent by your frontend)
    const { name, email, password } = req.body;

    // 2. Create a new user instance using the Model
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // NOTE: We will hash this password next
    });

    // 3. Save the new user to the database
    const savedUser = await newUser.save();

    // 4. Send a success response back to the frontend
    res.status(201).json({ 
      message: 'User created successfully!', 
      user: { id: savedUser._id, name: savedUser.name } 
    });

  } catch (error) {
    // 5. Handle errors (e.g., duplicate email, validation failure)
    console.error(error);
    
    // Check for a duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists!' });
    }
    // Check for validation errors (like missing fields)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;