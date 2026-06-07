import { useState } from "react";
import "./FoodCard.css";

function FoodCard({ food, addToCart }) {
  const [inHouse, setInHouse] = useState(false);

  return (
    <div className="food-card">
      <img src={food.image} alt={food.name} />

      <div className="food-info">
        <h3>{food.name}</h3>
        <p>₦{food.price}</p>

        <label className="toggle">
          <input
            type="checkbox"
            checked={inHouse}
            onChange={() => setInHouse(!inHouse)}
          />
          In-House Cooking 🍳
        </label>

        <button onClick={() => addToCart(food, { inHouse })}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default FoodCard;