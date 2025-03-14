import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import PublicChat from "./components/PublicChat";
import PrivateChat from "./components/PrivateChat";
import DirectMessage from "./components/DirectMessage";
import CreateRoom from "./components/CreateRoom";
import { ThemeProvider } from "../Context/ThemeContext";

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      tokenCache={{
        getToken: async () => {
          return {
            first_name: "{{user.first_name}}",
            last_name: "{{user.last_name}}",
            email: "{{user.emailId}}",
            username: "{{user.username}}"
          };
        }
      }}
    >
      <ThemeProvider>
        <Router>
          <div className="flex flex-col h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/public-chat" element={<PublicChat />} />
                <Route path="/private-chat/:roomCode" element={<PrivateChat />} />
                <Route path="/direct-message/:userId" element={<DirectMessage />} />
                <Route path="/create-room" element={<CreateRoom />} />
                <Route path="/join-room" element={<CreateRoom joinMode={true} />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;