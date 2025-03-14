import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

// Replace with your actual Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}
      tokenCache={{
        getToken: async () => {
          // This function would retrieve the token from your backend
          // and format it according to your token structure
          return {
            first_name: "{{user.first_name}}",
            last_name: "{{user.last_name}}",
            email: "{{user.emailId}}",
            username: "{{user.username}}"
          };
        }
      }}
    >
      <Router>
        <div className="flex flex-col h-screen bg-gray-100">
          <Navbar />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;