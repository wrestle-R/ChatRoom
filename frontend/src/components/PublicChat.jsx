import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatRoom from "./ChatRoom";

function PublicChat() {
  const { isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  // Add a small loading delay to allow the chat room component to initialize properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="flex flex-col items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
          <div className="text-indigo-300 mt-4 text-sm">Loading chat room...</div>
        </div>
      </div>
    );
  }

  return <ChatRoom roomType="public" />;
}

export default PublicChat;