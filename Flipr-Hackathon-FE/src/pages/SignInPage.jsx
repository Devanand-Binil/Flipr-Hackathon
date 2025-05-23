// src/pages/SignInPage.jsx
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🔐 Sign In</h2>
      <SignIn />
    </div>
  );
}
