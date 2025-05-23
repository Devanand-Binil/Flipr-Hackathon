// src/components/Navbar.jsx
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { RoleSetup } from "../../router/guards/RoleSetup";

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-blue-500 px-6 py-4 flex justify-between items-center shadow">
      <div className="text-lg font-bold">
        <Link to="/">🔗 MyApp</Link>
      </div>

      {/* Mobile Hamburger Icon */}
      <button
        className="lg:hidden text-blue-500"
        onClick={() => setMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation"
      >
        <span className={`block w-6 h-0.5 bg-current mb-1 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-current mb-1 ${isMenuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-current mb-1 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Desktop Navigation */}
      <div className={`lg:flex space-x-4 flex items-center ${isMenuOpen ? "block" : "hidden"} lg:block`}>
        <Link to="/" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300">Home</Link>
        <Link to="/admin" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300">Admin</Link>

        <SignedIn>
          <RoleSetup />
          <Link to="/dashboard" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300">Dashboard</Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
      </div>
    </nav>
  );
}
