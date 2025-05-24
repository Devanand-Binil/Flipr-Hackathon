import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import SocketContext from "../context/SocketContext"; // ✅ Uncommented

function Home() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [socketStatus, setSocketStatus] = useState("Checking...");

  const socket = useContext(SocketContext); // ✅ Use the socket context

  useEffect(() => {
    // Backend check
    fetch(import.meta.env.VITE_API_ENDPOINT.replace("/v1", "/health"))
      .then((res) => {
        if (res.ok) setBackendStatus("🟢 Backend is live");
        else setBackendStatus("🔴 Backend error");
      })
      .catch(() => setBackendStatus("🔴 Backend unreachable"));

    // Socket check — update when connected/disconnected
    const checkSocket = () => {
      if (socket?.connected) {
        setSocketStatus("🟢 Socket connected");
      } else {
        setSocketStatus("🔴 Socket not connected");
      }
    };

    checkSocket(); // Initial check

    // Listen to socket events
    socket?.on("connect", checkSocket);
    socket?.on("disconnect", checkSocket);

    // Cleanup listeners
    return () => {
      socket?.off("connect", checkSocket);
      socket?.off("disconnect", checkSocket);
    };
  }, [socket]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🧪 System Status</h1>
      <p><strong>Backend:</strong> {backendStatus}</p>
      <p><strong>Socket:</strong> {socketStatus}</p>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/login" style={{ marginRight: "1rem" }}>🔐 Go to Login</Link>
        <Link to="/register">📝 Go to Register</Link>
      </div>
    </div>
  );
}

export default Home;
