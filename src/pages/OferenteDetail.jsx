// src/pages/OferenteDetail.jsx

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { oferentesAPI, productosAPI } from "../services/api";
import { addToCart, replaceCartWithNewOferente, isProductInCart, getProductQuantity } from "../utils/cartUtils";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GoogleMapComponent from "../components/GoogleMap";
import ReservaModal from "../components/ReservaModal";
import CartConfirmModal from "../components/CartConfirmModal";
import { useAuth } from "../hooks/useAuth";
import { useReviews } from "../hooks/useReviews";
import ReviewList from "../components/reviews/ReviewList";
import ReviewStats from "../components/reviews/ReviewStats";
import ReviewForm from "../components/reviews/ReviewForm";
import "../styles/OferenteDetail.css";

function OferenteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [oferente, setOferente] = useState(null);
  const [productos, setProductos] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReservaModalOpen, setIsReservaModalOpen] = useState(false);
  const [isCartConfirmOpen, setIsCartConfirmOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [cartConflictData, setCartConflictData] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const { user } = useAuth();

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const userId = user?.id_usuario || user?.id;

  useEffect(() => {
    fetchOferenteData();
  }, [id]);

  const { 
    reviews, 
    stats,
    loading: loadingReviews, 
    error: reviewsError,
    pagination,
    fetchOferenteReviews,
    createReview,
    updateReview,
    deleteReview,
    createResponse
  } = useReviews();

  useEffect(() => {
    fetchOferenteReviews(id);
  }, [id]);

  // Verificar si el usuario ya tiene reseña en este oferente
  useEffect(() => {
    if (reviews && userId) {
      const userReview = reviews.find(review => review.id_usuario === userId);
      setHasUserReviewed(!!userReview);
    }
  }, [reviews, userId]);

  // Filtrar las reseñas para NO mostrar las del usuario actual
  const filteredReviews = reviews?.filter(review => review.id_usuario !== userId) || [];

  const fetchOferenteData = async () => {
    try {
      setLoading(true);
      
      const oferenteData = await oferentesAPI.getById(id);
      console.log("Oferente data:", oferenteData);
      setOferente(oferenteData);
      
      try {
        const productosRes = await productosAPI.getByOferenteId(id);
        console.log("Productos data:", productosRes);
        setProductos(productosRes.productos || []);
      } catch (prodError) {
        console.error("Error fetching productos:", prodError);
        setProductos([]);
      }
      
      setError("");
    } catch (err) {
      console.error("Error fetching oferente:", err);
      setError("Error al cargar la información del oferente");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (producto) => {
    if (!oferente) return;

    try {
      const result = addToCart(producto, oferente);

      if (result.success) {
        alert(result.message);
      } else if (result.requiresConfirmation) {
        setPendingProduct(producto);
        setCartConflictData({
          currentOferente: result.currentOferente,
          newOferente: result.newOferente
        });
        setIsCartConfirmOpen(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito: ' + error.message);
    }
  };

  const handleConfirmCartReplace = () => {
    if (pendingProduct && oferente) {
      try {
        const result = replaceCartWithNewOferente(pendingProduct, oferente);
        if (result.success) {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error replacing cart:', error);
        alert('Error al actualizar el carrito');
      }
    }
    setIsCartConfirmOpen(false);
    setPendingProduct(null);
    setCartConflictData(null);
  };

  const handleCancelCartReplace = () => {
    setIsCartConfirmOpen(false);
    setPendingProduct(null);
    setCartConflictData(null);
  };

  const handleReservaClick = () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para hacer una reserva');
      navigate('/login');
      return;
    }
    setIsReservaModalOpen(true);
  };

  const handleReservaSuccess = () => {
    console.log('Reserva creada exitosamente');
    setIsReservaModalOpen(false);
  };

  const handlePrevImage = () => {
    const images = getImagenes();
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    const images = getImagenes();
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const getImagenes = () => {
    if (!oferente) return ["/images/placeholder.png"];
    
    if (oferente.imagen && oferente.imagen !== "null" && oferente.imagen !== "") {
      return [oferente.imagen];
    }
    
    return [oferente.tipo === "restaurante" 
      ? "/images/taco.png" 
      : "/images/artesania1.png"
    ];
  };

  const getHorarioDisplay = () => {
    if (!oferente?.horario_disponibilidad) return "Horario no disponible";
    
    const horario = oferente.horario_disponibilidad;
    
    if (horario.horario_apertura && horario.horario_cierre) {
      return `${horario.horario_apertura} - ${horario.horario_cierre}`;
    }
    
    if (horario.dias && horario.dias.length > 0) {
      const diasTexto = horario.dias.join(", ");
      return `${diasTexto}\n${horario.horario_apertura || ''} - ${horario.horario_cierre || ''}`;
    }
    
    return "Horario disponible";
  };

  const getTipoTexto = () => {
    if (!oferente) return "";
    return oferente.tipo === "restaurante" ? "Restaurante" : "Artesanía";
  };

  const handlePageChange = (newPage) => {
    fetchOferenteReviews(id, newPage);
  };

  if (loading) {
    return (
      <div className="restaurant-detail-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando información...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !oferente) {
    return (
      <div className="restaurant-detail-page">
        <Navbar />
        <div className="error-container">
          <p className="error-message">{error || "Oferente no encontrado"}</p>
          <button onClick={() => navigate('/catalogo')} className="btn-retry">
            Volver al Catálogo
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const imagenes = getImagenes();
  const imagenPorDefecto = oferente.tipo === "restaurante" 
    ? "/images/taco.png" 
    : "/images/artesania1.png";

  return (
    <div className="restaurant-detail-page">
      <Navbar />

      {/* Hero Section */}
      <section className="restaurant-hero">
        <div className="restaurant-info-text">
          <h1>{oferente.nombre_negocio}</h1>
          <p>
            {oferente.descripcion || `Bienvenido a ${oferente.nombre_negocio}. Descubre nuestra oferta de productos y servicios de calidad.`}
          </p>
          <div className="restaurant-actions">
            {oferente.tipo === "restaurante" && (
              <button className="btn-primary" onClick={handleReservaClick}>
                Reservar
              </button>
            )}
            <button className="btn-secondary">Más detalles</button>
          </div>
        </div>

        <div className="restaurant-carousel">
          {imagenes.length > 1 && (
            <button className="carousel-btn prev" onClick={handlePrevImage}>
              <ChevronLeft size={32} />
            </button>
          )}
          
          <div className="carousel-image">
            <img 
              src={imagenes[currentImageIndex]} 
              alt={oferente.nombre_negocio}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = imagenPorDefecto;
              }}
            />
          </div>
          
          {imagenes.length > 1 && (
            <button className="carousel-btn next" onClick={handleNextImage}>
              <ChevronRight size={32} />
            </button>
          )}
          
          {imagenes.length > 1 && (
            <div className="carousel-dots">
              {imagenes.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Menu/Products Section */}
      <section className="menu-section">
        <h2>{oferente.tipo === "restaurante" ? "Menú" : "Catálogo"}</h2>
        {productos.length > 0 ? (
          <div className="menu-grid">
            {productos.map((producto) => {
              let productImagenes = [];
              try {
                if (typeof producto.imagenes === 'string') {
                  productImagenes = JSON.parse(producto.imagenes);
                } else if (Array.isArray(producto.imagenes)) {
                  productImagenes = producto.imagenes;
                }
              } catch (e) {
                console.error('Error parsing product images:', e);
                productImagenes = [];
              }
              
              const primeraImagen = (productImagenes[0] && productImagenes[0] !== "null" && productImagenes[0] !== "") 
                ? productImagenes[0] 
                : imagenPorDefecto;
              
              const precio = typeof producto.precio === 'number' 
                ? producto.precio 
                : parseFloat(producto.precio) || 0;

              const inCart = isProductInCart(producto.id_producto);
              const quantity = getProductQuantity(producto.id_producto);

              return (
                <div key={producto.id_producto} className="menu-item">
                  <div className="menu-item-content">
                    <h3>{producto.nombre}</h3>
                    <p>{producto.descripcion || "Producto disponible"}</p>
                    <div className="menu-item-footer">
                      <span className="price">${precio.toFixed(2)}</span>
                      <button 
                        className={`btn-add ${inCart ? 'in-cart' : ''}`}
                        onClick={() => handleAddToCart(producto)}
                      >
                        {inCart ? `En carrito (${quantity})` : 'Añadir'}
                      </button>
                    </div>
                  </div>
                  <div className="menu-item-image">
                    <img 
                      src={primeraImagen} 
                      alt={producto.nombre}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imagenPorDefecto;
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No hay productos disponibles en este momento.</p>
          </div>
        )}
      </section>

     {/* ===== SECCIÓN DE RESEÑAS MODIFICADA ===== */}
{/* ===== SECCIÓN DE RESEÑAS MODIFICADA ===== */}
<section className="resenas-section">
    <div className="resenas-header">
        <h2>Reseñas del Negocio</h2>
        {user?.rol === 'turista' && !showReviewForm && (
            <button 
                onClick={() => setShowReviewForm(true)} 
                className="btn-escribir-resena"
            >
                ✍️ Escribir reseña
            </button>
        )}
    </div>

    {showReviewForm && (
        <ReviewForm
            onSubmit={async (reviewData) => {
                console.log('🚀 Enviando review desde OferenteDetail:', reviewData);
                try {
                    const result = await createReview(reviewData);
                    console.log('✅ Review creada:', result);
                    setShowReviewForm(false);
                    fetchOferenteReviews(id);
                } catch (error) {
                    console.error('❌ Error al crear review:', error);
                    alert('Error al crear la reseña: ' + error.message);
                }
            }}
            onCancel={() => setShowReviewForm(false)}
            targetType="oferente"
            targetId={id}
        />
    )}

    {/* <ReviewStats stats={stats} /> */}

    {/* Mostrar SOLO reseñas de OTROS usuarios */}
    <ReviewList
        reviews={filteredReviews}
        loading={loadingReviews}
        error={reviewsError}
        pagination={pagination}
        onPageChange={handlePageChange}
        onUpdate={updateReview}
        onDelete={deleteReview}
        onRespond={createResponse}
    />

{user?.rol === 'turista' && hasUserReviewed && (
  <div className="mis-resenas-banner">
    <div className="banner-content">
      <div className="banner-icon">📝</div>
      <div className="banner-text-group">
        <div className="banner-title">¡Ya has escrito una reseña!</div>
        <div className="banner-subtitle">Puedes verla y editarla desde tu perfil</div>
      </div>
    </div>
  </div>
)}
</section>
      {/* Restaurant Details and Map Section */}
      <section className="restaurant-details-section">
        <div className="details-info">
          <h3>{getTipoTexto()}</h3>
          
          <div className="detail-item">
            <span className="detail-label">Tipo</span>
            <p>{oferente.tipo === "restaurante" ? "Gastronomía" : "Artesanía"}</p>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Estado</span>
            <p>{oferente.estado === "aprobado" ? "Abierto" : "Cerrado"}</p>
          </div>
          
          {oferente.direccion && (
            <div className="detail-item">
              <span className="detail-label">Dirección</span>
              <p>{oferente.direccion}</p>
            </div>
          )}
          
          {oferente.telefono && (
            <div className="detail-item">
              <span className="detail-label">Teléfono</span>
              <p>{oferente.telefono}</p>
            </div>
          )}
          
          {oferente.horario_disponibilidad && (
            <div className="detail-item">
              <span className="detail-label">Horarios</span>
              <p style={{ whiteSpace: 'pre-line' }}>{getHorarioDisplay()}</p>
            </div>
          )}
        </div>
        
        <div className="map-container">
          <GoogleMapComponent 
            ubicacion={oferente.ubicacion || oferente.direccion || "Ciudad de México"}
            nombreNegocio={oferente.nombre_negocio}
          />
        </div>
      </section>

      {/* Reserva Modal */}
      <ReservaModal
        oferente={oferente}
        isOpen={isReservaModalOpen}
        onClose={() => setIsReservaModalOpen(false)}
        onSuccess={handleReservaSuccess}
      />

      {/* Cart Confirmation Modal */}
      <CartConfirmModal
        isOpen={isCartConfirmOpen}
        onClose={handleCancelCartReplace}
        onConfirm={handleConfirmCartReplace}
        currentOferente={cartConflictData?.currentOferente}
        newOferente={cartConflictData?.newOferente}
      />

      <Footer />
    </div>
  );
}

export default OferenteDetail;
// MODIFICADO2: