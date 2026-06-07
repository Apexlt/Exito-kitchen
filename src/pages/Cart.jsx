import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    cartTotal,
    clearCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "100vw",
        minHeight: "100vh",
        boxSizing: "border-box",
        overflowX: "hidden",
        background: "#fff",
      }}
    >
      <h1>Your Cart 🛒</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>Your cart is empty 🛒</h2>
          <p>Add some delicious meals to get started 🍽</p>

          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={`${item.id}-${item.inHouse}-${index}`}
              style={{
                marginBottom: "15px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
                wordBreak: "break-word",
              }}
            >
              <h3>{item.name}</h3>
              <p>₦{item.price}</p>

              {item.inHouse && (
                <p style={{ color: "green" }}>
                  🍽 In-House Cooking
                </p>
              )}

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => decreaseQty(item.id, item.inHouse)}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item.id, item.inHouse)}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id, item.inHouse)}
              >
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ₦{cartTotal}</h2>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>

            <button
              onClick={clearCart}
              style={{
                background: "red",
                color: "white",
              }}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
