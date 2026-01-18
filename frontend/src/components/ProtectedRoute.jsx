import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required
  if (requireAdmin && user.role !== "ADMIN" && user.role !== "STAFF") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;