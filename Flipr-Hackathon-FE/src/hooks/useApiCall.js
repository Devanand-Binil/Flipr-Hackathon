// src/hooks/useApiCall.js
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const useApiCall = () => {
  const { getToken } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const callProtectedRoute = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/example2/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Success: ${JSON.stringify(data)}`);
        console.log(data);
      } else {
        setMessage(`❌ Error [Server]: ${data.error}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`❌ Error[Client]: ${error.message}`);
      } else {
        setMessage("❌ An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { message, loading, callProtectedRoute };
};

export default useApiCall;
