// src/router/routes/admin.jsx
import { lazy } from "react";
import AdminRoute from "../guards/AdminRoute";

const AdminDashboard = lazy(() => import("../../pages/AdminDashboard"));

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
];

export default adminRoutes;
