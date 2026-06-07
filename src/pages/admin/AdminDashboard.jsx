import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://exito-kitchen.onrender.com";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showLogout, setShowLogout] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundLoadingId, setRefundLoadingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }, [navigate]);

  const loadData = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const [ordersRes, usersRes, feedbackRes] = await Promise.all([
        fetch(`${BASE_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/admin/feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();
      const feedbackData = await feedbackRes.json();

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setFeedbacks(Array.isArray(feedbackData) ? feedbackData : []);
    } catch (err) {
      console.error("LOAD DATA ERROR:", err);
      setOrders([]);
      setUsers([]);
      setFeedbacks([]);
    }
  }, [token, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const deleteOrder = async (id) => {
    try {
      await fetch(`${BASE_URL}/admin/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const confirmRefund = async () => {
    if (!selectedOrder) return;

    setRefundLoadingId(selectedOrder._id);

    try {
      const res = await fetch(
        `${BASE_URL}/admin/orders/${selectedOrder._id}/refund`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: refundReason || "Admin refund",
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Refund failed");
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, status: "refunded" } : o
        )
      );

      setShowRefund(false);
      setSelectedOrder(null);
      setRefundReason("");
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setRefundLoadingId(null);
    }
  };

  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, o) => acc + Number(o.amount || 0), 0);
  }, [orders]);

  const chartData = useMemo(() => {
    const map = {};

    orders.forEach((o) => {
      const date = new Date(o.createdAt || Date.now()).toLocaleDateString();
      if (!map[date]) map[date] = { date, revenue: 0 };
      map[date].revenue += Number(o.amount || 0);
    });

    return Object.values(map);
  }, [orders]);

  const renderOrders = () => (
    <div>
      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.slice(0, 20).map((order) => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderInfo}>
              <p><b>Email:</b> {order.email}</p>
              <p><b>Amount:</b> ₦{order.amount}</p>
              <p><b>Status:</b> {order.status}</p>
              <p><b>Reference:</b> {order.reference}</p>
              <p><b>Location:</b> {order.location || "No address"}</p>

              <hr />

              <b>Items:</b>

              {order.items?.map((item, idx) => {
                const isInHouse = item?.inHouse === true;

                return (
                  <div key={idx} style={styles.itemBox}>
                    <p><b>{item.name}</b></p>
                    <p>Qty: {item.quantity}</p>
                    <p>₦{item.price}</p>

                    <span
                      style={{
                        padding: "3px 6px",
                        borderRadius: 5,
                        fontSize: 11,
                        color: "#fff",
                        background: isInHouse ? "#16a34a" : "#2563eb",
                      }}
                    >
                      {isInHouse ? "In-House" : "Delivery"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={styles.orderActions}>
              <button onClick={() => deleteOrder(order._id)}>Delete</button>
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowRefund(true);
                }}
              >
                Refund
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderFeedback = () => (
    <div>
      <h2>Customer Feedback</h2>

      {feedbacks.length === 0 ? (
        <p>No feedback yet</p>
      ) : (
        feedbacks.map((f, i) => (
          <div key={f._id || i} style={styles.card}>
            <p><b>Email:</b> {f.email || "Anonymous"}</p>
            <p><b>User ID:</b> {f.userId}</p>
            <p><b>Message:</b> {f.message}</p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div style={styles.container}>

      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: 15,
          left: sidebarOpen ? 220 : 10,
          zIndex: 9999,
          background: "#111",
          color: "#fff",
          border: "none",
          padding: "8px 10px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      <div
        style={{
          ...styles.sidebar,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <button onClick={() => setView("dashboard")} style={styles.sideBtn}>
          Dashboard
        </button>
        <button onClick={() => setView("orders")} style={styles.sideBtn}>
          Orders
        </button>
        <button onClick={() => setView("users")} style={styles.sideBtn}>
          Users
        </button>
        <button onClick={() => setView("feedback")} style={styles.sideBtn}>
          Feedback
        </button>

        <button
          onClick={() => setShowLogout(true)}
          style={{ ...styles.sideBtn, background: "red" }}
        >
          Logout
        </button>
      </div>

      <div style={{ ...styles.main, marginLeft: sidebarOpen ? 220 : 0 }}>
        {view === "dashboard" && (
          <>
            <div style={styles.stats}>
              <div style={styles.card}>Revenue ₦{totalRevenue}</div>
              <div style={styles.card}>{orders.length} Orders</div>
              <div style={styles.card}>{users.length} Users</div>
            </div>

            <div style={styles.chart}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <CartesianGrid />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="revenue" stroke="#4f46e5" fill="#4f46e5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {view === "orders" && renderOrders()}
        {view === "users" && (
          <div>
            <h2>Users</h2>
            {users.map((u) => (
              <div key={u._id} style={styles.card}>
                <p><b>Email:</b> {u.email}</p>
                <p><b>Role:</b> {u.role}</p>
              </div>
            ))}
          </div>
        )}

        {view === "feedback" && renderFeedback()}
      </div>

      {showLogout && (
        <div style={styles.modal}>
          <div style={styles.box}>
            <p>Logout?</p>
            <button onClick={() => setShowLogout(false)}>Cancel</button>
            <button onClick={handleLogout}>Yes</button>
          </div>
        </div>
      )}

      {showRefund && (
        <div style={styles.modal}>
          <div style={styles.box}>
            <h3>Refund</h3>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
            <button onClick={() => setShowRefund(false)}>Cancel</button>
            <button onClick={confirmRefund}>
              {refundLoadingId ? "Processing..." : "Refund"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    overflowX: "hidden",
  },

  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    width: 220,
    height: "100vh",
    background: "#111",
    color: "#fff",
    padding: 10,
    transition: "0.3s",
    zIndex: 999,
  },

  main: {
    flex: 1,
    padding: 20,
    minWidth: 0,
    transition: "0.3s",
  },

  sideBtn: {
    width: "100%",
    marginTop: 10,
    padding: 10,
  },

  stats: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },

  card: {
    flex: "1 1 150px",
    background: "#fff",
    padding: 15,
    minWidth: 150,
  },

  chart: {
    marginTop: 20,
    background: "#fff",
    padding: 20,
    width: "100%",
    overflowX: "auto",
  },

  orderCard: {
    marginTop: 10,
    background: "#fff",
    padding: 15,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  orderInfo: {
    flex: 1,
    minWidth: 250,
  },

  orderActions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  itemBox: {
    fontSize: 12,
    marginTop: 6,
    padding: 8,
    background: "#f5f5f5",
    borderRadius: 6,
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
  },
};

export default AdminDashboard;
