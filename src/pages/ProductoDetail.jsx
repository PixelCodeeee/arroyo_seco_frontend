// src/pages/ProductoDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productosAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useReviews } from "../hooks/useReviews";
import Layout from "../components/Layout";
import ReviewList from "../components/reviews/ReviewList";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewStats from "../components/reviews/ReviewStats";
import "../styles/ProductoDetail.css";

function ProductoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const {
    reviews,
    stats,
    loading: loadingReviews,
    error: reviewsError,
    pagination,
    fetchProductoReviews,
    createReview
  } = useReviews();

  useEffect(() => {
    loadProducto();
    fetchProductoReviews(id);
  }, [id]);

  const loadProducto = async () => {
    try {
      const data = await productosAPI.getById(id);
      setProducto(data);
    } catch (error) {
      console.error("Error loading producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (reviewData) => {
    await createReview(reviewData);
    setShowReviewForm(false);
    fetchProductoReviews(id);
  };

  if (loading) return <Layout><div>Cargando...</div></Layout>;

  return (
    <Layout>
      <div className="producto-detail-page">
        {/* Información del producto (ya existente) */}
        
        {/* SECCIÓN DE RESEÑAS */}
        <section className="producto-resenas-section">
          <h2>Reseñas del Producto</h2>
          
          {user?.rol === 'turista' && !showReviewForm && (
            <button onClick={() => setShowReviewForm(true)}>
              Escribir reseña
            </button>
          )}
          
          {showReviewForm && (
            <ReviewForm
              onSubmit={handleCreateReview}
              onCancel={() => setShowReviewForm(false)}
              targetType="producto"
              targetId={id}
            />
          )}
          
          <ReviewStats stats={stats} />
          
          <ReviewList
            reviews={reviews}
            loading={loadingReviews}
            error={reviewsError}
            pagination={pagination}
          />
        </section>
      </div>
    </Layout>
  );
}

export default ProductoDetail;