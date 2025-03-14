import { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/clerk-react";
import io from 'socket.io-client';
import UserSearch from './UserSearch';

// Socket.io connection
const socket = io('http://localhost:3000'); // Your backend URL
const DEFAULT_ROOM = "general"; // Default chat room

function ChatRoom() {
  // Add this new state variable
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [currentRoom, setCurrentRoom] = useState(DEFAULT_ROOM);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useUser();
  
  // Connect to socket and join default room on component mount
  useEffect(() => {
    if (!user) return;
    
    // Register user with socket server
    socket.emit('register_user', {
      userId: user.id,
      username: user.username || `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.primaryEmailAddress?.emailAddress
    });
    
    // Join the default room
    socket.emit('join_room', DEFAULT_ROOM);
    
    // Listen for messages
    socket.on('receive_message', (newMessage) => {
      if (newMessage.roomId === currentRoom) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    
    // Listen for private messages
    socket.on('private_message', (newMessage) => {
      if (newMessage.roomId.includes(user.id)) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    
    // Load previous messages
    socket.on('previous_messages', (previousMessages) => {
      setMessages(previousMessages);
    });
    
    // Handle typing indicators
    socket.on('user_typing', (data) => {
      setIsTyping(true);
      setTypingUser(data.username);
    });
    
    socket.on('user_stop_typing', () => {
      setIsTyping(false);
      setTypingUser('');
    });
    
    // Track online users
    socket.on('user_online', (userData) => {
      setOnlineUsers(prev => [...prev.filter(u => u.userId !== userData.userId), userData]);
    });
    
    socket.on('user_offline', (userData) => {
      setOnlineUsers(prev => prev.filter(u => u.socketId !== userData.socketId));
    });
    
    // Add event handler for online users count
    socket.on('online_users_count', (count) => {
      setOnlineUsersCount(count);
    });
    
    // Save user to backend database
    const saveUserToDb = async () => {
      try {
        await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            username: user.username || `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.primaryEmailAddress?.emailAddress
          })
        });
      } catch (error) {
        console.error('Failed to register user:', error);
      }
    };
    
    // Get online users
    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/online');
        if (response.ok) {
          const data = await response.json();
          setOnlineUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch online users:', error);
      }
    };
    
    saveUserToDb();
    fetchOnlineUsers();
    
    // Cleanup on unmount
    return () => {
      socket.off('receive_message');
      socket.off('private_message');
      socket.off('previous_messages');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('user_online');
      socket.off('user_offline');
      socket.off('online_users_count');
    };
  }, [user, currentRoom]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // When changing rooms, load that room's messages
  useEffect(() => {
    if (selectedUser) {
      // For private chats, create a unique room ID
      const privateRoomId = [user.id, selectedUser.userId].sort().join('-');
      setCurrentRoom(privateRoomId);
      
      // Get previous messages for this private chat
      fetch(`http://localhost:3000/api/messages/${privateRoomId}`)
        .then(response => response.json())
        .then(data => {
          setMessages(data);
        })
        .catch(error => console.error('Error fetching messages:', error));
    } else {
      setCurrentRoom(DEFAULT_ROOM);
      socket.emit('join_room', DEFAULT_ROOM);
    }
  }, [selectedUser, user]);
  
  // Handle typing indicator
  const handleTyping = () => {
    socket.emit('typing', {
      roomId: currentRoom,
      username: user.username || user.firstName
    });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', {
        roomId: currentRoom
      });
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const isPrivateMessage = selectedUser !== null;
      
      if (isPrivateMessage) {
        // Send direct message
        const messageData = {
          recipientId: selectedUser.userId,
          text: message,
          sender: user.id,
          senderUsername: user.username || user.firstName
        };
        
        socket.emit('direct_message', messageData);
      } else {
        // Send public message
        const messageData = {
          roomId: currentRoom,
          text: message,
          sender: user.id,
          senderUsername: user.username || user.firstName
        };
        
        socket.emit('send_message', messageData);
      }
      
      // Clear typing indicator
      socket.emit('stop_typing', { roomId: currentRoom });
      
      // Reset input field
      setMessage('');
    }
  };
  
  const handleUserSelect = (selectedUserData) => {
    setSelectedUser(selectedUserData);
    setShowUserSearch(false);
  };
  
  const backToPublicChat = () => {
    setSelectedUser(null);
    setCurrentRoom(DEFAULT_ROOM);
  };

  // Add a function to toggle the online users sidebar
  const toggleOnlineUsersList = () => {
    // Close user search if it's open
    if (showUserSearch) setShowUserSearch(false);
    // Toggle online users list
    setShowOnlineUsers(!showOnlineUsers);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center">
          {selectedUser ? (
            <>
              <button 
                onClick={backToPublicChat}
                className="mr-3 text-gray-600 hover:text-blue-600"
              >
                ← Back
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {(selectedUser.username || selectedUser.firstName || '').charAt(0).toUpperCase()}
                </div>
                <span className="ml-2 font-medium">
                  {selectedUser.username || `${selectedUser.firstName} ${selectedUser.lastName || ''}`}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center">
              <h3 className="font-medium">Public Chat Room</h3>
              {/* Add online users count badge */}
              <div className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                {onlineUsersCount} online
              </div>
            </div>
          )}
        </div>
        
        {!selectedUser && (
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setShowUserSearch(!showUserSearch);
                if (showOnlineUsers) setShowOnlineUsers(false);
              }}
              className={`px-3 py-1 text-sm rounded ${
                showUserSearch 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {showUserSearch ? 'Hide' : 'Search Users'}
            </button>
            
            {/* Add button to view online users list */}
            <button 
              onClick={toggleOnlineUsersList}
              className={`px-3 py-1 text-sm rounded ${
                showOnlineUsers 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              {showOnlineUsers ? 'Hide Online' : 'View Online'}
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <div className={`flex flex-col ${showOnlineUsers ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          {/* User search panel */}
          {showUserSearch && !selectedUser && (
            <UserSearch onSelectUser={handleUserSelect} />
          )}
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === user.id ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'}`}>
                  {msg.sender !== user.id && <p className="text-xs font-bold mb-1">{msg.senderUsername}</p>}
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-75 block text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
                <span className="ml-2">{typingUser} is typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-300 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleTyping}
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Message ${selectedUser ? selectedUser.username || selectedUser.firstName : 'everyone'}...`}
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
        
        {/* Online users sidebar */}
        {showOnlineUsers && (
          <div className="w-1/3 border-l border-gray-200 bg-white overflow-y-auto transition-all duration-300">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-700">Online Users</h3>
            </div>
            
            <div className="p-2">
              {onlineUsers.length > 0 ? (
                <ul className="space-y-1">
                  {onlineUsers.map((onlineUser) => (
                    <li 
                      key={onlineUser.socketId || onlineUser.userId}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => {
                        if (onlineUser.userId !== user.id) {
                          handleUserSelect(onlineUser);
                          setShowOnlineUsers(false);
                        }
                      }}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {(onlineUser.username || onlineUser.firstName || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                      </div>
                      <div className="ml-2 flex-1">
                        <div className="font-medium">
                          {onlineUser.username || `${onlineUser.firstName} ${onlineUser.lastName || ''}`}
                          {onlineUser.userId === user.id && <span className="text-xs text-gray-500 ml-1">(you)</span>}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{onlineUser.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <p>No users online</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;