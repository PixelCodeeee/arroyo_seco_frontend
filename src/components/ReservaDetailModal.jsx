import React from "react";
import { X } from "lucide-react";
import "../styles/ReservaDetailModal.css";

function ReservaDetailModal({ 
  reserva, 
  isOpen, 
  onClose, 
  onEstadoChange, 
  onCancelar,
  canChangeEstado,
  isTurista 
}) {
  if (!isOpen || !reserva) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  const canCancel = () => {
    if (reserva.estado === "cancelada") return false;
    
    const fechaReserva = new Date(`${reserva.fecha}T${reserva.hora}`);
    const ahora = new Date();
    const horasRestantes = (fechaReserva - ahora) / (1000 * 60 * 60);
    
    return horasRestantes >= 24;
  };

  const getHorasRestantes = () => {
    const fechaReserva = new Date(`${reserva.fecha}T${reserva.hora}`);
    const ahora = new Date();
    const horasRestantes = (fechaReserva - ahora) / (1000 * 60 * 60);
    
    if (horasRestantes < 0) return "La reserva ya pasó";
    if (horasRestantes < 24) return `Faltan ${Math.round(horasRestantes)} horas (no cancelable)`;
    if (horasRestantes < 48) return `Faltan ${Math.round(horasRestantes)} horas`;
    
    const diasRestantes = Math.floor(horasRestantes / 24);
    return `Faltan ${diasRestantes} días`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reserva-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>🍽️ Detalle de Reserva #{reserva.id_reserva}</h2>
            <p className="modal-subtitle">
              {formatDate(reserva.fecha)} a las {formatTime(reserva.hora)}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          
          {/* Estado */}
          <div className="reserva-estado-section">
            <div className="estado-info">
              <label>Estado actual:</label>
              <span className={`badge badge-large ${getEstadoBadgeClass(reserva.estado)}`}>
                {reserva.estado === "pendiente" && "⏳ Pendiente"}
                {reserva.estado === "confirmada" && "✅ Confirmada"}
                {reserva.estado === "cancelada" && "❌ Cancelada"}
              </span>
            </div>

            {reserva.estado !== "cancelada" && (
              <div className="tiempo-restante">
                <span className="tiempo-icon">⏰</span>
                <span>{getHorasRestantes()}</span>
              </div>
            )}

            {canChangeEstado && (
              <div className="estado-actions">
                <label>Cambiar estado:</label>
                <div className="estado-buttons">
                  {reserva.estado !== "pendiente" && (
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        onEstadoChange(reserva.id_reserva, "pendiente");
                        onClose();
                      }}
                    >
                      ⏳ Marcar Pendiente
                    </button>
                  )}
                  {reserva.estado !== "confirmada" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        onEstadoChange(reserva.id_reserva, "confirmada");
                        onClose();
                      }}
                    >
                      ✅ Confirmar Reserva
                    </button>
                  )}
                  {reserva.estado !== "cancelada" && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        onEstadoChange(reserva.id_reserva, "cancelada");
                        onClose();
                      }}
                    >
                      ❌ Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            )}

            {isTurista && canCancel() && reserva.estado !== "cancelada" && (
              <div className="cancel-action">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onCancelar(reserva);
                    onClose();
                  }}
                >
                  ❌ Cancelar mi Reserva
                </button>
                <small className="cancel-warning">
                  ⚠️ Puedes cancelar hasta 24 horas antes de la reserva
                </small>
              </div>
            )}
          </div>

          {/* Información del Servicio */}
          <div className="reserva-section">
            <h3>🍽️ Información del Servicio</h3>
            <div className="servicio-card">
              <div className="servicio-details">
                <h4>{reserva.nombre_servicio || "N/A"}</h4>
                {reserva.nombre_oferente && (
                  <p className="oferente">
                    <strong>Establecimiento:</strong> {reserva.nombre_oferente}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles de la Reserva */}
          <div className="reserva-section">
            <h3>📅 Detalles de la Reserva</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Fecha:</label>
                <span>{formatDate(reserva.fecha)}</span>
              </div>
              <div className="info-item">
                <label>Hora:</label>
                <span>{formatTime(reserva.hora)}</span>
              </div>
              <div className="info-item">
                <label>Número de Personas:</label>
                <span>
                  <strong>{reserva.numero_personas} comensales</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Información del Cliente */}
          {!isTurista && (
            <div className="reserva-section">
              <h3>👤 Información del Cliente</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nombre:</label>
                  <span>{reserva.nombre_usuario || "N/A"}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{reserva.email_usuario || "N/A"}</span>
                </div>
                <div className="info-item">
                  <label>Teléfono:</label>
                  <span>{reserva.telefono_usuario || "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notas Adicionales */}
          {reserva.notas && (
            <div className="reserva-section">
              <h3>📝 Notas Adicionales</h3>
              <div className="notas-box">
                <p>{reserva.notas}</p>
              </div>
            </div>
          )}

          {/* Información Importante */}
          <div className="reserva-section info-section">
            <h3>ℹ️ Información Importante</h3>
            <ul className="info-list">
              <li>Por favor llega 10 minutos antes de tu hora de reserva</li>
              <li>Las cancelaciones deben hacerse con mínimo 24 horas de anticipación</li>
              <li>Si llegas tarde más de 15 minutos, la reserva puede ser cancelada</li>
              <li>En caso de no poder asistir, por favor cancela para dar oportunidad a otros comensales</li>
            </ul>
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

export default ReservaDetailModal;