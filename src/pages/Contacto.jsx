import React from "react";
import { Link } from "react-router-dom";
import "../styles/Contact.css";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GoogleMapComponent from "../components/GoogleMap";

function Contact() {
  return (
    <div className="contact-page">
      <Navbar />

      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-overlay">
          <h1>
            <span>Contáctanos</span>
          </h1>
          <p>Estamos aquí para ayudarte a descubrir Arroyo Seco</p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-intro">
            <h2>
              ¿Tienes <span>Preguntas?</span>
            </h2>
            <p>
              Nuestro equipo está disponible para ayudarte con cualquier consulta
              sobre servicios, productos o experiencias en Arroyo Seco.
            </p>
          </div>

          <div className="contact-cards">
            {/* Ubicación */}
            <div className="contact-card">
              <div className="contact-icon">
                <MapPin size={32} />
              </div>
              <h3>Ubicación</h3>
              <p>Centro de Arroyo Seco</p>
              <p>Querétaro, México</p>
              <p className="contact-detail">76745</p>
            </div>

            {/* Teléfono */}
            <div className="contact-card">
              <div className="contact-icon">
                <Phone size={32} />
              </div>
              <h3>Teléfono</h3>
              <p>+52 (442) 123 4567</p>
              <p className="contact-detail">Lun - Vie: 9:00 AM - 6:00 PM</p>
            </div>

            {/* Email */}
            <div className="contact-card">
              <div className="contact-icon">
                <Mail size={32} />
              </div>
              <h3>Email</h3>
              <p>info@arroyoseco.com</p>
              <p className="contact-detail">Respuesta en 24 horas</p>
            </div>

            {/* Horarios */}
            <div className="contact-card">
              <div className="contact-icon">
                <Clock size={32} />
              </div>
              <h3>Horarios</h3>
              <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
              <p>Sábado: 10:00 AM - 4:00 PM</p>
              <p className="contact-detail">Domingo: Cerrado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container-wrapper">
          <h2>
            <span>Encuéntranos</span>
          </h2>
          <div className="contact-map-container">
            <GoogleMapComponent 
              ubicacion="Arroyo Seco, Querétaro, México"
              nombreNegocio="Arroyo Seco"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta-section">
        <div className="contact-cta-content">
          <h2>
            ¿Listo para <span>Explorar?</span>
          </h2>
          <p>
            Descubre todo lo que Arroyo Seco tiene para ofrecerte
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">
              Regístrate
            </Link>
            <Link to="/" className="btn-secondary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;