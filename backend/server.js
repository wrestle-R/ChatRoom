const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));   

// User registration route - to save user info when they connect
app.post('/api/users', async (req, res) => {
  try {
    const { userId, username, firstName, lastName, email } = req.body;
    
    // Update or create user
    const user = await User.findOneAndUpdate(
      { userId }, 
      { 
        userId,
        username,
        firstName,
        lastName, 
        email,
        lastActive: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this function to get the current number of online users
const getOnlineUsersCount = () => {
    return io.sockets.sockets.size;
  };
  
  // Inside your Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Emit current online users count to all clients
    io.emit('online_users_count', getOnlineUsersCount());
    
    // Register user data with socket
    socket.on('register_user', (userData) => {
      console.log(`User registered: ${userData.username}`);
      socket.userData = userData;
      
      // Notify others that a user has come online
      socket.broadcast.emit('user_online', {
        socketId: socket.id,
        ...userData
      });
      
      // Update online users count after new user registers
      io.emit('online_users_count', getOnlineUsersCount());
    });
    
    // ... existing socket event handlers ...
    
    // Enhance disconnect handler to update online users count
    socket.on('disconnect', () => {
      if (socket.userData) {
        io.emit('user_offline', {
          socketId: socket.id,
          ...socket.userData
        });
      }
      
      // Update online users count after disconnection
      io.emit('online_users_count', getOnlineUsersCount());
      
      console.log(`User disconnected: ${socket.id}`);
    });
  });

// Search users by username - Fix implementation
app.get('/api/users/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    console.log(`Searching for users with query: ${query}`); // Add logging
    
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    
    console.log(`Found ${users.length} users`); // Add logging
    
    res.status(200).json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get online users
app.get('/api/users/online', (req, res) => {
  const onlineUsers = [];
  
  // Get all connected socket IDs
  const sockets = io.sockets.sockets;
  
  // Convert Map to array and extract user data
  for (const [socketId, socket] of sockets.entries()) {
    if (socket.userData) {
      onlineUsers.push({
        socketId,
        ...socket.userData
      });
    }
  }
  
  res.status(200).json(onlineUsers);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Register user data with socket
  socket.on('register_user', (userData) => {
    console.log(`User registered: ${userData.username}`);
    socket.userData = userData;
    
    // Notify others that a user has come online
    socket.broadcast.emit('user_online', {
      socketId: socket.id,
      ...userData
    });
  });
  
  // Join a chat room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    
    // Get previous messages for the room
    Message.find({ roomId })
      .sort({ createdAt: 1 })
      .limit(50)
      .then(messages => {
        socket.emit('previous_messages', messages);
      })
      .catch(err => {
        console.error('Error retrieving messages:', err);
      });
  });
  
  // Handle new message
  socket.on('send_message', async (messageData) => {
    try {
      const { roomId, text, sender, senderUsername } = messageData;
      
      // Save message to database
      const newMessage = new Message({
        roomId,
        text,
        sender,  // This would be the user ID or unique identifier
        senderUsername,
        createdAt: new Date()
      });
      
      await newMessage.save();
      
      // Broadcast message to the room
      io.to(roomId).emit('receive_message', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
  
  // Handle user typing
  socket.on('typing', (data) => {
    const { roomId, username } = data;
    socket.to(roomId).emit('user_typing', { username });
  });
  
  // Handle user stop typing
  socket.on('stop_typing', (data) => {
    const { roomId } = data;
    socket.to(roomId).emit('user_stop_typing');
  });

  // Add direct messaging functionality
  socket.on('direct_message', async (data) => {
    const { recipientId, text, sender, senderUsername } = data;
    
    try {
      // Create a unique room ID for private conversations
      const roomId = [sender, recipientId].sort().join('-');
      
      // Save private message to database
      const newMessage = new Message({
        roomId,
        text,
        sender,
        senderUsername,
        isPrivate: true,
        createdAt: new Date()
      });
      
      await newMessage.save();
      
      // Send to recipient
      io.to(recipientId).emit('private_message', newMessage);
      
      // Send to sender as confirmation
      socket.emit('private_message', newMessage);
    } catch (err) {
      console.error('Error sending private message:', err);
    }
  });
  
  // Handle user disconnection
  socket.on('disconnect', () => {
    if (socket.userData) {
      io.emit('user_offline', {
        socketId: socket.id,
        ...socket.userData
      });
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Basic API routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is healthy' });
});

// Get all messages for a room
app.get('/api/messages/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});