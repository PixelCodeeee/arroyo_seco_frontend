import { Clock, CheckCircle, XCircle, Utensils, AlertTriangle, Search, Eye, Users } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { reservasAPI } from "../services/api";
import Layout from "../components/Layout";
import ReservaDetailModal from "../components/ReservaDetailModal";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "sonner";
import "../styles/Reserva.css";
import {
  formatDateShort,
  formatTime,
  getEstadoBadgeClass,
  canCancelReserva,
} from "../utils/Reservautils";

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [confirmEstado, setConfirmEstado] = useState({ isOpen: false, id: null, nuevoEstado: '' });
  const [confirmCancel, setConfirmCancel] = useState({ isOpen: false, reserva: null });

  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = user?.rol === "admin";
  const isTurista = user?.rol === "turista";
  const isOferente = user?.rol === "oferente";

  useEffect(() => { loadReservas(); }, []);

  const loadReservas = async () => {
    try {
      setLoading(true);
      setError("");

      let response;
      if (isTurista) {
        response = await reservasAPI.getMisReservas();
      } else if (isOferente) {
        response = await reservasAPI.getMisReservasComoOferente();
      } else {
        response = await reservasAPI.getAll();
      }

      const data = response.reservas || [];
      setReservas(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error loading reservas:", err);
      setError(err.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let data = [...reservas];
    if (filterEstado) {
      data = data.filter((r) => r.estado === filterEstado);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.id_reserva.toString().includes(q) ||
          // WITH this:
          r.usuario?.nombre?.toLowerCase().includes(q) ||
          r.servicio?.nombre?.toLowerCase().includes(q) ||
          r.usuario?.correo?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [filterEstado, searchTerm, reservas]);

  const clearFilters = () => { setFilterEstado(""); setSearchTerm(""); };

  const handleViewDetails = async (reserva) => {
    try {
      setLoading(true);
      const detalle = await reservasAPI.getById(reserva.id_reserva);
      setSelectedReserva(detalle);
      setShowModal(true);
    } catch (err) {
      toast.error(err.message || "Error al cargar detalles");
    } finally {
      setLoading(false);
    }
  };

  const requestChangeEstado = (id_reserva, nuevoEstado) => {
    setConfirmEstado({ isOpen: true, id: id_reserva, nuevoEstado });
  };

  const executeChangeEstado = async () => {
    if (!confirmEstado.id) return;
    try {
      await reservasAPI.updateEstado(confirmEstado.id, confirmEstado.nuevoEstado);
      toast.success("Estado de la reserva actualizado");
      await loadReservas();
    } catch (err) {
      toast.error(err.message || "Error al cambiar estado");
    } finally {
      setConfirmEstado({ isOpen: false, id: null, nuevoEstado: '' });
    }
  };

  const requestCancelar = (reserva) => {
    if (!canCancelReserva(reserva)) {
      toast.error("No se puede cancelar con menos de 24 horas de anticipación");
      return;
    }
    setConfirmCancel({ isOpen: true, reserva });
  };

  const executeCancelar = async () => {
    if (!confirmCancel.reserva) return;
    try {
      await reservasAPI.updateEstado(confirmCancel.reserva.id_reserva, "cancelada");
      toast.success("Reserva cancelada exitosamente");
      await loadReservas();
    } catch (err) {
      toast.error(err.message || "Error al cancelar reserva");
    } finally {
      setConfirmCancel({ isOpen: false, reserva: null });
    }
  };

  // Stats derived from reservas array
  const statPendientes = reservas.filter((r) => r.estado === "pendiente").length;
  const statConfirmadas = reservas.filter((r) => r.estado === "confirmada").length;
  const statCanceladas = reservas.filter((r) => r.estado === "cancelada").length;
  const statPersonas = reservas
    .filter((r) => r.estado !== "cancelada")
    .reduce((sum, r) => sum + (r.numero_personas || 0), 0);

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
              <h1>
                <Utensils size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                {isTurista ? "Mis Reservaciones" : "Gestión de Reservaciones"}
              </h1>
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
            <AlertTriangle size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />
            <span>{error}</span>
          </div>
        )}

        {/* STATS */}
        <div className="reservas-stats">
          <div className="stat-card">
            <div className="stat-icon"><Utensils size={18} /></div>
            <div className="stat-value">{reservas.length}</div>
            <div className="stat-label">Total Reservas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Clock size={18} /></div>
            <div className="stat-value">{statPendientes}</div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckCircle size={18} /></div>
            <div className="stat-value">{statConfirmadas}</div>
            <div className="stat-label">Confirmadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><XCircle size={18} /></div>
            <div className="stat-value">{statCanceladas}</div>
            <div className="stat-label">Canceladas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Users size={18} /></div>
            <div className="stat-value">{statPersonas}</div>
            <div className="stat-label">Total Personas</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="reservas-controls">
          <div className="search-box">
            <span className="search-icon"><Search size={18} /></span>
            <input
              type="text"
              placeholder="Buscar por ID, usuario o servicio..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            {["", "pendiente", "confirmada", "cancelada"].map((estado) => (
              <button
                key={estado}
                className={`filter-btn ${filterEstado === estado ? "active" : ""}`}
                onClick={() => setFilterEstado(estado)}
              >
                {estado === "" ? "Todas" : estado.charAt(0).toUpperCase() + estado.slice(1) + "s"}
              </button>
            ))}
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
              <span className="empty-icon"><Utensils size={32} /></span>
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
                    <td><strong>#{reserva.id_reserva}</strong></td>

                    {!isTurista && (
                      <td className="cliente-info">
                        <div>
                          <strong>{reserva.usuario?.nombre || "N/A"}</strong>
                          <small>{reserva.usuario?.correo || ""}</small>
                        </div>
                      </td>
                    )}

                    {!isOferente && (
                      <td>
                        <div className="servicio-info">
                          <strong>{reserva.servicio?.nombre || "N/A"}</strong>
                          {reserva.servicio?.oferente?.nombre && <small>{reserva.servicio.oferente.nombre}</small>}
                        </div>
                      </td>
                    )}

                    <td>{formatDateShort(reserva.fecha)}</td>
                    <td className="hora">{formatTime(reserva.hora)}</td>

                    <td>
                      <span className="personas-badge">
                        {reserva.numero_personas} <Users size={14} />
                      </span>
                    </td>

                    <td>
                      {isAdmin || isOferente ? (
                        // ✅ <option> cannot render icons — text only
                        <select
                          value={reserva.estado}
                          onChange={(e) => requestChangeEstado(reserva.id_reserva, e.target.value)}
                          className={`estado-select ${getEstadoBadgeClass(reserva.estado)}`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      ) : (
                        <span className={`badge ${getEstadoBadgeClass(reserva.estado)}`}>
                          {reserva.estado === "pendiente" && <><Clock size={14} />       Pendiente</>}
                          {reserva.estado === "confirmada" && <><CheckCircle size={14} /> Confirmada</>}
                          {reserva.estado === "cancelada" && <><XCircle size={14} />     Cancelada</>}
                        </span>
                      )}
                    </td>

                    <td className="actions">
                      <button
                        onClick={() => handleViewDetails(reserva)}
                        className="btn-action btn-view"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>

                      {isTurista && canCancelReserva(reserva) && (
                        <button
                          onClick={() => requestCancelar(reserva)}
                          className="btn-action btn-cancel"
                          title="Cancelar reserva"
                        >
                          <XCircle size={16} />
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
          onClose={() => { setShowModal(false); setSelectedReserva(null); }}
          onEstadoChange={requestChangeEstado}
          onCancelar={requestCancelar}
          canChangeEstado={isAdmin || isOferente}
          isTurista={isTurista}
        />
      )}

      <ConfirmModal
        isOpen={confirmEstado.isOpen}
        title="Cambiar Estado"
        message={`¿Estás seguro de cambiar el estado de la reserva a "${confirmEstado.nuevoEstado}"?`}
        onConfirm={executeChangeEstado}
        onClose={() => setConfirmEstado({ isOpen: false, id: null, nuevoEstado: '' })}
        confirmText="Confirmar"
        isDestructive={false}
      />

      <ConfirmModal
        isOpen={confirmCancel.isOpen}
        title="Cancelar Reserva"
        message="¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer."
        onConfirm={executeCancelar}
        onClose={() => setConfirmCancel({ isOpen: false, reserva: null })}
        confirmText="Sí, cancelar"
      />
    </Layout>
  );
}

export default Reservas;