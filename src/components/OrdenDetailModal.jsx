import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Package, Clock, CheckCircle, Truck, User, ShoppingBag, DollarSign, Store, Phone, MapPin, Utensils } from 'lucide-react';
import { oferentesAPI } from "../services/api";
import "../styles/OrdenDetailModal.css";

function OrdenDetailModal({ pedido, isOpen, onClose, onEstadoChange, canChangeEstado, isTurista }) {
  const [oferenteDetails, setOferenteDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && pedido && isTurista) {
      // Find oferente ID logic. In our schema, pedido has id_oferente directly.
      const oferenteId = pedido.id_oferente;
      if (oferenteId) {
        oferentesAPI.getById(oferenteId)
          .then(data => {
            // If the response is an array of 1, grab the first element
            const dataObj = Array.isArray(data) ? data[0] : data;
            // Some backend routes nest it under `oferente`
            const oferenteData = dataObj?.oferente || dataObj;
            setOferenteDetails(oferenteData);
          })
          .catch(err => console.error("Error fetching oferente details:", err));
      }
    }
  }, [isOpen, pedido, isTurista]);

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

  const calcularSubtotal = () => {
    return pedido.items?.reduce((sum, item) => {
      return sum + parseFloat(item.precio_unitario) * parseInt(item.cantidad);
    }, 0) || 0;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content orden-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={24} /> Detalle del Pedido #{pedido.id_pedido}</h2>
            <p className="modal-subtitle">
              {formatDate(pedido.fecha_pedido)}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">

          {/* Estado Turista: Doordash-style Tracker */}
          {isTurista ? (
            <div className="orden-estado-section">
              <div className="order-tracker-container" style={{ margin: "1rem 0", padding: "1rem", backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", position: "relative" }}>
                  <div style={{ position: "absolute", top: "15px", left: "10%", right: "10%", height: "4px", backgroundColor: "var(--border-color)", zIndex: 1 }}></div>

                  {/* Progress Line Active */}
                  <div style={{
                    position: "absolute", top: "15px", left: "10%", height: "4px", backgroundColor: "var(--primary-color)", zIndex: 2, transition: "width 0.4s",
                    width: pedido.estado === "pendiente" ? "0%" : pedido.estado === "pagado" ? "33%" : pedido.estado === "enviado" ? "66%" : "80%"
                  }}></div>

                  {/* Steps */}
                  {[
                    { id: "pendiente", label: "Pendiente", icon: <Clock size={20} /> },
                    { id: "pagado", label: "Pagado / En Prep.", icon: <Utensils size={20} /> },
                    { id: "enviado", label: "Listo para Recoger", icon: <Truck size={20} /> },
                    { id: "completado", label: "Recogido / Historial", icon: <CheckCircle size={20} /> }
                  ].map((step, idx) => {
                    const stepIndex = ["pendiente", "pagado", "enviado", "completado"].indexOf(step.id);
                    const currentStatusIndex = ["pendiente", "pagado", "enviado", "completado"].indexOf(pedido.estado);
                    const isActive = stepIndex <= currentStatusIndex;
                    return (
                      <div key={idx} style={{ position: "relative", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", width: "25%", textAlign: "center" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: isActive ? "var(--primary-color)" : "var(--bg-color)", border: `2px solid ${isActive ? "var(--primary-color)" : "var(--border-color)"}`, color: isActive ? "white" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                          {step.icon}
                        </div>
                        <span style={{ fontSize: "0.8rem", fontWeight: isActive ? "600" : "400", color: isActive ? "var(--text-dark)" : "var(--text-muted)" }}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pickup-instructions" style={{ padding: "1rem", backgroundColor: "var(--bg-color)", borderRadius: "8px", marginTop: "1rem", textAlign: "center" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--text-dark)", fontSize: "1rem" }}>Estado Actual</h4>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                    {pedido.estado === "pendiente" && "Estamos esperando la confirmación del pago para comenzar a preparar tu orden."}
                    {pedido.estado === "pagado" && "El pago fue exitoso y tu orden está siendo preparada. Te notificaremos cuando esté lista para pasar por ella."}
                    {pedido.estado === "enviado" && "¡Tu orden está lista! Dirígete a la ubicación del establecimiento para recogerla ahora mismo."}
                    {pedido.estado === "completado" && "Orden entregada con éxito. ¡Esperamos que la disfrutes y gracias por tu compra!"}
                  </p>
                </div>
              </div>

              {oferenteDetails && (
                <div className="oferente-contact-card" style={{ marginTop: "1rem", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)" }}>
                  <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Store size={20} style={{ color: "var(--primary-color)" }} />
                    Información del Establecimiento para Recoger
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <Store size={18} color="var(--text-muted)" style={{ marginTop: "2px" }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: "600" }}>{oferenteDetails.nombre_negocio || "Establecimiento"}</p>
                      </div>
                    </div>
                    {oferenteDetails.direccion && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <MapPin size={18} color="var(--text-muted)" style={{ marginTop: "2px" }} />
                        <div>
                          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>{oferenteDetails.direccion}</p>
                        </div>
                      </div>
                    )}
                    {oferenteDetails.telefono && (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Phone size={18} color="var(--text-muted)" />
                        <div>
                          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>{oferenteDetails.telefono}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Estado Admin / Oferente */
            <div className="orden-estado-section">
              <div className="estado-info">
                <label>Estado actual:</label>
                <span className={`badge badge-large ${getEstadoBadgeClass(pedido.estado)}`}>
                  {pedido.estado === "pendiente" && <><Clock size={16} /> {getStatusLabelText(pedido.estado)}</>}
                  {pedido.estado === "pagado" && <><CheckCircle size={16} /> {getStatusLabelText(pedido.estado)}</>}
                  {pedido.estado === "enviado" && <><Truck size={16} /> {getStatusLabelText(pedido.estado)}</>}
                  {pedido.estado === "completado" && <><CheckCircle size={16} /> {getStatusLabelText(pedido.estado)}</>}
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
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Marcar Pendiente
                      </button>
                    )}
                    {pedido.estado !== "pagado" && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          onEstadoChange(pedido.id_pedido, "pagado");
                          onClose();
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Marcar Pagado / En Prep.
                      </button>
                    )}
                    {pedido.estado !== "enviado" && (
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => {
                          onEstadoChange(pedido.id_pedido, "enviado");
                          onClose();
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Truck size={14} /> Marcar Listo para Recoger
                      </button>
                    )}
                    {pedido.estado !== "completado" && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          onEstadoChange(pedido.id_pedido, "completado");
                          onClose();
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Marcar Recogido / Historial
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Información del Cliente */}
          <div className="orden-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={20} /> Información del Cliente</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Nombre:</label>
                <span>{pedido.nombre_usuario || "N/A"}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{pedido.email_usuario || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Items del Pedido */}
          <div className="orden-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingBag size={20} /> Productos Ordenados</h3>
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
                      ><Package size={32} color="#999" /></div>
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
                        {formatCurrency(item.precio_unitario)} c/u
                      </div>
                      <div className="item-total">
                        <strong>
                          {formatCurrency(item.precio_unitario * item.cantidad)}
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
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><DollarSign size={20} /> Resumen del Pedido</h3>
            <div className="summary-grid">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(calcularSubtotal())}</span>
              </div>
              <div className="summary-row total">
                <span><strong>Total:</strong></span>
                <span><strong>{formatCurrency(pedido.total)}</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {isTurista ? (
            <button
              className="btn btn-outline"
              onClick={() => {
                onClose();
                navigate("/ordenes");
              }}
            >
              Ver Historial de Órdenes
            </button>
          ) : <div></div>}
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrdenDetailModal;