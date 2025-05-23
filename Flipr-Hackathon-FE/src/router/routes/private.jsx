// src/router/routes/private.jsx
import AuthTest from "../../pages/AuthTest";
import ProtectedRoute from "../guards/ProtectedRoute";

const privateRoutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AuthTest />
      </ProtectedRoute>
    ),
  },
];

export default privateRoutes;
