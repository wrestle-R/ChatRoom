import { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/clerk-react";
import io from 'socket.io-client';
import UserSearch from './UserSearch';

// Socket.io connection
const socket = io('http://localhost:3000');

function ChatRoom({ roomType, roomCode, roomPassword, selectedUser, onBack }) {
  // State for UI components
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  
  // State for messages and chat
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('');
  
  // State for user interactions
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [directMessageUser, setDirectMessageUser] = useState(selectedUser);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  
  // Refs
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useUser();
  
  // Format date function
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };
  
  // Group messages by date
  const messagesByDate = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt);
    const dateString = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(message);
    return groups;
  }, {});
  
  // Get room ID based on room type
  useEffect(() => {
    if (!user) return;
    
    let roomId;
    
    switch(roomType) {
      case 'public':
        roomId = 'general';
        break;
      case 'private':
        roomId = roomCode;
        break;
      case 'direct':
        if (directMessageUser) {
          roomId = [user.id, directMessageUser.userId].sort().join('-');
        }
        break;
      default:
        roomId = 'general';
    }
    
    setCurrentRoom(roomId);
    
    // Register user with socket server
    socket.emit('register_user', {
      userId: user.id,
      username: user.username || `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.primaryEmailAddress?.emailAddress
    });
    
    // Join the room
    if (roomId) {
      socket.emit('join_room', roomId);
      
      // Load previous messages
      fetch(`http://localhost:3000/api/messages/${roomId}`)
        .then(response => response.json())
        .then(data => {
          setMessages(data);
        })
        .catch(error => console.error('Error fetching messages:', error));
    }
  }, [roomType, roomCode, directMessageUser, user]);
  
  // Socket event listeners
  useEffect(() => {
    if (!user || !currentRoom) return;
    
    // Listen for messages
    socket.on('receive_message', (newMessage) => {
      if (newMessage.roomId === currentRoom) {
        setMessages(prev => [...prev, newMessage]);
      }
    });
    
    // Listen for private messages
    socket.on('private_message', (newMessage) => {
      if (newMessage.roomId.includes(user.id)) {
        setMessages(prev => [...prev, newMessage]);
      }
    });
    
    // Listen for typing indicators
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
    
    // Get online users count
    socket.on('online_users_count', (count) => {
      setOnlineUsersCount(count);
    });
    
    // Cleanup on unmount
    return () => {
      socket.off('receive_message');
      socket.off('private_message');
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

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const isPrivateMessage = roomType === 'direct';
      
      if (isPrivateMessage && directMessageUser) {
        // Send direct message
        const messageData = {
          recipientId: directMessageUser.userId,
          text: message,
          sender: user.id,
          senderUsername: user.username || user.firstName
        };
        
        socket.emit('direct_message', messageData);
      } else {
        // Send room message
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
  
  // Handle user selection for direct messages
  const handleUserSelect = (selectedUserData) => {
    setDirectMessageUser(selectedUserData);
    setShowUserSearch(false);
  };

  // Toggle online users sidebar
  const toggleOnlineUsersList = () => {
    if (showUserSearch) setShowUserSearch(false);
    setShowOnlineUsers(!showOnlineUsers);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="font-medium text-lg text-gray-800">
            {roomType === 'public' && 'Public Chat Room'}
            {roomType === 'private' && `Private Room: ${roomCode}`}
            {roomType === 'direct' && directMessageUser && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                  {(directMessageUser.username || directMessageUser.firstName || '').charAt(0).toUpperCase()}
                </div>
                <span>
                  {directMessageUser.username || `${directMessageUser.firstName} ${directMessageUser.lastName || ''}`}
                </span>
              </div>
            )}
          </h2>
          {(roomType === 'public' || roomType === 'private') && (
            <div className="ml-3 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              {onlineUsersCount} online
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {(roomType === 'public' || roomType === 'private') && (
            <>
              <button 
                onClick={() => {
                  setShowUserSearch(!showUserSearch);
                  if (showOnlineUsers) setShowOnlineUsers(false);
                }}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  showUserSearch 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {showUserSearch ? 'Hide Search' : 'Search Users'}
              </button>
              
              <button 
                onClick={toggleOnlineUsersList}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  showOnlineUsers 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {showOnlineUsers ? 'Hide Online' : 'View Online'}
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <div className={`flex flex-col ${showOnlineUsers ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          {/* User search panel */}
          {showUserSearch && !directMessageUser && (
            <div className="border-b border-gray-200 bg-white">
              <UserSearch onSelectUser={handleUserSelect} />
            </div>
          )}
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto py-4 px-4 md:px-6">
            {/* Display messages grouped by date */}
            {Object.keys(messagesByDate).length > 0 ? (
              Object.keys(messagesByDate).sort().map(date => (
                <div key={date} className="mb-6">
                  {/* Date separator */}
                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <div className="mx-4 px-3 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-600">
                      {formatDate(date)}
                    </div>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  
                  {/* Messages for this date */}
                  <div className="space-y-3">
                    {messagesByDate[date].map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === user?.id ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender !== user?.id && (
                          <div className="flex-shrink-0 mr-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                              {(msg.senderUsername || '?').charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}
                        
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-t-lg ${
                          msg.sender === user?.id 
                            ? 'bg-blue-600 text-white rounded-bl-lg rounded-br-none' 
                            : 'bg-white border border-gray-200 rounded-br-lg rounded-bl-none shadow-sm'
                        }`}>
                          {msg.sender !== user?.id && (
                            <div className="px-4 pt-2 pb-0">
                              <p className="font-medium text-sm">
                                {msg.senderUsername}
                              </p>
                            </div>
                          )}
                          <div className="p-4 pt-2">
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            <span className="text-xs opacity-75 block text-right mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p className="font-medium">No messages yet</p>
                <p className="text-sm mt-1">Start the conversation!</p>
              </div>
            )}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center text-sm text-gray-500 mt-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
                <span className="ml-2">{typingUser} is typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSubmit} className="px-4 py-3 bg-white border-t border-gray-200 shadow-inner">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleTyping}
                className="flex-1 px-4 py-3 bg-white focus:outline-none"
                placeholder={`Type your message...`}
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <span className="mr-1">Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        
        {/* Online users sidebar */}
        {showOnlineUsers && (
          <div className="w-1/3 border-l border-gray-200 bg-white overflow-y-auto transition-all duration-300">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-700 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                Online Users ({onlineUsers.length})
              </h3>
            </div>
            
            <div className="p-2">
              {onlineUsers.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {onlineUsers.map((onlineUser) => (
                    <li 
                      key={onlineUser.socketId || onlineUser.userId}
                      className="flex items-center p-3 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                      onClick={() => {
                        if (onlineUser.userId !== user?.id) {
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
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-800">
                          {onlineUser.username || `${onlineUser.firstName} ${onlineUser.lastName || ''}`}
                          {onlineUser.userId === user?.id && <span className="text-xs text-gray-500 ml-1">(you)</span>}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{onlineUser.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
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