import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { io } from 'socket.io-client';
import SocketContext from './context/SocketContext';
import { useSelector } from 'react-redux';

const socket = io(import.meta.env.VITE_API_ENDPOINT.split('/api/v1')[0]);

function App() {
  const { user } = useSelector((state) => state.user);
  const token = user ? user.token : "";

  useEffect(() => {
    // Load Elfsight Website Translator
    const elfsightScript = document.createElement("script");
    elfsightScript.src = "https://static.elfsight.com/platform/platform.js";
    elfsightScript.async = true;
    document.body.appendChild(elfsightScript);

    const elfsightDiv = document.createElement("div");
    elfsightDiv.className = "elfsight-app-05786466-288c-4330-b208-c5e1a302dcc4";
    elfsightDiv.setAttribute("data-elfsight-app-lazy", "");
    document.body.appendChild(elfsightDiv);

    // Load Jotform Chatbot Agent
    const jotformScript = document.createElement("script");
    jotformScript.src = "https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js";
    jotformScript.async = true;
    document.body.appendChild(jotformScript);

    jotformScript.onload = () => {
      if (window.AgentInitializer) {
        window.AgentInitializer.init({
          rootId: "JotformAgent-01970b45a5c474a3b35ac09c9399567d1502",
          formID: "01970b45a5c474a3b35ac09c9399567d1502",
          queryParams: ["skipWelcome=1", "maximizable=1"],
          domain: "https://www.jotform.com",
          isInitialOpen: false,
          isDraggable: false,
          background: "linear-gradient(180deg, #0E408A 0%, #0E408A 100%)",
          buttonBackgroundColor: "#051258",
          buttonIconColor: "#FFFFFF",
          variant: false,
          customizations: {
            greeting: "Yes",
            greetingMessage: "Hi! How can I assist you?",
            pulse: "Yes",
            position: "left"
          }
        });
      }
    };
  }, []);

  return (
    <div className='dark'>
      <SocketContext.Provider value={socket}>
        <Router>
          <Routes>
            <Route exact path="/" element={token ? <Home socket={socket} /> : <Navigate to="/login" />} />
            <Route exact path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
            <Route exact path="/register" element={<Register />} />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
