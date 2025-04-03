import { useEffect, useState } from "react";
import { useStore } from "../context/reviewContext.js";

export default Rating = ({ productId, showCount = true }) => {
  const { averageRatings, getReviewsByProductId } = useStore();
  const [productReviews, setProductReviews] = useState([]);

  const rating = averageRatings[productId];

  useEffect(() => {
    const reviews = getReviewsByProductId(productId);
    setProductReviews(reviews);
  }, [productId, getReviewsByProductId]);

  return (
    <div className="product-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "star-filled" : "star-empty"}`}
        >
          &#9733;
        </span>
      ))}
      {showCount && (
        <span className="rating-count">
          (
          {productReviews?.length > 1
            ? `${productReviews.length} reviews`
            : `${productReviews.length} review`}
          )
        </span>
      )}
    </div>
  );
};
