// src/pages/AuthTest.jsx
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import useApiCall from "../hooks/useApiCall";
import Navbar from "../components/layout/Navbar";

export default function AuthTest() {
  const { message, loading, callProtectedRoute } = useApiCall();

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <SignedIn>
          <h2 className="text-xl font-bold mb-2">You are signed in!</h2>
          <button
            onClick={callProtectedRoute}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Call Protected Route"}
          </button>
          <p className="mt-4">{message}</p>
        </SignedIn>

        <SignedOut>
          <h2 className="text-xl font-bold mb-2">Please sign in to test</h2>
          <SignIn />
        </SignedOut>
      </div>
    </div>
  );
}
