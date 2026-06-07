import { Navigate } from "react-router-dom";

function decodeToken(token) {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null; // not a valid JWT

    const base64 = parts[1];
    const payload = JSON.parse(atob(base64));

    return payload;
  } catch (err) {
    console.log("Token decode error:", err.message);
    return null;
  }
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const payload = decodeToken(token);

  // ❌ invalid token → clear it
  if (!payload) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // ❌ missing role
  if (!payload.role) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // ❌ not admin
  if (payload.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
