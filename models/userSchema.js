const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["customer", "chef", "admin"], 
    default: "customer" 
  },
  contact: { 
    type: String, 
    required: true, 
    trim: true 
  },
}, { timestamps: true }); // adds createdAt & updatedAt automatically

// ✅ Correct: model name first, then schema
const User = mongoose.model("User", userSchema);

module.exports = User;
