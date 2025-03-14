const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  text: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  senderUsername: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for fetching messages by roomId more efficiently
messageSchema.index({ roomId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;