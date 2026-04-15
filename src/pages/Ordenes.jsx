import { Clock, CheckCircle, Truck, XCircle, CreditCard, Utensils, Palette, AlertTriangle, Package, DollarSign, Search, Eye, Download, RefreshCcw } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { pedidosAPI } from "../services/api";
import Layout from "../components/Layout";
import OrdenDetailModal from "../components/OrdenDetailModal";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/Ordenes.css";

function Ordenes() {
  const [pedidos, setPedidos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterEstado, setFilterEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [confirmEstado, setConfirmEstado] = useState({ isOpen: false, id: null, nuevoEstado: '' });

  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = user?.rol === "admin";
  const isTurista = user?.rol === "turista";
  const isOferente = user?.rol === "oferente";
  const isModerador = user?.rol === "moderador"; // 👈 nuevo rol

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (isTurista) {
        response = await pedidosAPI.getMisPedidos();
      } else {
        // admin, moderador, and oferente: backend scopes by role in obtenerPedidos
        response = await pedidosAPI.getAll();
      }

      setPedidos(response.pedidos || []);
      setFiltered(response.pedidos || []);
    } catch (err) {
      console.error("Error loading pedidos:", err);
      setError(err.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let data = [...pedidos];
    if (filterEstado) data = data.filter((p) => p.estado === filterEstado);
    if (searchTerm) {
  const term = searchTerm.toLowerCase();

  data = data.filter((p) => {
    const idMatch = p.id_pedido?.toString().includes(term);

    const nombreMatch = (p.nombre_usuario || "")
      .toLowerCase()
      .includes(term);

    const emailMatch = (p.email_usuario || "")
      .toLowerCase()
      .includes(term);

    return idMatch || nombreMatch || emailMatch;
  });
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
      const res = await pedidosAPI.updateEstado(confirmEstado.id, confirmEstado.nuevoEstado);
      if (res && res._offlineQueued) {
        setPedidos(prev => prev.map(p =>
          p.id_pedido === confirmEstado.id ? { ...p, estado: confirmEstado.nuevoEstado, _isDraft: true } : p
        ));
        toast.info("Sin conexión — operación guardada para sincronizar", { icon: <RefreshCcw size={18} /> });
      } else {
        await loadPedidos();
        toast.success("Estado actualizado exitosamente");
      }
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
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case "pendiente": return "badge-warning";
      case "pagado": return "badge-success";
      case "enviado": return "badge-info";
      case "completado": return "badge-primary";
      default: return "badge-secondary";
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

  const generatePDF = (pedido) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Recibo de Pedido #${pedido.id_pedido}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Fecha: ${formatDate(pedido.fecha_pedido)}`, 14, 32);
    doc.text(`Estado: ${getStatusLabelText(pedido.estado)}`, 14, 40);
    doc.text(`Cliente: ${pedido.nombre_usuario || "N/A"} (${pedido.email_usuario || "N/A"})`, 14, 48);

    const items = pedido.items || [];
    const tableData = items.map(item => [
      item.nombre_producto, item.cantidad,
      formatCurrency(item.precio_unitario),
      formatCurrency(item.precio_unitario * item.cantidad)
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Producto', 'Cantidad', 'Precio Unit.', 'Total']],
      body: tableData,
    });

    const finalY = doc.lastAutoTable.finalY || 55;
    doc.text(`Total: ${formatCurrency(pedido.total)}`, 14, finalY + 10);
    doc.save(`pedido_${pedido.id_pedido}.pdf`);
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
              <h1>
                <Package size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                {isTurista ? "Mis Pedidos" : "Gestión de Pedidos"}
              </h1>
              <p className="welcome-text">
                {isTurista
                  ? "Revisa el estado de tus compras"
                  : isModerador
                    ? "Visualización de todos los pedidos del sistema"
                    : isOferente
                      ? "Pedidos que incluyen tus productos"
                      : "Administra todos los pedidos del sistema"}
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div className="alert alert-error">
            <span><AlertTriangle size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></span>
            <span>{error}</span>
          </div>
        )}

        {/* Aviso moderador: solo lectura */}
        {isModerador && (
          <div style={{
            backgroundColor: "var(--bg-card)", padding: "1rem", borderRadius: "8px",
            borderLeft: "4px solid var(--info-color)", marginBottom: "1.5rem", color: "var(--text-dark)"
          }}>
            ⚠️ Estás en modo supervisión. Solo puedes visualizar los pedidos.
          </div>
        )}

        {/* STATS */}
        <div className="ordenes-stats">
          <div className="stat-card">
            <div className="stat-icon"><Package size={18} /></div>
            <div className="stat-value">{pedidos.length}</div>
            <div className="stat-label">Total Pedidos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Clock size={18} /></div>
            <div className="stat-value">{pedidos.filter((p) => p.estado === "pendiente").length}</div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckCircle size={18} /></div>
            <div className="stat-value">{pedidos.filter((p) => p.estado === "pagado").length}</div>
            <div className="stat-label">Pagados / En Prep.</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Truck size={18} /></div>
            <div className="stat-value">{pedidos.filter((p) => p.estado === "enviado").length}</div>
            <div className="stat-label">Listos para Recoger</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckCircle size={18} /></div>
            <div className="stat-value">{pedidos.filter((p) => p.estado === "completado").length}</div>
            <div className="stat-label">Recogidos / Historial</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><DollarSign size={18} /></div>
            <div className="stat-value">
              {formatCurrency(
                pedidos.filter((p) => p.estado === "pagado")
                  .reduce((sum, p) => sum + parseFloat(p.monto_total || 0), 0)
              )}
            </div>
            <div className="stat-label">Total Ventas</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="ordenes-controls">
          <div className="search-box">
            <span className="search-icon"><Search size={18} /></span>
            <input
              type="text"
              placeholder="Buscar por  usuario..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            {["", "pendiente", "pagado", "enviado", "completado"].map((estado) => (
              <button
                key={estado}
                className={`filter-btn ${filterEstado === estado ? "active" : ""}`}
                onClick={() => setFilterEstado(estado)}
              >
                {estado === "" ? "Todos" : getStatusLabelText(estado)}
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
          Mostrando {filtered.length} de {pedidos.length} pedidos
        </div>

        {/* TABLE */}
        <div className="ordenes-table-container table-responsive">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon"><Package size={18} /></span>
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
                  <tr key={pedido.id_pedido} style={{ backgroundColor: pedido._isDraft ? 'var(--warning-light, #fffcf0)' : 'inherit' }}>
                    <td data-label="ID">
                      <strong>#{pedido.id_pedido}</strong>
                      {pedido._isDraft && (
                        <span title="Cambio pendiente de sincronización" style={{ marginLeft: '6px', display: 'inline-flex', alignItems: 'center' }}>
                          <RefreshCcw size={16} className="animate-spin" style={{ color: 'var(--warning-color, #f59e0b)' }} />
                        </span>
                      )}
                    </td>

                    {!isTurista && (
                      <td data-label="Cliente" className="cliente-info">
                        <div>
                          <strong>{pedido.nombre_usuario || "N/A"}</strong>
                          <br /><small>{pedido.email_usuario || ""}</small>
                        </div>
                      </td>
                    )}
<td data-label="Fecha">{formatDate(pedido.fecha_pedido)}</td>
<td data-label="Items">
  <span className="items-badge">
    {pedido.total_items || 0} items
  </span>
</td>
<td data-label="Total" className="monto">
  <strong>{formatCurrency(pedido.total)}</strong>
</td>

                    <td data-label="Estado">
                      {/* Solo admin y oferente pueden cambiar estado */}
                      {(isAdmin || isOferente) ? (
                        <select
                          value={pedido.estado}
                          onChange={(e) => requestChangeEstado(pedido.id_pedido, e.target.value)}
                          className={`estado-select ${getEstadoBadgeClass(pedido.estado)}`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="pagado">Pagado / En Prep.</option>
                          <option value="enviado">Listo para Recoger</option>
                          <option value="completado">Recogido / Historial</option>
                        </select>
                      ) : (
                        <span className={`badge ${getEstadoBadgeClass(pedido.estado)}`}>
                          {pedido.estado === "pendiente" && <><Clock size={16} /> {getStatusLabelText(pedido.estado)}</>}
                          {pedido.estado === "pagado" && <><CheckCircle size={16} /> {getStatusLabelText(pedido.estado)}</>}
                          {pedido.estado === "enviado" && <><Truck size={16} /> {getStatusLabelText(pedido.estado)}</>}
                          {pedido.estado === "completado" && <><CheckCircle size={16} /> {getStatusLabelText(pedido.estado)}</>}
                        </span>
                      )}
                    </td>

                    <td data-label="Acciones" className="actions">
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleViewDetails(pedido)}
                          className="btn-action btn-view"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (!pedido.items) {
                              toast.info("Cargando detalles para el PDF...");
                              pedidosAPI.getById(pedido.id_pedido)
                                .then(detalle => generatePDF(detalle))
                                .catch(() => toast.error("Error al cargar detalles para PDF"));
                            } else {
                              generatePDF(pedido);
                            }
                          }}
                          className="btn-action btn-view"
                          title="Descargar Recibo (PDF)"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && selectedPedido && (
        <OrdenDetailModal
          pedido={selectedPedido}
          isOpen={showModal}
          onClose={() => { setShowModal(false); setSelectedPedido(null); }}
          onEstadoChange={requestChangeEstado}
          canChangeEstado={isAdmin || isOferente} // moderador no puede cambiar
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