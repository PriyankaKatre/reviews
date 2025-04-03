import { useState } from "react";
import "./styles/ReviewForm.css";

function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (rating === 0) newErrors.rating = "Please select a rating";
    if (!title.trim()) newErrors.title = "Please enter a review title";
    if (!comment.trim()) newErrors.comment = "Please enter your review";
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!email.trim()) newErrors.email = "Please enter your email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the review
    onSubmit({
      name,
      rating,
      title,
      comment,
      email,
    });

    // Reset form
    setRating(0);
    setTitle("");
    setComment("");
    setName("");
    setEmail("");
    setErrors({});
  };
  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label htmlFor="rating" className="form-label">
          Rating <span className="required">*</span>
        </label>
        <div className="rating-selector">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`rating-star ${
                star <= (hoverRating || rating) ? "star-filled" : "star-empty"
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
          <span className="rating-text">
            {rating > 0 ? `${rating} out of 5 stars` : "Click to rate"}
          </span>
        </div>
        {errors.rating && <p className="error-message">{errors.rating}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Review Title <span className="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="form-input"
        />
        {errors.title && <p className="error-message">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="comment" className="form-label">
          Review <span className="required">*</span>
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike about this product?"
          rows={5}
          className="form-textarea"
        />
        {errors.comment && <p className="error-message">{errors.comment}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="form-input"
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (not published)"
            className="form-input"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          Submit Review
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
