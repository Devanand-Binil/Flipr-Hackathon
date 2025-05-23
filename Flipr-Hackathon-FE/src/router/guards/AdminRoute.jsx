// src/router/guards/AdminRoute.jsx
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [accessDenied, setAccessDenied] = useState(false);
  const [countdown, setCountdown] = useState(5); // Initial countdown value
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && (!isSignedIn || user?.unsafeMetadata?.role !== "admin")) {
      setAccessDenied(true);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/", { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Clear the interval on unmount
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-8 text-center text-red-600">
        <h2 className="text-2xl font-bold mb-4">🚫 Access Denied</h2>
        <p className="mb-4">You do not have the necessary privileges to access this page.</p>
        <p>Redirecting to home in {countdown} seconds...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
