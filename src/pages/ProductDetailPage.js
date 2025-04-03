import { useState } from "react";
import { useParams } from "react-router-dom";
import ProductReviews from "../components/ProductReviews";
import "./styles/ProductDetailPage.css";
import { useStore } from "../context/reviewContext.js";
import Rating from "../components/Rating";

function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useStore();
  const product = products.find((p) => p.id === Number.parseInt(id));
  const [selectedImage, setSelectedImage] = useState(null);

  if (!product) {
    return <div className="container">Product not found</div>;
  }

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-images">
          <div className="main-image-container">
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail-button ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="thumbnail-image"
                  />
                </button>
              ))}
            </div>
            <img
              src={product.images[selectedImage] || product.image}
              alt={product.name}
              className="main-image"
            />
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>

          <div className="product-rating">
            <Rating productId={product.id}></Rating>
          </div>

          <div className="product-price">
            <span className="label">Price:</span>${product.price.toFixed(2)}
          </div>

          {product.salePrice && (
            <div className="product-sale">
              <span className="original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="discount-badge">
                Save{" "}
                {Math.round(
                  (1 - product.salePrice / product.originalPrice) * 100
                )}
                %
              </span>
            </div>
          )}

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          <div className="product-actions">
            <button className="buy-button">BUY</button>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Tags:</span>
              <span className="meta-value">{product.tags.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-tabs">
        <div className="tab-content">
          <div className="tab-pane active">
            <h3>Product Description</h3>
            <p>{product.fullDescription}</p>
            <ul className="feature-list">
              {product.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="product-reviews-section">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}

export default ProductDetailPage;
