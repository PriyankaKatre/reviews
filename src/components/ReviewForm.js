import { useState } from "react";
import "./styles/ReviewForm.css";

function ReviewForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    rating: 0,
    hoverRating: 0,
    title: "",
    comment: "",
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prevData) => ({
      ...prevData,
      rating,
    }));
  };

  const handleHoverRatingChange = (hoverRating) => {
    setFormData((prevData) => ({
      ...prevData,
      hoverRating,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (formData.rating === 0) newErrors.rating = "Please select a rating";
    if (!formData.title.trim()) newErrors.title = "Please enter a review title";
    if (!formData.comment.trim())
      newErrors.comment = "Please enter your review";
    if (!formData.name.trim()) newErrors.name = "Please enter your name";
    if (!formData.email.trim()) newErrors.email = "Please enter your email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the review
    onSubmit(formData);

    // Reset form
    setFormData({
      rating: 0,
      hoverRating: 0,
      title: "",
      comment: "",
      name: "",
      email: "",
    });
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
                star <= (formData.hoverRating || formData.rating)
                  ? "star-filled"
                  : "star-empty"
              }`}
              onMouseEnter={() => handleHoverRatingChange(star)}
              onMouseLeave={() => handleHoverRatingChange(0)}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </span>
          ))}
          <span className="rating-text">
            {formData.rating > 0
              ? `${formData.rating} out of 5 stars`
              : "Click to rate"}
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
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
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
          name="comment"
          value={formData.comment}
          onChange={handleChange}
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
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
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
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
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
