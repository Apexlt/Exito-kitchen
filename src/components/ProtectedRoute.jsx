import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ❌ No token → go login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let payload = null;

  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    console.error("Invalid token:", err);
  }

  // ❌ Invalid token → go login
  if (!payload) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin → block access
  if (payload.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin → allow
  return children;
}

export default ProtectedRoute;