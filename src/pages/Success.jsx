import { useLocation, useNavigate } from "react-router-dom";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ LOAD ORDER DIRECTLY (NO useEffect, NO setState)
  let order = null;

  try {
    const savedOrder = localStorage.getItem("lastOrder");

    if (savedOrder) {
      order = JSON.parse(savedOrder);
    }
  } catch (err) {
    console.error("Order load error:", err);
  }

  const params = new URLSearchParams(location.search);
  const ref = params.get("reference");

  // 🚨 Redirect if no order + no reference
  if (!order && !ref) {
    navigate("/");
    return null;
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1>Payment Successful</h1>

        {!order ? (
          <p>Loading order...</p>
        ) : (
          <>
            <p>
              <strong>Reference:</strong>{" "}
              {order.reference || ref}
            </p>

            {/* ✅ FIXED FIELD */}
            <p>
              <strong>Total Paid:</strong>{" "}
              ₦{order.amount?.toLocaleString()}
            </p>

            <h3>Order Items:</h3>

            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} style={itemBox}>
                  {item.name} x {item.quantity}

                  {item.inHouse && (
                    <span
                      style={{
                        color: "green",
                        marginLeft: "10px",
                      }}
                    >
                      🍳 In-House
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p>No items found</p>
            )}

            {order.location && (
              <>
                <h3>Delivery Location:</h3>
                <p>{order.location}</p>
              </>
            )}
          </>
        )}

        <button style={btn} onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Success;

/* 🎨 STYLES */

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

const itemBox = {
  padding: "8px 0",
  borderBottom: "1px solid #eee",
};

const btn = {
  marginTop: "20px",
  width: "100%",
  padding: "12px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
