import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= NORMAL LOGIN ================= */
  const handleLogin = async () => {
    if (loading) return;

    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (!data?.success || !data?.token) {
        setError(data?.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      let payload;

      try {
        payload = JSON.parse(atob(data.token.split(".")[1]));
      } catch {
        localStorage.removeItem("token");
        setLoading(false);
        return navigate("/login", { replace: true });
      }

      console.log("LOGIN PAYLOAD:", payload);

      if (payload.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (error) {
      console.error(error);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = () => {
    window.location.href =
      "https://exito-kitchen.onrender.com/auth/google";
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>Login</h2>

        {error && <div style={errorBox}>{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          <button type="submit" style={btn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button onClick={handleGoogleLogin} style={btn}>
          Continue with Google
        </button>

        <p>
          Don’t have an account{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

/* styles */
const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh",
};

const card = {
  padding: 20,
  background: "#fff",
  borderRadius: 12,
  width: 320,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
};

const btn = {
  width: "100%",
  padding: 10,
  background: "#111827",
  color: "#fff",
  marginTop: 10,
};

const errorBox = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: 10,
  marginBottom: 10,
};
