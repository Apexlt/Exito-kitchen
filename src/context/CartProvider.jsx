import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =====================
  // ADD TO CART (FIXED)
  // =====================
  const addToCart = (item, options = {}) => {
    const inHouse = options.inHouse === true;

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.inHouse === inHouse
      );

      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.inHouse === inHouse
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          inHouse, // 🔥 IMPORTANT
        },
      ];
    });
  };

  const removeFromCart = (id, inHouse) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.inHouse === inHouse)
      )
    );
  };

  const increaseQty = (id, inHouse) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.inHouse === inHouse
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id, inHouse) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.inHouse === inHouse
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
