import React from "react";
import "./homePage.scss";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="homePage">
      <div className="container">
        <img
          src="https://www.chsbuffalo.org/wp-content/uploads/2019/05/farmers-market.jpg"
          alt=""
        />
        <div className="overlay"></div>
        <h2>AgriTrack</h2>
        <div className="text">
          AgriTrack Solutions provides a specialized platform for farmers to
          efficiently track yields, sell products, and connect directly with
          consumers. Our marketplace empowers farmers with sales reports and
          notifications, enhancing operational control while offering customers
          easy access to fresh, local produce. Experience a seamless integration
          of agriculture and technology for improved profitability.
        </div>
        <div className="btn">
          <Link to="/dashboard">
            <button className="first-btn">Dashboard</button>
          </Link>
          <Link to="/products">
            <button className="second-btn">Products</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
