import React, { useState, useEffect } from "react";
import { reservasAPI } from "../services/api";
import Layout from "../components/Layout";
import ReservaDetailModal from "../components/ReservaDetailModal";
import "../styles/Reserva.css";

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filtros
  const [filterEstado, setFilterEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = user?.rol === "admin";
  const isTurista = user?.rol === "turista";
  const isOferente = user?.rol === "oferente";

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (isTurista) {
        // Turista: solo sus reservas
        response = await reservasAPI.getMisReservas();
        setReservas(response.reservas || []);
        setFiltered(response.reservas || []);
      } else  {
        // Admin: todas las reservas
        response = await reservasAPI.getAll();
        setReservas(response.reservas || []);
        setFiltered(response.reservas || []);
      } 
    } catch (err) {
      console.error("Error loading reservas:", err);
      setError(err.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let data = [...reservas];

    // Filtrar por estado
    if (filterEstado) {
      data = data.filter((r) => r.estado === filterEstado);
    }

    // Buscar por ID, usuario o servicio
    if (searchTerm) {
      data = data.filter(
        (r) =>
          r.id_reserva.toString().includes(searchTerm) ||
          r.nombre_usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.nombre_servicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.email_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(data);
  }, [filterEstado, searchTerm, reservas]);

  const clearFilters = () => {
    setFilterEstado("");
    setSearchTerm("");
  };

  const handleViewDetails = async (reserva) => {
    try {
      setLoading(true);
      const detalle = await reservasAPI.getById(reserva.id_reserva);
      setSelectedReserva(detalle);
      setShowModal(true);
    } catch (err) {
      alert(err.message || "Error al cargar detalles");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEstado = async (id_reserva, nuevoEstado) => {
    if (!window.confirm(`¿Cambiar el estado de la reserva a "${nuevoEstado}"?`)) {
      return;
    }

    try {
      await reservasAPI.updateEstado(id_reserva, nuevoEstado);
      await loadReservas();
      alert("Estado actualizado exitosamente");
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
    }
  };

  const handleCancelar = async (reserva) => {
    // Validar 24 horas
    const fechaReserva = new Date(`${reserva.fecha}T${reserva.hora}`);
    const ahora = new Date();
    const horasRestantes = (fechaReserva - ahora) / (1000 * 60 * 60);
    
    if (horasRestantes < 24) {
      alert("No se puede cancelar con menos de 24 horas de anticipación");
      return;
    }

    if (!window.confirm("¿Estás seguro de cancelar esta reserva?")) {
      return;
    }

    try {
      await reservasAPI.updateEstado(reserva.id_reserva, "cancelada");
      await loadReservas();
      alert("Reserva cancelada exitosamente");
    } catch (err) {
      alert(err.message || "Error al cancelar reserva");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5); // HH:MM
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case "pendiente":
        return "badge-warning";
      case "confirmada":
        return "badge-success";
      case "cancelada":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  const canCancelReserva = (reserva) => {
    if (reserva.estado === "cancelada") return false;
    
    const fechaReserva = new Date(`${reserva.fecha}T${reserva.hora}`);
    const ahora = new Date();
    const horasRestantes = (fechaReserva - ahora) / (1000 * 60 * 60);
    
    return horasRestantes >= 24;
  };

  if (loading && reservas.length === 0) {
    return (
      <Layout>
        <div className="reservas-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando reservas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="reservas-container">
        
        {/* HEADER */}
        <header className="reservas-header">
          <div className="header-content">
            <div className="header-info">
              <h1>🍽️ {isTurista ? "Mis Reservaciones" : "Gestión de Reservaciones"}</h1>
              <p className="welcome-text">
                {isTurista
                  ? "Administra tus reservaciones de restaurantes"
                  : isOferente
                  ? "Reservaciones en tus servicios"
                  : "Administra todas las reservaciones del sistema"}
              </p>
            </div>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* STATS */}
        <div className="reservas-stats">
          <div className="stat-card">
            <div className="stat-icon">🍽️</div>
            <div className="stat-value">{reservas.length}</div>
            <div className="stat-label">Total Reservas</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">
              {reservas.filter((r) => r.estado === "pendiente").length}
            </div>
            <div className="stat-label">Pendientes</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">
              {reservas.filter((r) => r.estado === "confirmada").length}
            </div>
            <div className="stat-label">Confirmadas</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-value">
              {reservas.filter((r) => r.estado === "cancelada").length}
            </div>
            <div className="stat-label">Canceladas</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">
              {reservas
                .filter((r) => r.estado !== "cancelada")
                .reduce((sum, r) => sum + (r.numero_personas || 0), 0)}
            </div>
            <div className="stat-label">Total personas</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="reservas-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por ID, usuario o servicio..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterEstado === "" ? "active" : ""}`}
              onClick={() => setFilterEstado("")}
            >
              Todas
            </button>
            <button
              className={`filter-btn ${filterEstado === "pendiente" ? "active" : ""}`}
              onClick={() => setFilterEstado("pendiente")}
            >
              Pendientes
            </button>
            <button
              className={`filter-btn ${filterEstado === "confirmada" ? "active" : ""}`}
              onClick={() => setFilterEstado("confirmada")}
            >
              Confirmadas
            </button>
            <button
              className={`filter-btn ${filterEstado === "cancelada" ? "active" : ""}`}
              onClick={() => setFilterEstado("cancelada")}
            >
              Canceladas
            </button>

            {(filterEstado || searchTerm) && (
              <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        <div className="results-count">
          Mostrando {filtered.length} de {reservas.length} reservas
        </div>

        {/* TABLE */}
        <div className="reservas-table-container">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🍽️</span>
              <p>No hay reservas para mostrar</p>
              <small>
                {filterEstado || searchTerm
                  ? "Intenta cambiar los filtros"
                  : "Las reservas aparecerán aquí cuando se realicen"}
              </small>
            </div>
          ) : (
            <table className="reservas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  {!isTurista && <th>Cliente</th>}
                  {!isOferente && <th>Servicio</th>}
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Personas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((reserva) => (
                  <tr key={reserva.id_reserva}>
                    <td>
                      <strong>#{reserva.id_reserva}</strong>
                    </td>

                    {!isTurista && (
                      <td className="cliente-info">
                        <div>
                          <strong>{reserva.nombre_usuario || "N/A"}</strong>
                          <small>{reserva.email_usuario || ""}</small>
                        </div>
                      </td>
                    )}

                    {!isOferente && (
                      <td>
                        <div className="servicio-info">
                          <strong>{reserva.nombre_servicio || "N/A"}</strong>
                          {reserva.nombre_oferente && (
                            <small>{reserva.nombre_oferente}</small>
                          )}
                        </div>
                      </td>
                    )}

                    <td>{formatDate(reserva.fecha)}</td>
                    <td className="hora">{formatTime(reserva.hora)}</td>
                    
                    <td>
                      <span className="personas-badge">
                        {reserva.numero_personas} 👥
                      </span>
                    </td>

                    <td>
                      {isAdmin || isOferente ? (
                        <select
                          value={reserva.estado}
                          onChange={(e) =>
                            handleChangeEstado(reserva.id_reserva, e.target.value)
                          }
                          className={`estado-select ${getEstadoBadgeClass(
                            reserva.estado
                          )}`}
                        >
                          <option value="pendiente">⏳ Pendiente</option>
                          <option value="confirmada">✅ Confirmada</option>
                          <option value="cancelada">❌ Cancelada</option>
                        </select>
                      ) : (
                        <span
                          className={`badge ${getEstadoBadgeClass(reserva.estado)}`}
                        >
                          {reserva.estado === "pendiente" && "⏳ Pendiente"}
                          {reserva.estado === "confirmada" && "✅ Confirmada"}
                          {reserva.estado === "cancelada" && "❌ Cancelada"}
                        </span>
                      )}
                    </td>

                    <td className="actions">
                      <button
                        onClick={() => handleViewDetails(reserva)}
                        className="btn-action btn-view"
                        title="Ver detalles"
                      >
                        👁️
                      </button>
                      
                      {isTurista && canCancelReserva(reserva) && (
                        <button
                          onClick={() => handleCancelar(reserva)}
                          className="btn-action btn-cancel"
                          title="Cancelar reserva"
                        >
                          ❌
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedReserva && (
        <ReservaDetailModal
          reserva={selectedReserva}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedReserva(null);
          }}
          onEstadoChange={handleChangeEstado}
          onCancelar={handleCancelar}
          canChangeEstado={isAdmin || isOferente}
          isTurista={isTurista}
        />
      )}
    </Layout>
  );
}

export default Reservas;