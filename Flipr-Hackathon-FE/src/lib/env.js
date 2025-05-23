// src/lib/env.js
const env = {
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
};

if (!env.CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key.");
}

export default env;
