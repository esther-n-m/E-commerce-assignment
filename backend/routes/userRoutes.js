/**
 * User Routes
 * Defines API endpoints for user-related actions, starting with registration and login.
 */
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); 
const router = express.Router();
const jwt = require("jsonwebtoken");

//  function to generate a JWT
const generateToken = (id) => {
    // Uses the secret key from your .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token expires in 7 days
    });
};

// 1. POST /api/users/register - Handles new user creation

router.post("/register", async (req, res) => {
  // Destructure name, email, and password from the request body
  const { name, email, password } = req.body;

  try {
    // A. Check if user already exists (using the email field)
    const existing = await User.findOne({ email });
    if (existing) {
      // If the email is found, send a 400 Bad Request error
      return res.status(400).json({ message: "User already exists with this email address." });
    }

    // B. Hash the password for security (10 is the salt factor/difficulty)
    const hashed = await bcrypt.hash(password, 10);

    // C. Create the new user object and save it to the database
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashed // Save the HASHED password
    });

    // D. Generate token and send response
    const token = generateToken(newUser._id);

    res.status(201).json({ 
      message: "User registered successfully!", 
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token, // Send the token back after registration
    });
    
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: "Registration failed due to a server error." });
  }
});

// 2. POST /api/users/login - Handles user sign-in
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // A. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials (User not found)." });
        }

        // B. Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials (Password mismatch)." });
        }

        // C. Generate a JWT upon successful login
        const token = generateToken(user._id);

        // D. Send success response with token
        res.json({ 
            message: "Login successful", 
            user: { id: user._id, name: user.name, email: user.email },
            token 
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Login failed due to a server error." });
    }
});

// Export the router to be used in server.js
module.exports = router;
