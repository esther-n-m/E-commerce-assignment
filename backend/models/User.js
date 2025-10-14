/*
 User Model
 Defines the structure for user documents stored in MongoDB.
 Uses Mongoose Schema to enforce data types and validation rules.
 */
const mongoose = require("mongoose");

// 1. Define the Schema (the blueprint/rules for a User)
const userSchema = new mongoose.Schema({
  // Name is required to be a String
  name: { 
    type: String, 
    required: true 
  },
  // Email is required, must be a String, AND must be unique (no two users can share an email)
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Password is required. We will store the HASHED version here, not the original text.
  password: { 
    type: String, 
    required: true 
  },
});

// 2. Export the Model so we can use it in our routes 
module.exports = mongoose.model("User", userSchema);
