import React from "react";
import { X } from "lucide-react";
import "../styles/OrdenDetailModal.css";

function OrdenDetailModal({ pedido, isOpen, onClose, onEstadoChange, canChangeEstado }) {
  if (!isOpen || !pedido) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
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

  const calcularSubtotal = () => {
    return pedido.items?.reduce((sum, item) => {
      return sum + parseFloat(item.precio_compra) * parseInt(item.cantidad);
    }, 0) || 0;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content orden-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>📦 Detalle del Pedido #{pedido.id_pedido}</h2>
            <p className="modal-subtitle">
              {formatDate(pedido.fecha_creacion)}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          
          {/* Estado */}
          <div className="orden-estado-section">
            <div className="estado-info">
              <label>Estado actual:</label>
              <span className={`badge badge-large ${getEstadoBadgeClass(pedido.estado)}`}>
                {pedido.estado === "pendiente" && "⏳ Pendiente"}
                {pedido.estado === "pagado" && "✅ Pagado"}
                {pedido.estado === "enviado" && "🚚 Enviado"}
              </span>
            </div>

            {canChangeEstado && (
              <div className="estado-actions">
                <label>Cambiar estado:</label>
                <div className="estado-buttons">
                  {pedido.estado !== "pendiente" && (
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        onEstadoChange(pedido.id_pedido, "pendiente");
                        onClose();
                      }}
                    >
                      ⏳ Marcar Pendiente
                    </button>
                  )}
                  {pedido.estado !== "pagado" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        onEstadoChange(pedido.id_pedido, "pagado");
                        onClose();
                      }}
                    >
                      ✅ Marcar Pagado
                    </button>
                  )}
                  {pedido.estado !== "enviado" && (
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        onEstadoChange(pedido.id_pedido, "enviado");
                        onClose();
                      }}
                    >
                      🚚 Marcar Enviado
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Información del Cliente */}
          <div className="orden-section">
            <h3>👤 Información del Cliente</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Nombre:</label>
                <span>{pedido.nombre_usuario || "N/A"}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{pedido.email_usuario || "N/A"}</span>
              </div>
              <div className="info-item">
                <label>Teléfono:</label>
                <span>{pedido.telefono_usuario || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Items del Pedido */}
          <div className="orden-section">
            <h3>🛍️ Productos Ordenados</h3>
            <div className="items-list">
              {pedido.items && pedido.items.length > 0 ? (
                pedido.items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-image">
                      {item.imagenes_producto && item.imagenes_producto.length > 0 ? (
                        <img
                          src={item.imagenes_producto[0]}
                          alt={item.nombre_producto}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="no-imagen"
                        style={{
                          display:
                            item.imagenes_producto && item.imagenes_producto.length > 0
                              ? "none"
                              : "flex",
                        }}
                      >
                        📦
                      </div>
                    </div>

                    <div className="item-info">
                      <h4>{item.nombre_producto || "Producto"}</h4>
                      {item.descripcion_producto && (
                        <p className="item-description">{item.descripcion_producto}</p>
                      )}
                      {item.nombre_oferente && (
                        <p className="item-oferente">
                          <strong>Vendedor:</strong> {item.nombre_oferente}
                        </p>
                      )}
                    </div>

                    <div className="item-pricing">
                      <div className="item-quantity">
                        <span>Cantidad: </span>
                        <strong>{item.cantidad}</strong>
                      </div>
                      <div className="item-price">
                        {formatCurrency(item.precio_compra)} c/u
                      </div>
                      <div className="item-total">
                        <strong>
                          {formatCurrency(item.precio_compra * item.cantidad)}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-items">No hay items en este pedido</p>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="orden-section orden-summary">
            <h3>💰 Resumen del Pedido</h3>
            <div className="summary-grid">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(calcularSubtotal())}</span>
              </div>
              <div className="summary-row total">
                <span><strong>Total:</strong></span>
                <span><strong>{formatCurrency(pedido.monto_total)}</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrdenDetailModal;