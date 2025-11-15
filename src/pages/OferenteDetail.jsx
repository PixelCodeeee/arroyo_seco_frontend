import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { oferentesAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/OferenteDetail.css";

function OferenteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [oferente, setOferente] = useState(null);
  const [productos, setProductos] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOferenteData();
  }, [id]);

  const fetchOferenteData = async () => {
    try {
      setLoading(true);
      
      // Obtener datos del oferente
      const oferenteData = await oferentesAPI.getById(id);
      console.log("Oferente data:", oferenteData);
      setOferente(oferenteData);
      
      // Obtener productos del oferente - con mejor manejo de errores
      try {
        const response = await fetch(`http://localhost:5000/api/productos/oferente/${id}`);
        
        // Si la respuesta no es OK (404, 500, etc)
        if (!response.ok) {
          console.warn(`Productos endpoint devolvió ${response.status}`);
          setProductos([]); // Dejar productos vacío
        } else {
          const productosData = await response.json();
          console.log("Productos data:", productosData);
          
          if (productosData.success && productosData.productos) {
            setProductos(productosData.productos);
          } else {
            setProductos([]);
          }
        }
      } catch (prodError) {
        console.error("Error fetching productos:", prodError);
        setProductos([]); // Continuar sin productos
      }
      
      setError("");
    } catch (err) {
      console.error("Error fetching oferente:", err);
      setError("Error al cargar la información del oferente");
    } finally {
      setLoading(false);
    }
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
    
    // Si hay imagen del oferente, usarla
    if (oferente.imagen) {
      return [oferente.imagen];
    }
    
    // Placeholder según tipo
    return [oferente.tipo === "restaurante" ? "/images/taco.png" : "/images/artesania1.png"];
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
              <button className="btn-primary">Reservar</button>
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
                e.target.src = oferente.tipo === "restaurante" 
                  ? "/images/taco.png" 
                  : "/images/artesania1.png";
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
      {productos.length > 0 ? (
        <section className="menu-section">
          <h2>{oferente.tipo === "restaurante" ? "Menú" : "Catálogo"}</h2>
          <div className="menu-grid">
            {productos.map((producto) => {
              // Parsear imágenes si es JSON string
              let productImagenes = [];
              try {
                if (typeof producto.imagenes === 'string') {
                  productImagenes = JSON.parse(producto.imagenes);
                } else if (Array.isArray(producto.imagenes)) {
                  productImagenes = producto.imagenes;
                } else if (producto.imagen) {
                  // Soporte para campo "imagen" singular
                  productImagenes = Array.isArray(producto.imagen) 
                    ? producto.imagen 
                    : [producto.imagen];
                }
              } catch (e) {
                console.error('Error parsing product images:', e);
                productImagenes = [];
              }
              
              const primeraImagen = productImagenes[0] || "/images/placeholder.png";

              // Asegurar que precio es un número
              const precio = typeof producto.precio === 'number' 
                ? producto.precio 
                : parseFloat(producto.precio) || 0;

              return (
                <div key={producto.id_producto} className="menu-item">
                  <div className="menu-item-content">
                    <h3>{producto.nombre}</h3>
                    <p>{producto.descripcion || "Producto disponible"}</p>
                    <div className="menu-item-footer">
                      <span className="price">${precio.toFixed(2)}</span>
                      <button className="btn-add">Añadir</button>
                    </div>
                  </div>
                  <div className="menu-item-image">
                    <img 
                      src={primeraImagen} 
                      alt={producto.nombre}
                      onError={(e) => {
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="menu-section">
          <h2>{oferente.tipo === "restaurante" ? "Menú" : "Catálogo"}</h2>
          <div className="empty-state">
            <p>No hay productos disponibles en este momento.</p>
          </div>
        </section>
      )}

      {/* Details Section */}
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
          <img src="/images/map.png" alt="Ubicación" />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default OferenteDetail;