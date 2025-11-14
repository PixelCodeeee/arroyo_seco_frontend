import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/OferenteDetail.css";

function OferenteDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Placeholder images array
  const restaurantImages = [
    "/images/pan.png",
    "/images/taco.png",
    "/images/pan.png"
  ];

  // Placeholder menu items
  const menuItems = [
    { id: 1, name: "Platillo", description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.", price: 149.00 },
    { id: 2, name: "Platillo", description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.", price: 149.00 },
    { id: 3, name: "Platillo", description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.", price: 149.00 },
    { id: 4, name: "Platillo", description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.", price: 149.00 },
    { id: 5, name: "Platillo", description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.", price: 149.00 },
    { id: 6, name: "Platillo", description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.", price: 149.00 }
  ];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? restaurantImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === restaurantImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="restaurant-detail-page">
      <Navbar />

      {/* Restaurant Hero Section */}
      <section className="restaurant-hero">
        <div className="restaurant-info-text">
          <h1>Restaurante</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <div className="restaurant-actions">
            <button className="btn-primary">Reservar</button>
            <button className="btn-secondary">Mas detalles</button>
          </div>
        </div>

        <div className="restaurant-carousel">
          <button className="carousel-btn prev" onClick={handlePrevImage}>
            <ChevronLeft size={32} />
          </button>
          
          <div className="carousel-image">
            <img src={restaurantImages[currentImageIndex]} alt="Restaurant dish" />
          </div>
          
          <button className="carousel-btn next" onClick={handleNextImage}>
            <ChevronRight size={32} />
          </button>
          
          <div className="carousel-dots">
            {restaurantImages.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImageIndex ? "active" : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section">
        <h2>Menú</h2>
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <div className="menu-item-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="menu-item-footer">
                  <span className="price">${item.price.toFixed(2)}</span>
                  <button className="btn-add">Añadir</button>
                </div>
              </div>
              <div className="menu-item-image">
                <img src="/images/pan.png" alt={item.name} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant Details Section */}
      <section className="restaurant-details-section">
        <div className="details-info">
          <h3>Restaurante</h3>
          <div className="detail-item">
            <span className="detail-label">Comida mexicana</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Abierto</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Dirección</span>
            <p>Calle Independencia #340<br />Col. Colonia - Arroyo Seco</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Horarios</span>
            <p>Lunes a Sábado<br />08:00 - 22:00</p>
          </div>
        </div>
        
        <div className="map-container">
          <img src="/images/map.png" alt="Restaurant location map" />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default OferenteDetail;