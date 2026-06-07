import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import foodData from "../data/foodData";
import FoodCard from "../components/FoodCard";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [category, setCategory] = useState("local");
  const [search, setSearch] = useState("");

  const filteredFood = foodData.filter((food) => {
    const matchCategory = food.category === category;
    const matchSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="home-page">
      <h1>Welcome to Exito Kitchen 🍽️</h1>

      {/* INFO BANNER */}
      <div className="info-banner">
        <h3>🍳 How Our Cooking Works</h3>
        <p>
          ✔ In-House → Chef comes to cook for you
          <br />
          ✔ Off → We cook & deliver to you
        </p>
      </div>

      {/* SEARCH */}
     <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search for meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-modern"
        />

        {search && (
          <button
            className="clear-modern"
            onClick={() => setSearch("")}
          >
            ×
          </button>
        )}
      </div>
      {/* CATEGORY TABS */}
      <div className="menu-tabs">
        <button
          className={category === "local" ? "active" : ""}
          onClick={() => setCategory("local")}
        >
          Local 🍛
        </button>

        <button
          className={category === "intercontinental" ? "active" : ""}
          onClick={() => setCategory("intercontinental")}
        >
          Intercontinental 🌍
        </button>

        <button
          className={category === "events" ? "active" : ""}
          onClick={() => setCategory("events")}
        >
          Catering 🎉
        </button>
      </div>

      {/* FOOD GRID */}
      {category !== "events" && (
        <div className="food-grid">
          {filteredFood.length > 0 ? (
            filteredFood.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                addToCart={addToCart}
              />
            ))
          ) : (
            <p style={{ color: "#999" }}>No food found 😢</p>
          )}
        </div>
      )}

      {/* PREMIUM CATERING SECTION */}
      {category === "events" && (
        <div className="catering-premium">

          <div className="catering-hero">
            <h2>🍽️ Luxury Catering & Private Chef Services</h2>
            <p>
              Restaurant-quality meals, professional chefs, and full event catering
              delivered to your location.
            </p>
          </div>

          <div className="catering-value">
            ⭐ 100+ Events • 👨‍🍳 Expert Chefs • 🚚 On-site Service
          </div>

          <div className="catering-services">

            <div className="service-card">
              <div className="icon">👨‍🍳</div>
              <h3>Private Chef</h3>
              <p>Chef cooks fresh meals at your home</p>
            </div>

            <div className="service-card">
              <div className="icon">🎉</div>
              <h3>Event Catering</h3>
              <p>Weddings, birthdays & corporate events</p>
            </div>

            <div className="service-card">
              <div className="icon">🚚</div>
              <h3>Bulk Food</h3>
              <p>Large orders for parties & gatherings</p>
            </div>

          </div>

          <div className="pricing-title">💰 Pricing</div>

          <div className="catering-pricing">

            <div className="price-card">
              <h4>Small Events</h4>
              <p>Home gatherings</p>
              <h3>₦100,000+</h3>
            </div>

            <div className="price-card featured">
              <h4>Medium Events</h4>
              <p>Parties & celebrations</p>
              <h3>₦150,000+</h3>
            </div>

            <div className="price-card">
              <h4>Luxury Events</h4>
              <p>Weddings & corporate</p>
              <h3>Custom</h3>
            </div>

          </div>

          <button
            className="catering-cta"
            onClick={() => navigate("/contact")}
          >
          📲 Book Catering Now
      </button>

        </div>
      )}
    </div>
  );
}

export default Home;