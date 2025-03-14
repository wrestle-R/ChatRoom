const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add index for faster lookups
userSchema.index({ username: 'text', firstName: 'text', lastName: 'text' });

const User = mongoose.model('User', userSchema);

module.exports = User;