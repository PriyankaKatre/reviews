import { createContext, useContext, useEffect, useState } from "react";
import { products } from "../data/products";

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error("useStore must be used within a ReviewProvider");
  }

  return context;
};

export const StoreProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    const storedReviews = localStorage.getItem("reviews");
    return storedReviews ? JSON.parse(storedReviews) : [];
  });

  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (review) => {
    setReviews((prev) => {
      const updatedReviews = [review, ...prev];
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
      return updatedReviews;
    });
  };

  const getReviewsByProductId = (productId, page = 1, limit = 5) => {
    const filteredItems = reviews.filter(
      (review) => review.productId === productId
    );
    return filteredItems;
  };

  const updateHelpfulVotes = (reviewId) => {
    setReviews((prev) => {
      const updatedReviews = prev.map((review) =>
        review.id === reviewId
          ? { ...review, helpfulVotes: review.helpfulVotes + 1 }
          : review
      );
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
      return updatedReviews;
    });
  };

  useEffect(() => {
    const ratings = products.reduce((acc, product) => {
      const productReviews = getReviewsByProductId(product.id);
      const avgRating =
        productReviews.length > 0
          ? productReviews.reduce((acc, review) => acc + review.rating, 0) /
            productReviews.length
          : 0;
      acc[product.id] = avgRating.toFixed(1);
      return acc;
    }, {});
    setAverageRatings(ratings);
  }, [reviews]);

  return (
    <StoreContext.Provider
      value={{
        reviews,
        addReview,
        getReviewsByProductId,
        updateHelpfulVotes,
        averageRatings,
        products,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
