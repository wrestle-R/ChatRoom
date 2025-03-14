import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import { nanoid } from 'nanoid';

function CreateRoom({ joinMode = false }) {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState(joinMode ? "" : nanoid(6));
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (joinMode) {
      // For joining, just navigate to the room with the provided code
      navigate(`/private-chat/${roomCode}`);
    } else {
      // For creating, in a full implementation you would:
      // 1. Save the room to your database
      // 2. Then navigate to it
      
      // For now, we'll just navigate to the room
      navigate(`/private-chat/${roomCode}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          {joinMode ? "Join Private Room" : "Create Private Room"}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!joinMode && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Room Name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter a name for your room"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Room Code
              {!joinMode && " (automatically generated)"}
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => joinMode ? setRoomCode(e.target.value) : null}
              placeholder={joinMode ? "Enter room code" : ""}
              className={`w-full p-3 border border-gray-300 rounded-lg ${
                !joinMode ? "bg-gray-50" : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              }`}
              required
              readOnly={!joinMode}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Room Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={joinMode ? "Enter room password" : "Create a password"}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {joinMode ? "Join Room" : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;