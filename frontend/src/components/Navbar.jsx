import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { isSignedIn } = useUser();
  const location = useLocation();
  
  // Helper function to determine if a path is active
  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-700" : "";
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat Room
            </Link>
            
            {isSignedIn && (
              <div className="hidden md:flex space-x-1">
                <Link 
                  to="/public-chat" 
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/public-chat')}`}
                >
                  Public Chat
                </Link>
                <Link 
                  to="/create-room" 
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/create-room')}`}
                >
                  Create Room
                </Link>
                <Link 
                  to="/join-room" 
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/join-room')}`}
                >
                  Join Room
                </Link>
                <Link 
                  to="/direct-message/search" 
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/direct-message/search')}`}
                >
                  Direct Messages
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex space-x-2">
                <SignInButton mode="modal">
                  <button className="bg-white text-blue-600 px-4 py-1.5 rounded hover:bg-gray-100 text-sm font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-blue-700 text-white px-4 py-1.5 rounded hover:bg-blue-800 text-sm font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile navigation for signed in users */}
        {isSignedIn && (
          <div className="md:hidden pb-3 flex overflow-x-auto space-x-1">
            <Link 
              to="/public-chat" 
              className={`px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 flex-shrink-0 ${isActive('/public-chat')}`}
            >
              Public Chat
            </Link>
            <Link 
              to="/create-room" 
              className={`px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 flex-shrink-0 ${isActive('/create-room')}`}
            >
              Create Room
            </Link>
            <Link 
              to="/join-room" 
              className={`px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 flex-shrink-0 ${isActive('/join-room')}`}
            >
              Join Room
            </Link>
            <Link 
              to="/direct-message/search" 
              className={`px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 flex-shrink-0 ${isActive('/direct-message/search')}`}
            >
              Direct Messages
            </Link>
            
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;  