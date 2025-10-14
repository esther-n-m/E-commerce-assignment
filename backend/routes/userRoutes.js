/**
 * User Routes
 * Defines API endpoints for user-related actions, starting with registration and login.
 */
const express = require("express");
const bcrypt = require("bcryptjs");


const User = require("../models/User"); 
const router = express.Router();


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

    // D. Send a successful response back to the client
    res.status(201).json({ 
      message: " User registered successfully!", 
      user: { id: newUser._id, name: newUser.name, email: newUser.email } // Only return safe user data
    });
    
  } catch (error) {
    // E. Handle any server or database errors
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Error registering user. Please check server console for details.", error: error.message });
  }
});

// Export the router to be used in server.js
module.exports = router;
