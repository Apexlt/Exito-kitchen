import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://exito-kitchen.onrender.com";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= PROTECT ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  /* ================= ORDERS ================= */
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/user/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ================= FEEDBACK ================= */
  const sendFeedback = async () => {
    if (!message.trim()) return alert("Please enter feedback");
    if (!token) return alert("Not logged in");

    setSending(true);

    try {
      const res = await fetch(`${BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to send feedback");
        return;
      }

      setShowSuccess(true);
      setMessage("");

      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
    } catch {
      alert("Network error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>My Profile</h1>
          <p style={{ opacity: 0.7 }}>Manage your activity</p>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.grid}>
        {/* FEEDBACK */}
        <div style={{ ...styles.card, height: "fit-content" }}>
          <h2>Send Feedback</h2>

          <textarea
            placeholder="Tell us what you think..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.textarea}
          />

          <button
            onClick={sendFeedback}
            style={styles.primaryBtn}
            disabled={sending}
          >
            {sending ? "Sending..." : "Submit Feedback"}
          </button>
        </div>

        {/* ORDERS */}
        <div
          style={{
            ...styles.card,
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <h2>Order History</h2>

          {isLoading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderTop}>
                  <span>₦{order.amount}</span>
                  <span style={statusStyle(order.status)}>
                    {order.status}
                  </span>
                </div>

                <small style={{ opacity: 0.6 }}>
                  {new Date(order.createdAt).toLocaleString()}
                </small>

                <div style={{ marginTop: 10 }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={styles.itemRow}>
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div style={styles.popup}>
          <div style={styles.popupBox}>
            <h3>✅ Feedback Sent</h3>
            <p>Thanks for your input!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 20,
    alignItems: "start", // 🔥 prevents stretching
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },

  textarea: {
    width: "100%",
    minHeight: 100,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  primaryBtn: {
    width: "100%",
    marginTop: 10,
    padding: 12,
    border: "none",
    borderRadius: 8,
    background: "#4f46e5",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },

  orderCard: {
    marginTop: 15,
    padding: 12,
    background: "#fafafa",
    borderRadius: 10,
  },

  orderTop: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    padding: "4px 0",
  },

  /* POPUP */
  popup: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  popupBox: {
    background: "#fff",
    padding: "20px 30px",
    borderRadius: 12,
    textAlign: "center",
  },
};

/* STATUS COLOR */
const statusStyle = (status) => ({
  padding: "3px 8px",
  borderRadius: 6,
  fontSize: 12,
  color: "#fff",
  background:
    status === "paid"
      ? "#16a34a"
      : status === "pending"
      ? "#f59e0b"
      : status === "refunded"
      ? "#dc2626"
      : "#6b7280",
});
