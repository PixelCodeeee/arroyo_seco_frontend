import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Recomendaciones.css";
import {
  Utensils,
  Scissors,
  AlertTriangle,
  Users,
  ShoppingCart,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function Recomendaciones() {
  const [tab, setTab] = useState("restaurantes");
  const [topServicios, setTopServicios] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resServicios, resProductos] = await Promise.all([
          fetch(`${API_URL}/reservas/recomendaciones/top-servicios?limit=10`),
          fetch(`${API_URL}/pedidos/recomendaciones/top-productos?limit=10`),
        ]);
        const dataServicios = await resServicios.json();
        const dataProductos = await resProductos.json();
        setTopServicios(dataServicios.servicios || []);
        setTopProductos(dataProductos.productos || []);
      } catch {
        setError("No se pudieron cargar las recomendaciones.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRankClass = (index) => {
    if (index === 0) return "gold";
    if (index === 1) return "silver";
    if (index === 2) return "bronze";
    return "";
  };

  const getImageUrl = (imagenes) => {
    if (!imagenes) return null;
    const imgs = Array.isArray(imagenes) ? imagenes : [];
    return imgs.length > 0 ? imgs[0] : null;
  };

  const lista = tab === "restaurantes" ? topServicios : topProductos;

  return (
    <div className="recomendaciones-page">
      <Navbar />

      {/* Hero */}
      <section className="recomendaciones-hero">
        <h1>Lo Más Popular</h1>
        <p>
          Descubre los restaurantes y artesanías más visitados de Arroyo Seco,
          elegidos por nuestra comunidad esta semana.
        </p>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${tab === "restaurantes" ? "active" : ""}`}
            onClick={() => setTab("restaurantes")}
          >
            <Utensils size={18} /> Restaurantes
          </button>
          <button
            className={`filter-tab ${tab === "artesanias" ? "active" : ""}`}
            onClick={() => setTab("artesanias")}
          >
            <Scissors size={18} /> Artesanías
          </button>
        </div>
      </section>

      {/* Cards */}
      <section className="recomendaciones-section">
        <div className="recomendaciones-content">
          <div className="section-header">
            <h2>
              {tab === "restaurantes" ? "Top Restaurantes" : "Top Artesanías"}
            </h2>
            <span className="section-badge">Últimos 30 días</span>
          </div>

          {loading && (
            <div className="rec-loading">
              <div className="rec-loading-spinner"></div>
              <p>Cargando recomendaciones...</p>
            </div>
          )}

          {error && (
            <div className="rec-empty">
              <div className="rec-empty-icon">
                <AlertTriangle size={48} />
              </div>
              <h3>{error}</h3>
            </div>
          )}

          {!loading && !error && lista.length === 0 && (
            <div className="rec-empty">
              <div className="rec-empty-icon">
                {tab === "restaurantes" ? (
                  <Utensils size={48} />
                ) : (
                  <Scissors size={48} />
                )}
              </div>
              <h3>Aún no hay datos suficientes</h3>
              <p>
                ¡Sé el primero en{" "}
                {tab === "restaurantes" ? "reservar" : "comprar"}!
              </p>
            </div>
          )}

          {!loading && !error && lista.length > 0 && (
            <div className="recomendaciones-grid">
              {lista.map((item, index) => {
                const imagen =
                  tab === "restaurantes"
                    ? getImageUrl(item.imagenes)
                    : getImageUrl(item.imagenes);

                return (
                  <div
                    className="rec-card"
                    key={item.id_servicio || item.id_producto}
                  >
                    {/* Rank badge */}
                    <div className={`rec-card-rank ${getRankClass(index)}`}>
                      {index + 1}
                    </div>

                    {/* Imagen */}
                    <div className="rec-card-image">
                      {imagen ? (
                        <img
                          src={imagen}
                          alt={item.nombre_servicio || item.nombre_producto}
                        />
                      ) : (
                        <div className="rec-card-image-placeholder">
                          {tab === "restaurantes" ? (
                            <Utensils size={32} />
                          ) : (
                            <Scissors size={32} />
                          )}
                        </div>
                      )}

                      {/* Stats sobre la imagen */}
                      <div className="rec-card-stats">
                        {tab === "restaurantes" ? (
                          <>
                            <Users size={14} />{" "}
                            {item.total_visitantes ?? item.total_reservas}{" "}
                            personas
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={14} /> {item.total_vendido}{" "}
                            vendidos
                          </>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="rec-card-body">
                      <p className="rec-card-tipo">
                        {tab === "restaurantes"
                          ? "Restaurante"
                          : item.tipo_oferente || "Artesanía"}
                      </p>
                      <h3>
                        {tab === "restaurantes"
                          ? item.nombre_servicio
                          : item.nombre_producto}
                      </h3>
                      <p className="rec-card-negocio">
                        📍 {item.nombre_negocio}
                      </p>

                      <div className="rec-card-info">
                        {tab === "restaurantes" ? (
                          <>
                            <div className="rec-info-item">
                              <span className="rec-info-label">Reservas</span>
                              <span className="rec-info-value">
                                {item.total_reservas}
                              </span>
                            </div>
                            <div className="rec-info-item">
                              <span className="rec-info-label">
                                Visitantes únicos
                              </span>
                              <span className="rec-info-value">
                                {item.total_visitantes}
                              </span>
                            </div>
                            {item.rango_precio && (
                              <div className="rec-info-item">
                                <span className="rec-info-label">Precio</span>
                                <span className="rec-info-value">
                                  {item.rango_precio}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="rec-info-item">
                              <span className="rec-info-label">Unidades</span>
                              <span className="rec-info-value">
                                {item.total_vendido}
                              </span>
                            </div>
                            <div className="rec-info-item">
                              <span className="rec-info-label">
                                Compradores
                              </span>
                              <span className="rec-info-value">
                                {item.total_compradores}
                              </span>
                            </div>
                            {item.precio && (
                              <div className="rec-info-item">
                                <span className="rec-info-label">Precio</span>
                                <span className="rec-info-value">
                                  ${item.precio}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <p className="rec-card-week">
                        Visitado por{" "}
                        <span>
                          {tab === "restaurantes"
                            ? item.total_visitantes
                            : item.total_compradores}{" "}
                          personas
                        </span>{" "}
                        en el último mes
                      </p>

                      <Link
                        to={`/oferente/${item.id_oferente}`}
                        className="btn-rec"
                      >
                        Ver{" "}
                        {tab === "restaurantes" ? "Restaurante" : "Artesanía"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Recomendaciones;
