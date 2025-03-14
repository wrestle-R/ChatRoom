import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Home() {
  const { isSignedIn, user } = useUser();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat Room</h1>
      <p className="text-gray-600 mb-8">Connect with friends and colleagues</p>
      
      {isSignedIn ? (
        <>
          <p className="font-medium text-gray-700 mb-6">Welcome, {user?.firstName || 'User'}! Choose an option:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {/* Public Chat Card */}
            <Link 
              to="/public-chat" 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-64"
            >
              <div className="bg-blue-600 p-4 flex items-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-white ml-4">Public Chat</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-gray-600">Join the main chat room to connect with all online users.</p>
                <div className="mt-4 flex justify-end">
                  <div className="text-blue-600 font-medium flex items-center">
                    Enter Room
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Create Private Room Card */}
            <Link 
              to="/create-room" 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-64"
            >
              <div className="bg-green-600 p-4 flex items-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-white ml-4">Create Private Room</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-gray-600">Set up your own private chat room with a custom code and password.</p>
                <div className="mt-4 flex justify-end">
                  <div className="text-green-600 font-medium flex items-center">
                    Create Room
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Join Private Room Card */}
            <Link 
              to="/join-room" 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-64"
            >
              <div className="bg-purple-600 p-4 flex items-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-white ml-4">Join Private Room</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-gray-600">Enter a room code and password to join an existing private chat room.</p>
                <div className="mt-4 flex justify-end">
                  <div className="text-purple-600 font-medium flex items-center">
                    Join Room
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Direct Message Card */}
            <Link 
              to="/direct-message/search" 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-64"
            >
              <div className="bg-pink-600 p-4 flex items-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-white ml-4">Direct Message</h3>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-gray-600">Find a specific user and start a private one-on-one conversation.</p>
                <div className="mt-4 flex justify-end">
                  <div className="text-pink-600 font-medium flex items-center">
                    Find User
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Sign in to get started</h2>
          <p className="text-gray-600 mb-6">Please sign in to access chat rooms and connect with others</p>
          <button 
            onClick={() => window.location.href = "/"} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Sign In 
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;