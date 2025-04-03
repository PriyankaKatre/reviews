import { useState, useEffect, useRef } from "react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import "./styles/ProductReviews.css";
import { useStore } from "../context/reviewContext.js";
import Rating from "./Rating";

function ProductReviews({ productId }) {
  const { getReviewsByProductId, addReview, averageRatings } = useStore();
  const [productReviews, setProductReviews] = useState([]);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const fetchReviews = (page) => {
    let reviews = getReviewsByProductId(productId);
    let limit = 5;
    const start = (page - 1) * limit;
    const end = start + limit;
    reviews = reviews.slice(start, end);
    setProductReviews((prevReviews) => {
      const newReviews = reviews.filter(
        (review) =>
          !prevReviews.some((prevReview) => prevReview.id === review.id)
      );
      return [...prevReviews, ...newReviews];
    });
  };

  useEffect(() => {
    fetchReviews(1); // Initial load
  }, [productId, getReviewsByProductId]);

  const sentinelRef = useRef();
  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }
  }, [sentinelRef]);

  useEffect(() => {
    if (page > 1) {
      fetchReviews(page); // Load more reviews
    }
  }, [page]);

  const [filterRating, setFilterRating] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");

  // Filter reviews by rating
  const filteredReviews = filterRating
    ? productReviews.filter((review) => review.rating === filterRating)
    : productReviews;

  // Count reviews by rating
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: productReviews.filter((review) => review.rating === rating).length,
    percentage:
      productReviews.length > 0
        ? (productReviews.filter((review) => review.rating === rating).length /
            productReviews.length) *
          100
        : 0,
  }));

  // Add a new review
  const handleAddReview = (newReview) => {
    const reviewWithId = {
      ...newReview,
      id: crypto.randomUUID(),
      productId,
      date: new Date().toISOString(),
      helpfulVotes: 0,
      avatar: null,
    };

    addReview(reviewWithId);
    setShowForm(false);
  };

  // Sort reviews based on active tab
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (activeTab === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.helpfulVotes - a.helpfulVotes;
    }
  });

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="rating-average">
          <div className="rating-number">{averageRatings[productId]}</div>
          <div className="rating-stars">
            <Rating productId={productId} showCount={false} />
          </div>
          <div className="rating-count">
            Based on {productReviews.length} reviews
          </div>
        </div>

        <div className="rating-bars">
          {ratingCounts.map((item) => (
            <div key={item.rating} className="rating-bar-row">
              <div className="rating-bar-label">{item.rating} stars</div>
              <div className="rating-bar-container">
                <div
                  className="rating-bar-fill"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="rating-bar-count">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Actions */}
      <div className="review-actions">
        <div className="filter-container">
          <span className="filter-icon">⚙️</span>
          <span className="filter-label">Filter by:</span>
          <div className="filter-buttons">
            {[null, 5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating === null ? "all" : rating}
                className={`filter-button ${
                  filterRating === rating ? "filter-button-active" : ""
                }`}
                onClick={() => setFilterRating(rating)}
              >
                {rating === null ? "All" : rating}
              </button>
            ))}
          </div>
        </div>
        <button
          className="write-review-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="review-form-container">
          <ReviewForm onSubmit={handleAddReview} />
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-tabs">
        <div className="tabs-list">
          <button
            className={`tab-button ${
              activeTab === "recent" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("recent")}
          >
            Most Recent
          </button>
          <button
            className={`tab-button ${
              activeTab === "helpful" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("helpful")}
          >
            Most Helpful
          </button>
        </div>

        <div className="tabs-content">
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="no-reviews">
              No reviews match your filter. Try a different rating or view all
              reviews.
            </div>
          )}
        </div>
        <div ref={sentinelRef} style={{ height: "20px" }}></div>
      </div>
    </div>
  );
}

export default ProductReviews;
