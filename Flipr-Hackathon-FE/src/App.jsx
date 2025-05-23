// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./router/mainRouter";

const App = () => {
  return (
    <BrowserRouter>
    {/* Wrap global providers or layout here if needed */}
    <MainRouter />
    </BrowserRouter>
  );
};

export default App;
