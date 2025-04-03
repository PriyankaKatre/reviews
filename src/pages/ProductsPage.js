import { useState } from "react";
import { Link } from "react-router-dom";
import Rating from '../components/Rating.js';
import "./styles/ProductsPage.css";
import { useStore } from "../context/reviewContext.js";

function ProductsPage() {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState("Beauty");

  const filteredProduct = products.filter(
    (product) => product.category === activeTab
  );

  console.log('product page re-rendered');
  return (
    <div className="container">
      <h1 className="page-title">Our Products</h1>

      <div className="reviews-tabs">
        <div className="tabs-list">
          <button
            className={`tab-button ${
              activeTab === "Beauty" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("Beauty")}
          >
            Beauty
          </button>
          <button
            className={`tab-button ${activeTab === "Cars" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Cars")}
          >
            Cars
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredProduct.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
              <div className="product-image-container">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <Rating productId={product.id} />
                <div className="product-price">${product.price.toFixed(2)}</div>
              </div>
            </Link>
            <button className="buy-button">BUY</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
