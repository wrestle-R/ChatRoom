import { useUser } from "@clerk/clerk-react";
import { Navigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatRoom from "./ChatRoom";

function PrivateChat() {
  const { isSignedIn } = useUser();
  const { roomCode } = useParams();
  const [hasJoined, setHasJoined] = useState(false);
  const [password, setPassword] = useState("");
  
  // For now, no password validation is implemented
  // You would need to create a Room model in your backend to handle this properly
  
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (!hasJoined) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Join Private Room</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            setHasJoined(true);
          }}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Room Code</label>
              <input
                type="text"
                value={roomCode}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Room Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter room password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <ChatRoom roomType="private" roomCode={roomCode} roomPassword={password} />;
}

export default PrivateChat;