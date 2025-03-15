import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Helper function to determine if a path is active
  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-white/10 border-white/20 text-white" 
      : "border-transparent text-gray-300 hover:text-white";
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-gray-900/90 backdrop-blur-lg shadow-lg" : "bg-gray-900/70 backdrop-blur-md"
    } border-b border-white/5`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold flex items-center group">
              <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-md flex items-center justify-center mr-3 border border-gray-700 group-hover:border-gray-500 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-white font-semibold">
                Chat Masala
              </span>
            </Link>
            
            {isSignedIn && (
              <div className="hidden md:flex space-x-1">
                <Link 
                  to="/public-chat" 
                  className={`px-3 py-2 rounded-md text-sm font-medium border transition-all duration-200 ${isActive('/public-chat')}`}
                >
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mr-2 transition-all"></span>
                    Public Chat
                  </span>
                </Link>
                <Link 
                  to="/create-room" 
                  className={`px-3 py-2 rounded-md text-sm font-medium border transition-all duration-200 ${isActive('/create-room')}`}
                >
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mr-2 transition-all"></span>
                    Create Room
                  </span>
                </Link>
                <Link 
                  to="/join-room" 
                  className={`px-3 py-2 rounded-md text-sm font-medium border transition-all duration-200 ${isActive('/join-room')}`}
                >
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mr-2 transition-all"></span>
                    Join Room
                  </span>
                </Link>
                <Link 
                  to="/direct-message/search" 
                  className={`px-3 py-2 rounded-md text-sm font-medium border transition-all duration-200 ${isActive('/direct-message/search')}`}
                >
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mr-2 transition-all"></span>
                    Direct Messages
                  </span>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "border border-white/20 hover:border-white/40 transition-all",
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex space-x-3">
                <SignInButton mode="modal">
                  <button className="bg-transparent hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white px-4 py-1.5 rounded-md transition-all duration-200 text-sm font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-white/10 hover:bg-white/15 text-white px-4 py-1.5 rounded-md transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium border border-white/10">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile navigation for signed in users */}
        {isSignedIn && (
          <div className="md:hidden pb-3 flex overflow-x-auto space-x-2">
            <Link 
              to="/public-chat" 
              className={`px-3 py-1.5 rounded-md text-sm font-medium border flex-shrink-0 transition-all duration-200 ${isActive('/public-chat')}`}
            >
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 mr-2"></span>
                Public Chat
              </span>
            </Link>
            <Link 
              to="/create-room" 
              className={`px-3 py-1.5 rounded-md text-sm font-medium border flex-shrink-0 transition-all duration-200 ${isActive('/create-room')}`}
            >
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 mr-2"></span>
                Create Room
              </span>
            </Link>
            <Link 
              to="/join-room" 
              className={`px-3 py-1.5 rounded-md text-sm font-medium border flex-shrink-0 transition-all duration-200 ${isActive('/join-room')}`}
            >
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 mr-2"></span>
                Join Room
              </span>
            </Link>
            <Link 
              to="/direct-message/search" 
              className={`px-3 py-1.5 rounded-md text-sm font-medium border flex-shrink-0 transition-all duration-200 ${isActive('/direct-message/search')}`}
            >
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 mr-2"></span>
                Messages
              </span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;