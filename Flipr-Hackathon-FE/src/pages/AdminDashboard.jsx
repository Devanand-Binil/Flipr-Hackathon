// src/pages/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow-md text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">👑 Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome, Admin. You have full access to this panel.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">📊 Site Stats</h2>
          <p className="text-xl text-gray-700">Users: <span className="font-bold">124</span></p>
          <p className="text-xl text-gray-700">Reports: <span className="font-bold">12</span></p>
          <p className="text-xl text-gray-700">Active Sessions: <span className="font-bold">8</span></p>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleBackToHome}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-all duration-300"
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
