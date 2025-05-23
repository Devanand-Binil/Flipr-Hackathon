// src/pages/Home.jsx
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">🏠 Welcome to MyApp</h1>
        <p className="text-lg text-gray-700">
          This is a public home page. Use the navigation bar to sign in and access protected routes.
        </p>
      </main>

      <Footer />
    </div>
  );
}
