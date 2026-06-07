import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { cart = [] } = useContext(CartContext);

  // 🔥 Calculate count safely here
  const cartCount = cart.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  return (
    <nav className="navbar">
      <h2 className="logo">Exito Kitchen</h2>

      <div className="links">
        <Link to="/">
          <img src="/icons8-home.svg" alt="Home" />
        </Link>

        <Link to="/cart" style={{ position: "relative" }}>
          <img src="/icons8-cart.gif" alt="Cart" />

          {/* 🔥 CART BADGE */}
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>

        <Link to="/contact">
          <img src="/call2.svg" alt="Contact" />
        </Link>

         <a href="/profile"><img src="/login.png" alt="" /></a>

      </div>
    </nav>
  );
}

export default Navbar;
