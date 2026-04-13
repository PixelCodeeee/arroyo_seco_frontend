import { Clock, CheckCircle, Truck, XCircle, CreditCard, Utensils, Palette, AlertTriangle, Package, DollarSign, Search, Eye } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { pedidosAPI } from "../services/api";
import Layout from "../components/Layout";
import OrdenDetailModal from "../components/OrdenDetailModal";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "sonner";
import "../styles/Ordenes.css";

function Ordenes() {
  const [pedidos, setPedidos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [filterEstado, setFilterEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [confirmEstado, setConfirmEstado] = useState({ isOpen: false, id: null, nuevoEstado: '' });

  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = user?.rol === "admin";
  const isTurista = user?.rol === "turista";
  const isOferente = user?.rol === "oferente";

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (isTurista) {
        // Turista: solo sus pedidos
        response = await pedidosAPI.getMisPedidos();
        setPedidos(response.pedidos || []);
        setFiltered(response.pedidos || []);
      } else {
        // Admin: todos los pedidos
        response = await pedidosAPI.getAll();
        setPedidos(response.pedidos || []);
        setFiltered(response.pedidos || []);
      }
    } catch (err) {
      console.error("Error loading pedidos:", err);
      setError(err.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let data = [...pedidos];

    // Filtrar por estado
    if (filterEstado) {
      data = data.filter((p) => p.estado === filterEstado);
    }

    // Buscar por ID o nombre de usuario
    if (searchTerm) {
      data = data.filter(
        (p) =>
          p.id_pedido.toString().includes(searchTerm) ||
          p.nombre_usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(data);
  }, [filterEstado, searchTerm, pedidos]);

  const clearFilters = () => {
    setFilterEstado("");
    setSearchTerm("");
  };

  const handleViewDetails = async (pedido) => {
    try {
      setLoading(true);
      // Obtener detalles completos del pedido
      const detalle = await pedidosAPI.getById(pedido.id_pedido);
      setSelectedPedido(detalle);
      setShowModal(true);
    } catch (err) {
      toast.error(err.message || "Error al cargar detalles");
    } finally {
      setLoading(false);
    }
  };

  const requestChangeEstado = (id_pedido, nuevoEstado) => {
    setConfirmEstado({ isOpen: true, id: id_pedido, nuevoEstado });
  };

  const executeChangeEstado = async () => {
    if (!confirmEstado.id) return;
    try {
      await pedidosAPI.updateEstado(confirmEstado.id, confirmEstado.nuevoEstado);
      await loadPedidos();
      toast.success("Estado actualizado exitosamente");
    } catch (err) {
      toast.error(err.message || "Error al cambiar estado");
    } finally {
      setConfirmEstado({ isOpen: false, id: null, nuevoEstado: '' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case "pendiente":
        return "badge-warning";
      case "pagado":
        return "badge-success";
      case "enviado":
        return "badge-info";
      case "completado":
        return "badge-primary";
      default:
        return "badge-secondary";
    }
  };

  const getStatusLabelText = (estado) => {
    switch (estado) {
      case "pendiente": return "Pendiente";
      case "pagado": return "Pagado / En Prep.";
      case "enviado": return "Listo para Recoger";
      case "completado": return "Recogido / Historial";
      default: return estado;
    }
  };

  if (loading && pedidos.length === 0) {
    return (
      <Layout>
        <div className="ordenes-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando pedidos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ordenes-container">

        {/* HEADER */}
        <header className="ordenes-header">
          <div className="header-content">
            <div className="header-info">
              <h1><Package size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> {isTurista ? "Mis Pedidos" : "Gestión de Pedidos"}</h1>
              <p className="welcome-text">
                {isTurista
                  ? "Revisa el estado de tus compras"
                  : isOferente
                    ? "Pedidos que incluyen tus productos"
                    : "Administra todos los pedidos del sistema"}
              </p>
            </div>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="alert alert-error">
            <span><AlertTriangle size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />️</span>
            <span>{error}</span>
          </div>
        )}

        {/* STATS */}
        <div className="ordenes-stats">
          <div className="stat-card">
            <div className="stat-icon"><Package size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></div>
            <div className="stat-value">{pedidos.length}</div>
            <div className="stat-label">Total Pedidos</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Clock size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></div>
            <div className="stat-value">
              {pedidos.filter((p) => p.estado === "pendiente").length}
            </div>
            <div className="stat-label">Pendientes</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><CheckCircle size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></div>
            <div className="stat-value">
              {pedidos.filter((p) => p.estado === "pagado").length}
            </div>
            <div className="stat-label">Pagados</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Truck size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></div>
            <div className="stat-value">
              {pedidos.filter((p) => p.estado === "enviado").length}
            </div>
            <div className="stat-label">Listos para recoger</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><CheckCircle size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></div>
            <div className="stat-value">
              {pedidos.filter((p) => p.estado === "completado").length}
            </div>
            <div className="stat-label">Completados</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><DollarSign size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></div>
            <div className="stat-value">
              {formatCurrency(
                pedidos
                  .filter((p) => p.estado === "pagado")
                  .reduce((sum, p) => sum + parseFloat(p.monto_total || 0), 0)
              )}
            </div>
            <div className="stat-label">Total Ventas</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="ordenes-controls">
          <div className="search-box">
            <span className="search-icon"><Search size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></span>
            <input
              type="text"
              placeholder="Buscar por ID o usuario..."
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
              Todos
            </button>
            <button
              className={`filter-btn ${filterEstado === "pendiente" ? "active" : ""}`}
              onClick={() => setFilterEstado("pendiente")}
            >
              Pendientes
            </button>
            <button
              className={`filter-btn ${filterEstado === "pagado" ? "active" : ""}`}
              onClick={() => setFilterEstado("pagado")}
            >
              Pagados
            </button>
            <button
              className={`filter-btn ${filterEstado === "enviado" ? "active" : ""}`}
              onClick={() => setFilterEstado("enviado")}
            >
              Listos
            </button>
            <button
              className={`filter-btn ${filterEstado === "completado" ? "active" : ""}`}
              onClick={() => setFilterEstado("completado")}
            >
              Completados
            </button>

            {(filterEstado || searchTerm) && (
              <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        <div className="results-count">
          Mostrando {filtered.length} de {pedidos.length} pedidos
        </div>

        {/* TABLE */}
        <div className="ordenes-table-container">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon"><Package size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></span>
              <p>No hay pedidos para mostrar</p>
              <small>
                {filterEstado || searchTerm
                  ? "Intenta cambiar los filtros"
                  : "Los pedidos aparecerán aquí cuando se realicen compras"}
              </small>
            </div>
          ) : (
            <table className="ordenes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  {!isTurista && <th>Cliente</th>}
                  <th>Fecha</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((pedido) => (
                  <tr key={pedido.id_pedido}>
                    <td>
                      <strong>#{pedido.id_pedido}</strong>
                    </td>

                    {!isTurista && (
                      <td className="cliente-info">
                        <div>
                          <strong>{pedido.nombre_usuario || "N/A"}</strong>
                          <small>{pedido.email_usuario || ""}</small>
                        </div>
                      </td>
                    )}

                    <td>{formatDate(pedido.fecha_pedido)}</td>

                    <td>
                      <span className="items-badge">
                        {pedido.total_items || 0} items
                      </span>
                    </td>

                    <td className="monto">
                      <strong>{formatCurrency(pedido.total)}</strong>
                    </td>

                    <td>
                      {isAdmin || isOferente ? (
                        <select
                          value={pedido.estado}
                          onChange={(e) =>
                            requestChangeEstado(pedido.id_pedido, e.target.value)
                          }
                          className={`estado-select ${getEstadoBadgeClass(
                            pedido.estado
                          )}`}
                        >
                          <option value="pendiente"><Clock size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Pendiente</option>
                          <option value="pagado"><CheckCircle size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Pagado</option>
                          <option value="enviado"><Truck size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Listo para recoger</option>
                          <option value="completado"><CheckCircle size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Completado</option>
                        </select>
                      ) : (
                        <span
                          className={`badge ${getEstadoBadgeClass(pedido.estado)}`}
                        >
                          {pedido.estado === "pendiente" && <><Clock size={16} /> Pendiente</>}
                          {pedido.estado === "pagado" && <><CheckCircle size={16} /> Pagado / En Prep.</>}
                          {pedido.estado === "enviado" && <><Truck size={16} /> Listo para recoger</>}
                          {pedido.estado === "completado" && <><CheckCircle size={16} /> Completado</>}
                        </span>
                      )}
                    </td>

                    <td className="actions">
                      <button
                        onClick={() => handleViewDetails(pedido)}
                        className="btn-action btn-view"
                        title="Ver detalles"
                      >
                        <Eye size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedPedido && (
        <OrdenDetailModal
          pedido={selectedPedido}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedPedido(null);
          }}
          onEstadoChange={requestChangeEstado}
          canChangeEstado={isAdmin || isOferente}
          isTurista={isTurista}
        />
      )}

      <ConfirmModal
        isOpen={confirmEstado.isOpen}
        title="Cambiar Estado"
        message={`¿Estás seguro de que deseas cambiar el estado del pedido a "${confirmEstado.nuevoEstado}"?`}
        onConfirm={executeChangeEstado}
        onClose={() => setConfirmEstado({ isOpen: false, id: null, nuevoEstado: '' })}
        confirmText="Confirmar"
        isDestructive={false}
      />
    </Layout>
  );
}

export default Ordenes;