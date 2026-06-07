import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { verifyPayment } from "../api/api";

function Checkout() {
  const { cart, cartTotal, clearCart } = useContext(CartContext);

  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ POPUP STATE
  const [popup, setPopup] = useState({
    show: false,
    message: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* =========================
     POPUP HANDLER
  ========================= */
  const showPopup = (message) => {
    setPopup({ show: true, message });

    setTimeout(() => {
      setPopup({ show: false, message: "" });
    }, 2500);
  };

  /* =========================
     VERIFY PAYMENT
  ========================= */
  const handleVerify = async (reference, cartSnapshot) => {
    try {
      setLoading(true);

      const data = await verifyPayment({
        reference,
        cart: cartSnapshot,
        email,
        location,
        token,
      });

      if (!data.success) {
        throw new Error(data.message || "Payment failed");
      }

      localStorage.setItem("lastOrder", JSON.stringify(data.order));

      clearCart();
      navigate("/success");
    } catch (err) {
      console.error("Checkout error:", err.message);
      showPopup("❌ Payment verification failed. Contact support.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PAYSTACK PAYMENT
  ========================= */
  const payWithPaystack = () => {
    if (!token) {
      return showPopup("❌ Please login before checkout");
    }

    if (!email) {
      return showPopup("❌ Please enter your email");
    }

    if (!location) {
      return showPopup("❌ Please enter delivery address");
    }

    if (!cart.length) {
      return showPopup("❌ Your cart is empty");
    }

    if (!window.PaystackPop) {
      return showPopup("❌ Payment system not loaded");
    }

    const cartSnapshot = structuredClone(cart);

    const handler = window.PaystackPop.setup({
      key: "pk_test_28254fa38ebbfb9ebc98700c8f5a79187dbe43e5",
      email,
      amount: Math.round(cartTotal * 100),
      currency: "NGN",

      metadata: {
        custom_fields: [
          {
            display_name: "Delivery Location",
            variable_name: "delivery_location",
            value: location,
          },
        ],
      },

      callback: (response) => {
        handleVerify(response.reference, cartSnapshot);
      },

      onClose: () => {
        showPopup("⚠️ Payment cancelled");
      },
    });

    handler.openIframe();
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1>Checkout 💳</h1>

        <div style={section}>
          <h3>Total Amount</h3>
          <p style={total}>₦{cartTotal}</p>
        </div>

        <div style={section}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div style={section}>
          <label>Delivery Location</label>
          <textarea
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={textarea}
            placeholder="Enter your full delivery address and phone number"
          />
        </div>

        <button
          onClick={payWithPaystack}
          disabled={loading}
          style={{
            ...payBtn,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Processing..." : "Pay Now 🚀"}
        </button>
      </div>

      {/* =========================
          POPUP MODAL
      ========================= */}
      {popup.show && (
        <div style={overlay}>
          <div style={popupBox}>
            <p style={{ margin: 0 }}>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;

/* =========================
   STYLES
========================= */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  background: "#f5f5f5",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "350px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const section = {
  marginBottom: "15px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  boxSizing: "border-box",
};

const textarea = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  height: "80px",
  boxSizing: "border-box",
};

const total = {
  fontSize: "20px",
  fontWeight: "bold",
};

const payBtn = {
  width: "100%",
  padding: "12px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

/* =========================
   POPUP STYLES
========================= */

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const popupBox = {
  background: "#111",
  color: "#fff",
  padding: "20px",
  borderRadius: "10px",
  minWidth: "250px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
};