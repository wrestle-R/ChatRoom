import { useUser } from "@clerk/clerk-react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FlickeringGrid } from "../ui/flickering-grid";
import ChatRoom from "./ChatRoom";
import TextHighlight from "../ui/TextHighlight";

function PrivateChat() {
  const { isSignedIn } = useUser();
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [hasJoined, setHasJoined] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    
    // In a real app, you would validate the password with your backend
    // For now, we'll simply allow access with any password
    setHasJoined(true);
  };

  if (!hasJoined) {
    return (
      <div className="relative min-h-screen bg-gray-950 flex items-center justify-center">
        {/* Background layer with flickering grid */}
        <div className="absolute inset-0 z-0">
          <FlickeringGrid 
            squareSize={4}
            gridGap={8}
            flickerChance={0.01}
            color="rgb(99, 102, 241)"
            maxOpacity={0.1}
            className="h-full w-full"
          />
        </div>
        
        <div className={`relative z-10 w-full max-w-md p-6 transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}>
          <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-800 hover:border-indigo-500/30 transition-all p-6 w-full">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Access Private Room</h2>
            </div>
            
            {error && (
              <div className="mb-5 p-3 bg-red-900/50 border border-red-800 text-red-200 rounded-lg text-sm backdrop-blur-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-4">
                You're trying to access a private room. Enter the password to continue:
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-300 text-sm font-medium mb-2">Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  disabled
                  className="w-full p-3 bg-gray-800/40 border border-gray-700 text-indigo-400 font-mono rounded-lg"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Room Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter room password"
                  className="w-full p-3 bg-gray-800/60 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-all shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
              >
                <span>Join Room</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            
            <div className="mt-5 text-center">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ChatRoom roomType="private" roomCode={roomCode} roomPassword={password} />;
}

export default PrivateChat;