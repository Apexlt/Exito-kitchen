import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ❌ No token → go login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let payload;

  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // 🔥 ONLY block if trying to access admin
  if (
    location.pathname.startsWith("/admin") &&
    payload.role !== "admin"
  ) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default ProtectedRoute;