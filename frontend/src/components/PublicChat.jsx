import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import ChatRoom from "./ChatRoom";

function PublicChat() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <ChatRoom roomType="public" />;
}

export default PublicChat;
