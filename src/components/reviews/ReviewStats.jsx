// src/components/reviews/ReviewStats.jsx
import React from 'react';
import '../../styles/reviews/ReviewStats.css';

const ReviewStats = ({ stats }) => {
    if (!stats) return null;

    const { total_reviews, avg_rating, verified_reviews, rating_distribution } = stats;

    return (
        <div className="review-stats">
            <div className="stats-summary">
                <div className="stat-item">
                    <span className="stat-value">{total_reviews}</span>
                    <span className="stat-label">Reseñas</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{avg_rating.toFixed(1)}</span>
                    <span className="stat-label">Promedio</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{verified_reviews}</span>
                    <span className="stat-label">Verificadas</span>
                </div>
            </div>

            <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="distribution-row">
                        <span className="rating-label">{rating} ★</span>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ 
                                    width: `${total_reviews ? 
                                        (rating_distribution[rating] / total_reviews) * 100 : 0}%` 
                                }}
                            />
                        </div>
                        <span className="rating-count">{rating_distribution[rating]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewStats;