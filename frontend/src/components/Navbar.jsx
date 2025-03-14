import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";

function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Chat Room</h1>
      <div className="flex items-center space-x-4">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <div className="flex space-x-2">
            <SignInButton mode="modal">
              <button className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;