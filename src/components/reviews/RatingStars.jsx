// src/components/reviews/RatingStars.jsx
import React from 'react';

const RatingStars = ({ rating, onRatingChange, readonly = false }) => {
    const handleClick = (index) => {
        if (!readonly && onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    return (
        <div className="rating-stars" style={{ display: 'flex', gap: '5px' }}>
            {[0, 1, 2, 3, 4].map((index) => (
                <span
                    key={index}
                    onClick={() => handleClick(index)}
                    style={{
                        cursor: readonly ? 'default' : 'pointer',
                        fontSize: '2rem',
                        color: index < rating ? '#FFD700' : '#ccc',
                        transition: 'color 0.2s'
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default RatingStars;