import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import "./styles/ReviewCard.css";
import { useStore } from "../context/reviewContext.js";
import Rating from "./Rating";

function ReviewCard({ review }) {
  const productId = review?.productId;
  const { updateHelpfulVotes, getReviewsByProductId } = useStore();
  const [hasVoted, setHasVoted] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [productReviews, setProductReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = () => {
      const reviews = getReviewsByProductId(productId);
      setProductReviews(reviews);
    };
    fetchReviews();
  }, [productId, getReviewsByProductId]);

  const reviewDate = review?.date
    ? new Date(Date.parse(review.date))
    : new Date();

  const isLongReview = review?.comment?.length > 300;
  const displayText =
    isLongReview && !showFullReview
      ? `${review?.comment.substring(0, 300)}...`
      : review?.comment;

  const handleHelpfulClick = () => {
    if (!hasVoted) {
      updateHelpfulVotes(review?.id);
      setHasVoted(true);
    }
  };

  const helpFullClickCount = productReviews.find((helpClick) => {
    return helpClick.id === review?.id;
  });

  console.log("helpFullClickCount", helpFullClickCount);

  return (
    <>
      <div className="review-card" key={review.id}>
        <div className="review-header">
          <div className="reviewer-info">
            <div className="reviewer-avatar">
              {review?.avatar ? (
                <img
                  src={
                    review?.avatar ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ&s"
                  }
                  alt={`${review?.name}'s avatar`}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-fallback">
                  {review?.name?.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="reviewer-details">
              <div className="reviewer-name">{review?.name}</div>
              <div className="review-date">
                {formatDistanceToNow(reviewDate, { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="review-menu">
            <button
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Review options"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button
                  className="menu-item"
                  onClick={() => setShowMenu(false)}
                >
                  🚩 Report review
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="review-rating">
          <div className="rating-stars">
            <Rating productId={productId} showCount={false}></Rating>
          </div>
        </div>

        <h3 className="review-title">{review?.title}</h3>

        <p className="review-text">
          {displayText && displayText}
          {isLongReview && (
            <button
              className="read-more-button"
              onClick={() => setShowFullReview(!showFullReview)}
            >
              {showFullReview ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {review?.images && review?.images.length > 0 && (
          <div className="review-images">
            {review?.images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Review image ${index + 1}`}
                className="review-image"
              />
            ))}
          </div>
        )}

        <div className="review-actions">
          <button
            className={`helpful-button ${hasVoted ? "voted" : ""}`}
            onClick={handleHelpfulClick}
            disabled={hasVoted}
          >
            👍 Helpful ({helpFullClickCount?.helpfulVotes})
          </button>
        </div>
      </div>
    </>
  );
}

export default ReviewCard;
