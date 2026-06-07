import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(email, password);

      if (!data?.success) {
        setError(data?.message || "Signup failed");
        return;
      }

      alert("Account created successfully");
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>Sign Up</h2>

        {error && <div style={errorBox}>{error}</div>}

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

        <button onClick={handleSignup} disabled={loading} style={btn}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p style={{ marginTop: 10 }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;

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
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ddd",
};

const btn = {
  width: "100%",
  padding: 10,
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: 6,
};

const errorBox = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "12px",
  fontSize: "14px",
};
