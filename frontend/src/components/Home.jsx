import { useUser } from "@clerk/clerk-react";
import ChatRoom from "./ChatRoom";

function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex flex-col h-full items-center justify-center">
      {isSignedIn ? (
        <ChatRoom />
      ) : (
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Welcome to Chat Room</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to start chatting with other users.
          </p>
          <div className="border-t border-gray-300 pt-4">
            <p className="text-sm text-gray-500">
              This application uses Clerk for secure authentication.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;