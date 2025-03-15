import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import UserSearch from "./UserSearch";

function DirectMessage() {
  const { isSignedIn } = useUser();
  const { userId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);

  // If userId is "search", show user search interface
  const isSearchMode = userId === "search";

  // If we have a specific userId, fetch that user's info
  useEffect(() => {
    if (userId && userId !== "search") {
      // Fetch user data from your API
      fetch(`http://localhost:3000/api/users?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setSelectedUser(data[0]);
          }
        })
        .catch(err => console.error("Error fetching user:", err));
    }
  }, [userId]);

//   if (!isSignedIn) {
//     return <Navigate to="/" replace />;
//   }

  if (isSearchMode) {
    return (
      <div className="flex flex-col h-full bg-gray-950 p-4 pt-44">
        <div className="bg-gray-900/80 backdrop-blur-sm shadow-lg rounded-lg p-6 max-w-2xl mx-auto w-full border border-gray-800 hover:border-purple-500/40 transition-all">
          <h2 className="text-xl font-bold mb-6 text-gray-100">Start a Direct Message</h2>
          <p className="text-gray-100 mb-6">Search for a user to start a conversation</p>
          
          <UserSearch 
            onSelectUser={(user) => {
              setSelectedUser(user);
            }} 
          />
          
          {selectedUser && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => window.location.href = `/direct-message/${selectedUser.userId}`}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2 font-medium"
              >
                <span>Message {selectedUser.username || selectedUser.firstName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-950">
        <div className="flex flex-col items-center text-gray-300">
          <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading user...</p>
        </div>
      </div>
    );
  }

  return <ChatRoom roomType="direct" selectedUser={selectedUser} />;
}

export default DirectMessage;