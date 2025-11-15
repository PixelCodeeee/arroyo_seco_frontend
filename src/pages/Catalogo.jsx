import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, MapPin, Clock, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { oferentesAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/catalogo.css";

function Catalogo() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [oferentes, setOferentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");

  // Hero slides con imágenes diferentes
  const heroSlides = [
    { id: 1, image: "/images/tesoro.jpg", alt: "Arroyo Seco" },
    { id: 2, image: "/images/taco.png", alt: "Gastronomía Local" }
  ];

  useEffect(() => {
    fetchOferentes();
  }, []);

  const fetchOferentes = async () => {
    try {
      setLoading(true);
      const response = await oferentesAPI.getAll({ estado: "aprobado" });
      setOferentes(response.oferentes || []);
      setError("");
    } catch (err) {
      console.error("Error fetching oferentes:", err);
      setError("Error al cargar los oferentes. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOferentes = () => {
    let filtered = oferentes;

    if (tipoFilter !== "todos") {
      filtered = filtered.filter(o => o.tipo === tipoFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.nombre_negocio.toLowerCase().includes(query) ||
        o.direccion?.toLowerCase().includes(query) ||
        o.tipo.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getRestaurantes = () => {
    return getFilteredOferentes().filter(o => o.tipo === "restaurante");
  };

  const getArtesanias = () => {
    return getFilteredOferentes().filter(o => o.tipo === "artesanal");
  };

  const handlePrevSlide = () => {
    setCurrentHeroSlide((prev) => 
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentHeroSlide((prev) => 
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );
  };

  const handleCardClick = (oferenteId) => {
    navigate(`/oferente/${oferenteId}`);
  };

  const getHorarioDisplay = (horario) => {
    if (!horario || typeof horario !== 'object') return "Horario no disponible";
    
    const { horario_apertura, horario_cierre, dias } = horario;
    
    if (horario_apertura && horario_cierre) {
      return `${horario_apertura} - ${horario_cierre}`;
    }
    
    if (dias && dias.length > 0) {
      return dias.length === 7 ? "Todos los días" : `${dias.length} días`;
    }
    
    return "Horario disponible";
  };

  const renderOferenteCard = (oferente) => (
    <div 
      key={oferente.id_oferente} 
      className="Catalogo-card"
      onClick={() => handleCardClick(oferente.id_oferente)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-images single">
        <div className="card-image-wrapper">
          <img 
            src={oferente.imagen || "/images/placeholder.png"} 
            alt={oferente.nombre_negocio}
            onError={(e) => {
              e.target.src = oferente.tipo === "restaurante" 
                ? "/images/taco.png" 
                : "/images/artesania1.png";
            }}
          />
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <div className="card-info">
            <h3>{oferente.nombre_negocio}</h3>
            <p className="card-type">
              {oferente.tipo === "restaurante" ? "Gastronomía" : "Artesanía"}
            </p>
          </div>
        </div>

        <div className="card-details">
          {oferente.direccion && (
            <div className="detail-item">
              <MapPin size={14} />
              <span>{oferente.direccion}</span>
            </div>
          )}
          
          {oferente.horario_disponibilidad && (
            <div className="detail-item">
              <Clock size={14} />
              <span>{getHorarioDisplay(oferente.horario_disponibilidad)}</span>
            </div>
          )}
          
          {oferente.telefono && (
            <div className="detail-item">
              <Phone size={14} />
              <span>{oferente.telefono}</span>
            </div>
          )}
        </div>
        
        <button className="btn-detail" onClick={(e) => {
          e.stopPropagation();
          handleCardClick(oferente.id_oferente);
        }}>
          Ver Detalle
        </button>
      </div>
    </div>
  );

  const restaurantes = getRestaurantes();
  const artesanias = getArtesanias();
  const showingAll = tipoFilter === "todos";

  return (
    <div className="Catalogo-page">
      <Navbar />
      <div style={{ height: '80px', width: '100%' }}></div>

      {/* Hero Section - Selección Semanal */}
      <section className="Catalogo-hero">
        <div className="hero-container">
          <div className="hero-text">
            <h1>Nuestra selección Semanal</h1>
            <p>
              Descubre lo mejor de Arroyo Seco. Desde deliciosa gastronomía local hasta 
              artesanías únicas hechas a mano. Explora nuestros negocios destacados y 
              encuentra experiencias auténticas que celebran nuestra cultura y tradición.
            </p>
          </div>
          
          <div className="hero-carousel-wrapper">
            <div className="hero-carousel">
              {heroSlides.length > 1 && (
                <button className="hero-carousel-btn prev" onClick={handlePrevSlide}>
                  <ChevronLeft size={28} />
                </button>
              )}
              
              <div className="hero-images-container">
                <div className="hero-image-wrapper">
                  <img 
                    src={heroSlides[currentHeroSlide].image} 
                    alt={heroSlides[currentHeroSlide].alt}
                    onError={(e) => {
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
              </div>
              
              {heroSlides.length > 1 && (
                <button className="hero-carousel-btn next" onClick={handleNextSlide}>
                  <ChevronRight size={28} />
                </button>
              )}
            </div>
            
            {heroSlides.length > 1 && (
              <div className="hero-dots">
                {heroSlides.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentHeroSlide ? "active" : ""}`}
                    onClick={() => setCurrentHeroSlide(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar negocios en Arroyo Seco..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${tipoFilter === "todos" ? "active" : ""}`}
            onClick={() => setTipoFilter("todos")}
          >
            Todos ({oferentes.length})
          </button>
          <button 
            className={`filter-tab ${tipoFilter === "restaurante" ? "active" : ""}`}
            onClick={() => setTipoFilter("restaurante")}
          >
            Gastronomía ({oferentes.filter(o => o.tipo === "restaurante").length})
          </button>
          <button 
            className={`filter-tab ${tipoFilter === "artesanal" ? "active" : ""}`}
            onClick={() => setTipoFilter("artesanal")}
          >
            Artesanías ({oferentes.filter(o => o.tipo === "artesanal").length})
          </button>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando oferentes...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchOferentes} className="btn-retry">
            Reintentar
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && oferentes.length === 0 && (
        <div className="empty-state">
          <p>No hay oferentes disponibles en este momento.</p>
        </div>
      )}

      {/* No Results State */}
      {!loading && !error && oferentes.length > 0 && getFilteredOferentes().length === 0 && (
        <div className="empty-state">
          <Search size={48} />
          <p>No se encontraron resultados para "{searchQuery}"</p>
          <button onClick={() => setSearchQuery("")} className="btn-clear">
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* Content Sections */}
      {!loading && !error && (
        <>
          {/* Restaurantes Section */}
          {(showingAll || tipoFilter === "restaurante") && restaurantes.length > 0 && (
            <section className="Catalogo-section">
              <div className="Catalogo-content">
                <div className="section-header">
                  <h2>Gastronomía</h2>
                  {showingAll && restaurantes.length > 4 && (
                    <button 
                      className="view-all"
                      onClick={() => setTipoFilter("restaurante")}
                    >
                      Ver todos
                    </button>
                  )}
                </div>
                
                <div className="cards-grid">
                  {(showingAll ? restaurantes.slice(0, 4) : restaurantes).map(renderOferenteCard)}
                </div>
              </div>
            </section>
          )}

          {/* Artesanías Section */}
          {(showingAll || tipoFilter === "artesanal") && artesanias.length > 0 && (
            <section className="Catalogo-section">
              <div className="Catalogo-content">
                <div className="section-header">
                  <h2>Artesanías</h2>
                  {showingAll && artesanias.length > 2 && (
                    <button 
                      className="view-all"
                      onClick={() => setTipoFilter("artesanal")}
                    >
                      Ver todos
                    </button>
                  )}
                </div>
                
                <div className="cards-grid">
                  {(showingAll ? artesanias.slice(0, 4) : artesanias).map(renderOferenteCard)}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

export default Catalogo;