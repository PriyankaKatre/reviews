import { useState, useEffect, useRef } from "react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import "./styles/ProductReviews.css";
import { useStore } from "../context/reviewContext.js";
import Rating from "./Rating.js";

function ProductReviews({ productId }) {
  const { getReviewsByProductId, addReview, averageRatings } = useStore();
  const [state, setState] = useState({
    productReviews: [],
    page: 1,
    filterRating: null,
    showForm: false,
    activeTab: "recent",
  });
  const observer = useRef();
  const sentinelRef = useRef();

  const fetchReviews = (page) => {
    let reviews = getReviewsByProductId(productId);
    const limit = 5;
    const start = (page - 1) * limit;
    const end = start + limit;
    reviews = reviews.slice(start, end);
    setState((prevState) => ({
      ...prevState,
      productReviews: [
        ...prevState.productReviews,
        ...reviews.filter(
          (review) =>
            !prevState.productReviews.some(
              (prevReview) => prevReview.id === review.id
            )
        ),
      ],
    }));
  };

  useEffect(() => {
    fetchReviews(1); // Initial load
  }, [productId, getReviewsByProductId]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));
      }
    });
    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }
  }, [sentinelRef]);

  useEffect(() => {
    if (state.page > 1) {
      fetchReviews(state.page); // Load more reviews
    }
  }, [state.page]);

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
    setState((prevState) => ({ ...prevState, showForm: false }));
  };

  const filteredReviews = state.filterRating
    ? state.productReviews.filter(
        (review) => review.rating === state.filterRating
      )
    : state.productReviews;

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: state.productReviews.filter((review) => review.rating === rating)
      .length,
    percentage:
      state.productReviews.length > 0
        ? (state.productReviews.filter((review) => review.rating === rating)
            .length /
            state.productReviews.length) *
          100
        : 0,
  }));

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (state.activeTab === "recent") {
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
            Based on {state.productReviews.length} reviews
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
                  state.filterRating === rating ? "filter-button-active" : ""
                }`}
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    filterRating: rating,
                  }))
                }
              >
                {rating === null ? "All" : rating}
              </button>
            ))}
          </div>
        </div>
        <button
          className="write-review-button"
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              showForm: !prevState.showForm,
            }))
          }
        >
          {state.showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Form */}
      {state.showForm && (
        <div className="review-form-container">
          <ReviewForm onSubmit={handleAddReview} />
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-tabs">
        <div className="tabs-list">
          <button
            className={`tab-button ${
              state.activeTab === "recent" ? "tab-active" : ""
            }`}
            onClick={() =>
              setState((prevState) => ({ ...prevState, activeTab: "recent" }))
            }
          >
            Most Recent
          </button>
          <button
            className={`tab-button ${
              state.activeTab === "helpful" ? "tab-active" : ""
            }`}
            onClick={() =>
              setState((prevState) => ({ ...prevState, activeTab: "helpful" }))
            }
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
