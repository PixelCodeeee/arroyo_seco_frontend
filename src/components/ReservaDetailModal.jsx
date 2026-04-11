import React from "react";
import {
  X, Utensils, Clock, CheckCircle, XCircle,
  AlertCircle, CalendarDays, User, Clipboard, Info
} from 'lucide-react';
import "../styles/ReservaDetailModal.css";
import {
  formatDate,
  formatTime,
  getEstadoBadgeClass,
  canCancelReserva,
  getTiempoRestanteLabel,
} from "../utils/Reservautils";

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

  // Derive from shared utils — fecha/hora are now correctly parsed
  const cancelable = canCancelReserva(reserva);
  const tiempoRestante = getTiempoRestanteLabel(reserva.fecha, reserva.hora);

  const handleEstado = (nuevoEstado) => {
    onEstadoChange(reserva.id_reserva, nuevoEstado);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reserva-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils size={24} /> Detalle de Reserva #{reserva.id_reserva}
            </h2>
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
                {reserva.estado === "pendiente" && <><Clock size={16} />        Pendiente</>}
                {reserva.estado === "confirmada" && <><CheckCircle size={16} />  Confirmada</>}
                {reserva.estado === "cancelada" && <><XCircle size={16} />      Cancelada</>}
              </span>
            </div>

            {/* Time remaining — only shown when not cancelled */}
            {reserva.estado !== "cancelada" && (
              <div className="tiempo-restante">
                <Clock size={16} className="tiempo-icon" />
                <span>{tiempoRestante}</span>
              </div>
            )}

            {/* Admin / oferente status controls */}
            {canChangeEstado && (
              <div className="estado-actions">
                <label>Cambiar estado:</label>
                <div className="estado-buttons">
                  {reserva.estado !== "pendiente" && (
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEstado("pendiente")}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Clock size={14} /> Marcar Pendiente
                    </button>
                  )}
                  {reserva.estado !== "confirmada" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleEstado("confirmada")}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckCircle size={14} /> Confirmar Reserva
                    </button>
                  )}
                  {reserva.estado !== "cancelada" && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEstado("cancelada")}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <XCircle size={14} /> Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Turista cancel button */}
            {isTurista && cancelable && reserva.estado !== "cancelada" && (
              <div className="cancel-action">
                <button
                  className="btn btn-danger"
                  onClick={() => { onCancelar(reserva); onClose(); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <XCircle size={14} /> Cancelar mi Reserva
                </button>
                <small className="cancel-warning">
                  <AlertCircle size={14} /> Puedes cancelar hasta 24 horas antes de la reserva
                </small>
              </div>
            )}
          </div>

          {/* Información del Servicio */}
          <div className="reserva-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils size={20} /> Información del Servicio
            </h3>
            <div className="servicio-card">
              <div className="servicio-details">
                <h4>{reserva.servicio?.nombre || "N/A"}</h4>
                {reserva.servicio?.oferente?.nombre && (
                  <p className="oferente">
                    <strong>Establecimiento:</strong> {reserva.servicio.oferente.nombre}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles de la Reserva */}
          <div className="reserva-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={20} /> Detalles de la Reserva
            </h3>
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
                <span><strong>{reserva.numero_personas} comensales</strong></span>
              </div>
            </div>
          </div>

          {/* Información del Cliente (non-turista only) */}
          {!isTurista && (
            <div className="reserva-section">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} /> Información del Cliente
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nombre:</label>
                  <span>{reserva.usuario?.nombre || "N/A"}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{reserva.usuario?.correo || "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notas Adicionales */}
          {reserva.notas && (
            <div className="reserva-section">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clipboard size={20} /> Notas Adicionales
              </h3>
              <div className="notas-box">
                <p>{reserva.notas}</p>
              </div>
            </div>
          )}

          {/* Información Importante */}
          <div className="reserva-section info-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={20} /> Información Importante
            </h3>
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
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default ReservaDetailModal;