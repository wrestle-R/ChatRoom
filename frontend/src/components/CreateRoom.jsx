import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import { nanoid } from 'nanoid';
import { FlickeringGrid } from "../ui/flickering-grid";
import TextHighlight from "../ui/TextHighlight";

function CreateRoom({ joinMode = false }) {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState(joinMode ? "" : nanoid(6));
  const [roomName, setRoomName] = useState("");
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
    
    if (!roomCode.trim()) {
      setError("Room code is required");
      return;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    
    if (!joinMode && !roomName.trim()) {
      setError("Room name is required");
      return;
    }
    
    if (joinMode) {
      navigate(`/private-chat/${roomCode}`);
    } else {
      navigate(`/private-chat/${roomCode}`);
    }
  };

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
                {joinMode ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                )}
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">
              {joinMode ? "Join Private Room" : "Create Private Room"}
            </h2>
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
          
          <form onSubmit={handleSubmit}>
            {!joinMode && (
              <div className="mb-5">
                <label className="block text-gray-300 text-sm font-medium mb-2">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter a name for your room"
                  className="w-full p-3 bg-gray-800/60 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                />
              </div>
            )}
            
            <div className="mb-5">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Room Code
                {!joinMode && <span className="text-indigo-400 ml-1">(automatically generated)</span>}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => joinMode ? setRoomCode(e.target.value) : null}
                  placeholder={joinMode ? "Enter room code" : ""}
                  className={`w-full p-3 rounded-lg ${
                    !joinMode 
                      ? "bg-gray-800/40 border border-gray-700 text-indigo-400 font-mono" 
                      : "bg-gray-800/60 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  } placeholder-gray-500`}
                  required
                  readOnly={!joinMode}
                />
                {!joinMode && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <button
                      type="button"
                      onClick={() => setRoomCode(nanoid(6))}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
                    >
                      Generate New
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Room Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={joinMode ? "Enter room password" : "Create a password"}
                className="w-full p-3 bg-gray-800/60 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-all shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
            >
              <span>{joinMode ? "Join Room" : "Create Room"}</span>
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

export default CreateRoom;