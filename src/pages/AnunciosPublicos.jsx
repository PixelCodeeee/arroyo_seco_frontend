import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AnunciosPublicos.css';

function AnunciosPublicos() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    try {
      const data = await announcementsAPI.getAll();
      setAnuncios(data || []);
    } catch {
      console.error('Error al cargar anuncios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anuncios-page">
      <Navbar />

      {/* Hero */}
      <section className="anuncios-hero">
        <h1>Eventos y <span>Festividades</span></h1>
        <p>Descubre lo que Arroyo Seco tiene para ti</p>
      </section>

      {/* Lista de anuncios */}
      <section className="anuncios-lista">
        {loading ? (
          <div className="anuncios-loading">Cargando eventos...</div>
        ) : anuncios.length === 0 ? (
          <div className="anuncios-empty">No hay eventos disponibles por ahora.</div>
        ) : (
          anuncios.map((anuncio, index) => (
            <div
              key={anuncio.id}
              className={`anuncio-item ${index % 2 === 0 ? 'imagen-izquierda' : 'imagen-derecha'}`}
            >
              <div className="anuncio-imagen">
                {anuncio.image_url ? (
                  <img src={anuncio.image_url} alt={anuncio.title} />
                ) : (
                  <div className="anuncio-imagen-placeholder">📢</div>
                )}
              </div>
              <div className="anuncio-info">
                {anuncio.event_date && (
                  <span className="anuncio-fecha">
                    🗓️ {new Date(anuncio.event_date).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
                <h2>{anuncio.title}</h2>
                <p>{anuncio.description}</p>
              </div>
            </div>
          ))
        )}
      </section>

      <Footer />
    </div>
  );
}

export default AnunciosPublicos;