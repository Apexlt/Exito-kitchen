import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔥 GoogleSuccess loaded");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // ✅ If token exists in URL → process it
    if (token) {
      console.log("TOKEN FROM URL:", token);

      // save token
      localStorage.setItem("token", token);

      // 🔥 REMOVE TOKEN FROM URL (prevents second run bug)
      window.history.replaceState({}, document.title, "/google-success");

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("DECODED PAYLOAD:", payload);

        if (payload.role === "admin") {
          console.log("➡️ Redirecting to admin");
          return navigate("/admin", { replace: true });
        } else {
          console.log("➡️ Redirecting to profile");
          return navigate("/profile", { replace: true });
        }
      } catch {
        console.log("❌ Token decode failed");
        localStorage.removeItem("token");
        return navigate("/login", { replace: true });
      }
    }

    // ✅ If NO token → check if already logged in
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split(".")[1]));

        if (payload.role === "admin") {
          return navigate("/admin", { replace: true });
        } else {
          return navigate("/profile", { replace: true });
        }
      } catch {
        localStorage.removeItem("token");
      }
    }

    // ❌ nothing valid → login
    console.log("❌ No valid token");
    navigate("/login", { replace: true });

  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h3>Signing you in...</h3>
    </div>
  );
}

export default GoogleSuccess;