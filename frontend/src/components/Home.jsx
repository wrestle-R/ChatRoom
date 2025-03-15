import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FlickeringGrid } from "../ui/flickering-grid";
import TextHighlight from "../ui/TextHighlight";

function Home() {
  const { isSignedIn, user } = useUser();
  const [showContent, setShowContent] = useState(false);
  
  // Fade in content after background loads
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="relative min-h-screen bg-gray-950">
      {/* Background layer with flickering grid */}
      <div className="absolute inset-0 z-0">
      <FlickeringGrid 
        squareSize={8}
        gridGap={7}
        flickerChance={0.02}
        color="rgb(124, 58, 237)"  // Indigo-600
        maxOpacity={0.4}
        className="h-full w-full"
      />
      </div>
      
      {/* Content */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen p-6 transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Chat Room
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto">
            Connect with friends and colleagues in <TextHighlight>real-time</TextHighlight>
          </p>
        </div>
        
        {isSignedIn ? (
          <>
            <div className="text-center mb-8">
              <p className="font-medium text-gray-200 mb-2">
                Welcome, <TextHighlight>{user?.firstName || 'User'}</TextHighlight>!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              {/* Public Chat Card */}
              <Link 
                to="/public-chat" 
                className="group bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-800 hover:border-indigo-500/30 flex flex-col h-60"
              >
                <div className="p-5 flex items-center border-b border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-white ml-3">Public Chat</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-gray-400 text-sm">Join the main chat room to connect with all online users.</p>
                  <div className="flex justify-end">
                    <div className="text-indigo-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                      Enter Room
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Create Private Room Card */}
              <Link 
                to="/create-room" 
                className="group bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-800 hover:border-indigo-500/30 flex flex-col h-60"
              >
                <div className="p-5 flex items-center border-b border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-white ml-3">Create Private Room</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-gray-400 text-sm">Set up your own private chat room with a custom code and password.</p>
                  <div className="flex justify-end">
                    <div className="text-indigo-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                      Create Room
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Join Private Room Card */}
              <Link 
                to="/join-room" 
                className="group bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-800 hover:border-indigo-500/30 flex flex-col h-60"
              >
                <div className="p-5 flex items-center border-b border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-white ml-3">Join Private Room</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-gray-400 text-sm">Enter a room code and password to join an existing private chat room.</p>
                  <div className="flex justify-end">
                    <div className="text-indigo-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                      Join Room
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Direct Message Card */}
              <Link 
                to="/direct-message/search" 
                className="group bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-800 hover:border-indigo-500/30 flex flex-col h-60"
              >
                <div className="p-5 flex items-center border-b border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-white ml-3">Direct Message</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-gray-400 text-sm">Find a specific user and start a private one-on-one conversation.</p>
                  <div className="flex justify-end">
                    <div className="text-indigo-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                      Find User
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-8 text-center max-w-md w-full mx-auto border border-gray-800 hover:border-indigo-500/30 transition-all">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Sign in to <TextHighlight>get started</TextHighlight></h2>
            <p className="text-gray-400 mb-6">Please sign in to access chat rooms and connect with others</p>
            <button 
              onClick={() => window.location.href = "/"} 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Sign In 
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;