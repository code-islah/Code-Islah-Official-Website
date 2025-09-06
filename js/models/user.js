// 1. Import Mongoose
const mongoose = require('mongoose');

// 2. Define the User Schema (the blueprint)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // This field is mandatory
    trim: true // Removes extra spaces from start/end
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    lowercase: true // Always converts value to lowercase
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Enforces a minimum password length
  }
}, {
  timestamps: true // Optional: Adds `createdAt` and `updatedAt` fields automatically
});

// 3. Create the Model from the Schema and export it
module.exports = mongoose.model('User', userSchema);