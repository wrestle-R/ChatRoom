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
      <div className="flex flex-col h-full bg-gray-50 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Start a Direct Message</h2>
          <p className="text-gray-600 mb-6">Search for a user to start a conversation</p>
          
          <UserSearch 
            onSelectUser={(user) => {
              setSelectedUser(user);
            }} 
          />
          
          {selectedUser && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => window.location.href = `/direct-message/${selectedUser.userId}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Message {selectedUser.username || selectedUser.firstName}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!selectedUser) {
    return <div className="flex items-center justify-center h-full">Loading user...</div>;
  }

  return <ChatRoom roomType="direct" selectedUser={selectedUser} />;
}

export default DirectMessage;
