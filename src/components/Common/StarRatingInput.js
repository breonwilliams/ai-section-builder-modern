import React, { useState } from 'react';

function StarRatingInput({ value = 5, onChange, label = 'Rating' }) {
  const [hoverRating, setHoverRating] = useState(null);
  
  const handleStarClick = (starIndex, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = clickX < starWidth / 2;
    
    const newRating = isLeftHalf ? starIndex - 0.5 : starIndex;
    onChange(newRating);
  };
  
  const handleStarHover = (starIndex, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = hoverX < starWidth / 2;
    
    const previewRating = isLeftHalf ? starIndex - 0.5 : starIndex;
    setHoverRating(previewRating);
  };
  
  const handleMouseLeave = () => {
    setHoverRating(null);
  };
  
  const renderStar = (starIndex) => {
    const displayRating = hoverRating !== null ? hoverRating : value;
    const isFilled = starIndex <= Math.floor(displayRating);
    const isHalf = starIndex === Math.ceil(displayRating) && displayRating % 1 !== 0;
    
    return (
      <button
        key={starIndex}
        type="button"
        className={`aisb-star-rating-input__star ${isFilled ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
        onClick={(e) => handleStarClick(starIndex, e)}
        onMouseMove={(e) => handleStarHover(starIndex, e)}
        title={`${starIndex} star${starIndex !== 1 ? 's' : ''}`}
      >
        {isFilled ? '★' : isHalf ? '★' : '☆'}
      </button>
    );
  };
  
  return (
    <div className="aisb-star-rating-input">
      <label className="aisb-form-label">{label}</label>
      <div className="aisb-star-rating-input__container">
        <div 
          className="aisb-star-rating-input__stars"
          onMouseLeave={handleMouseLeave}
        >
          {[1, 2, 3, 4, 5].map(renderStar)}
        </div>
        <span className="aisb-star-rating-input__value">
          {value} / 5
        </span>
      </div>
      <small className="aisb-form-help">
        Click left half of star for half rating, right half for full rating
      </small>
    </div>
  );
}

export default StarRatingInput;