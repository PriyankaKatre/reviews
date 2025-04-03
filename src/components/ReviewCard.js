import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import './styles/ReviewCard.css'; // Using normal CSS
import { useStore } from '../context/reviewContext.js';
import Rating from './Rating.js';

function ReviewCard({ review }) {
  const { productId, name, date, comment, title, id, rating } = review;
  const { updateHelpfulVotes, getReviewsByProductId } = useStore();
  const [hasVoted, setHasVoted] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = () => {
      try {
        const reviews = getReviewsByProductId(productId);
        setProductReviews(reviews);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchReviews();
  }, [productId, getReviewsByProductId]);

  const reviewDate = date ? new Date(Date.parse(date)) : new Date();

  const isLongReview = comment?.length > 300;
  const displayText =
    isLongReview && !showFullReview
      ? `${comment.substring(0, 300)}...`
      : comment;

  const handleHelpfulClick = () => {
    if (!hasVoted) {
      updateHelpfulVotes(id);
      setHasVoted(true);
    }
  };

  const helpFullClickCount = productReviews.find(
    (helpClick) => helpClick.id === id
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="review-card" key={id}>
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            <div className="avatar-fallback">
              {name?.substring(0, 2).toUpperCase()}
            </div>
          </div>
          <div className="reviewer-details">
            <div className="reviewer-name">{name}</div>
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
              <button className="menu-item" onClick={() => setShowMenu(false)}>
                🚩 Report review
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="review-rating">
        <div className="rating-stars">
          <Rating
            productId={productId}
            showCount={false}
            reviewRating={rating}
          />
        </div>
      </div>

      <h3 className="review-title">{title}</h3>

      <p className="review-text">
        {displayText}
        {isLongReview && (
          <button
            className="read-more-button"
            onClick={() => setShowFullReview(!showFullReview)}
          >
            {showFullReview ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>
      <div className="review-actions">
        <button
          className={`helpful-button ${hasVoted ? 'voted' : ''}`}
          onClick={handleHelpfulClick}
          disabled={hasVoted}
        >
          👍 Helpful ({helpFullClickCount?.helpfulVotes})
        </button>
      </div>
    </div>
  );
}

export default ReviewCard;
