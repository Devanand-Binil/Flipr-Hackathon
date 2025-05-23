// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";

import App from "./App";
import "./index.css";

import env from "./lib/env";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Failed to find root element");
}

createRoot(root).render(
  <StrictMode>
  <ClerkProvider publishableKey={env.CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
  <App />
  </ClerkProvider>
  </StrictMode>
);
