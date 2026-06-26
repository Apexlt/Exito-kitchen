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
          <button className="clear-modern" onClick={() => setSearch("")}>
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
              <FoodCard key={food.id} food={food} addToCart={addToCart} />
            ))
          ) : (
            <p style={{ color: "#999" }}>No food found 😢</p>
          )}
        </div>
      )}

      {/* 🔥 NEW CATERING SECTION */}
      {category === "events" && (
        <div className="catering-alt">

          {/* HERO */}
          <div className="catering-banner">
            <div className="overlay">
              <h2>Luxury Catering Experience</h2>
              <p>Private chefs • Events • Bulk cooking</p>
            </div>
          </div>

          {/* STATS */}
          <div className="catering-stats">
            <div><strong>100+</strong><span>Events</span></div>
            <div><strong>1000+</strong><span>Chefs</span></div>
            <div><strong>24/7</strong><span>Service</span></div>
          </div>

          {/* SERVICES */}
          <div className="catering-scroll">

            <div className="scroll-card">
              <h3>👨‍🍳 Private Chef</h3>
              <p>Live cooking at your home with custom menus</p>
              <button onClick={() => navigate("/contact")}>Book</button>
            </div>

            <div className="scroll-card">
              <h3>🎉 Event Catering</h3>
              <p>Weddings, birthdays & corporate events</p>
              <button onClick={() => navigate("/contact")}>Book</button>
            </div>

          </div>

          {/* PRICING */}
          <div className="catering-alt-pricing">

            <div className="alt-price">
              <h4>Starter</h4>
              <p>Small gatherings</p>
              <h2>₦100k+</h2>
            </div>

            <div className="alt-price highlight">
              <h4>Standard</h4>
              <p>Parties & events</p>
              <h2>₦150k+</h2>
            </div>

            <div className="alt-price">
              <h4>Premium</h4>
              <p>Luxury weddings</p>
              <h2>Custom</h2>
            </div>

          </div>

          {/* CTA */}
          <button className="alt-cta" onClick={() => navigate("/contact")}>
            Book Catering Now 🚀
          </button>

        </div>
      )}
    </div>
  );
}

export default Home;
