import React, { useState, useEffect } from "react";
import { pedidosAPI } from "../services/api";
import Layout from "../components/Layout";
import OrdenDetailModal from "../components/OrdenDetailModal";
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
      } else  {
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
      alert(err.message || "Error al cargar detalles");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEstado = async (id_pedido, nuevoEstado) => {
    if (!window.confirm(`¿Cambiar el estado del pedido a "${nuevoEstado}"?`)) {
      return;
    }

    try {
      await pedidosAPI.updateEstado(id_pedido, nuevoEstado);
      await loadPedidos();
      alert("Estado actualizado exitosamente");
    } catch (err) {
      alert(err.message || "Error al cambiar estado");
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
      default:
        return "badge-secondary";
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
              <h1>📦 {isTurista ? "Mis Pedidos" : "Gestión de Pedidos"}</h1>
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
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* STATS */}
        <div className="ordenes-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{pedidos.length}</div>
            <div className="stat-label">Total Pedidos</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">
              {pedidos.filter((p) => p.estado === "pendiente").length}
            </div>
            <div className="stat-label">Pendientes</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">
              {pedidos.filter((p) => p.estado === "pagado").length}
            </div>
            <div className="stat-label">Pagados</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚚</div>
            <div className="stat-value">
              {pedidos.filter((p) => p.estado === "enviado").length}
            </div>
            <div className="stat-label">Enviados</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
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
            <span className="search-icon">🔍</span>
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
              Enviados
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
              <span className="empty-icon">📦</span>
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

                    <td>{formatDate(pedido.fecha_creacion)}</td>

                    <td>
                      <span className="items-badge">
                        {pedido.total_items || 0} items
                      </span>
                    </td>

                    <td className="monto">
                      <strong>{formatCurrency(pedido.monto_total)}</strong>
                    </td>

                    <td>
                      {isAdmin || isOferente ? (
                        <select
                          value={pedido.estado}
                          onChange={(e) =>
                            handleChangeEstado(pedido.id_pedido, e.target.value)
                          }
                          className={`estado-select ${getEstadoBadgeClass(
                            pedido.estado
                          )}`}
                        >
                          <option value="pendiente">⏳ Pendiente</option>
                          <option value="pagado">✅ Pagado</option>
                          <option value="enviado">🚚 Enviado</option>
                        </select>
                      ) : (
                        <span
                          className={`badge ${getEstadoBadgeClass(pedido.estado)}`}
                        >
                          {pedido.estado === "pendiente" && "⏳ Pendiente"}
                          {pedido.estado === "pagado" && "✅ Pagado"}
                          {pedido.estado === "enviado" && "🚚 Enviado"}
                        </span>
                      )}
                    </td>

                    <td className="actions">
                      <button
                        onClick={() => handleViewDetails(pedido)}
                        className="btn-action btn-view"
                        title="Ver detalles"
                      >
                        👁️
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
          onEstadoChange={handleChangeEstado}
          canChangeEstado={isAdmin || isOferente}
        />
      )}
    </Layout>
  );
}

export default Ordenes;