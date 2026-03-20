import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Info } from 'lucide-react';
import { serviciosAPI, reservasAPI } from '../services/api';
import '../styles/ReservaModal.css';

function ReservaModal({ oferente, isOpen, onClose, onSuccess }) {
  const [servicios, setServicios] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [formData, setFormData] = useState({
    id_servicio: '',
    fecha: '',
    hora: '',
    numero_personas: 2,
    notas: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [checkingDisponibilidad, setCheckingDisponibilidad] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    if (isOpen && oferente?.id_oferente) {
      fetchServicios();
      // Reset form cuando se abre el modal
      setFormData({
        id_servicio: '',
        fecha: '',
        hora: '',
        numero_personas: 2,
        notas: '',
      });
      setAceptaTerminos(false);
      setError('');
      setFieldErrors({});
    }
  }, [isOpen, oferente]);

  const fetchServicios = async () => {
    try {
      setLoadingServicios(true);
      const response = await serviciosAPI.getByOferenteId(oferente.id_oferente);
      
      // Filtrar solo servicios activos
      const serviciosActivos = (response.servicios || []).filter(s => s.estatus === 1);
      setServicios(serviciosActivos);
      
      // Auto-seleccionar el primer servicio si solo hay uno
      if (serviciosActivos.length === 1) {
        setFormData(prev => ({ ...prev, id_servicio: serviciosActivos[0].id_servicio }));
      }
    } catch (err) {
      console.error('Error fetching servicios:', err);
      setError('Error al cargar servicios disponibles');
    } finally {
      setLoadingServicios(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Limpiar error general
    if (error) {
      setError('');
    }
  };

  // Verificar disponibilidad cuando se completan servicio, fecha y hora
  useEffect(() => {
    const checkAvailability = async () => {
      if (formData.id_servicio && formData.fecha && formData.hora) {
        try {
          setCheckingDisponibilidad(true);
          const response = await reservasAPI.checkDisponibilidad(
            formData.id_servicio,
            formData.fecha,
            formData.hora
          );
          
          if (!response.disponible) {
            setFieldErrors(prev => ({
              ...prev,
              hora: 'Este horario ya no está disponible. Por favor selecciona otro.'
            }));
          } else {
            // Limpiar error de hora si está disponible
            setFieldErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.hora;
              return newErrors;
            });
          }
        } catch (err) {
          console.error('Error checking disponibilidad:', err);
        } finally {
          setCheckingDisponibilidad(false);
        }
      }
    };

    // Debounce para evitar demasiadas llamadas
    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [formData.id_servicio, formData.fecha, formData.hora]);

  const validate = () => {
    const errors = {};
    
    if (!formData.id_servicio) {
      errors.id_servicio = 'Selecciona un servicio';
    }
    
    if (!formData.fecha) {
      errors.fecha = 'Selecciona una fecha';
    } else {
      // Verificar que la fecha sea futura
      const fechaSeleccionada = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaSeleccionada < hoy) {
        errors.fecha = 'La fecha debe ser futura';
      }
    }
    
    if (!formData.hora) {
      errors.hora = 'Selecciona una hora';
    }
    
    if (!formData.numero_personas || formData.numero_personas < 1) {
      errors.numero_personas = 'Mínimo 1 persona';
    }
    
    // Verificar capacidad del servicio seleccionado
    if (formData.id_servicio && formData.numero_personas) {
      const servicioSeleccionado = servicios.find(s => s.id_servicio == formData.id_servicio);
      if (servicioSeleccionado?.capacidad && formData.numero_personas > servicioSeleccionado.capacidad) {
        errors.numero_personas = `Máximo ${servicioSeleccionado.capacidad} personas`;
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que el usuario esté autenticado
    if (!currentUser || !currentUser.id_usuario) {
      setError('Debes iniciar sesión para hacer una reserva');
      return;
    }
    
    // Validar términos y condiciones
    if (!aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones de cancelación');
      return;
    }
    
    // Validar formulario
    if (!validate()) {
      setError('Por favor corrige los errores en el formulario');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Verificar disponibilidad una última vez antes de crear
      const disponibilidad = await reservasAPI.checkDisponibilidad(
        formData.id_servicio,
        formData.fecha,
        formData.hora
      );
      
      if (!disponibilidad.disponible) {
        setError('Lo sentimos, este horario acaba de ser reservado. Por favor selecciona otro.');
        setFieldErrors({ hora: 'Horario no disponible' });
        return;
      }
      
      // Preparar datos de la reserva
      const reservaData = {
        id_usuario: currentUser.id_usuario,
        id_servicio: parseInt(formData.id_servicio),
        fecha: formData.fecha,
        hora: formData.hora,
        numero_personas: parseInt(formData.numero_personas),
        estado: 'pendiente', // Las nuevas reservas inician como pendientes
        notas: formData.notas.trim() || null,
      };
      
      // Crear la reserva
      const response = await reservasAPI.create(reservaData);
      
      // Reset form
      setFormData({
        id_servicio: '',
        fecha: '',
        hora: '',
        numero_personas: 2,
        notas: '',
      });
      setAceptaTerminos(false);
      
      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess(response.reserva);
      }
      
      // Cerrar modal
      onClose();
      
      // Mostrar mensaje de éxito
      alert('¡Reserva creada exitosamente! Recibirás una confirmación pronto.');
      
    } catch (err) {
      console.error('Error creating reserva:', err);
      
      // Manejar diferentes tipos de errores
      if (err.message.includes('Ya existe una reserva')) {
        setError(err.message);
        if (err.message.includes('misma fecha y hora')) {
          setFieldErrors({ hora: 'Este horario ya está reservado' });
        } else if (err.message.includes('misma fecha')) {
          setFieldErrors({ fecha: 'Ya tienes una reserva para esta fecha' });
        }
      } else {
        setError(err.message || 'Error al crear la reserva. Por favor intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Permitir reservas hasta 3 meses adelante
    return maxDate.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>🍽️ Hacer Reservación</h2>
            <p className="modal-subtitle">{oferente.nombre_negocio}</p>
          </div>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="modal-body">
          
          {/* Mensaje de error general */}
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          
          {/* Mensaje de autenticación */}
          {!currentUser && (
            <div className="alert alert-warning">
              <Info size={20} />
              <span>Debes iniciar sesión para hacer una reserva</span>
            </div>
          )}
          
          {loadingServicios ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando servicios disponibles...</p>
            </div>
          ) : servicios.length === 0 ? (
            <div className="empty-state">
              <p>😔 No hay servicios disponibles en este momento.</p>
              <small>Por favor intenta más tarde o contacta al establecimiento.</small>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reserva-form">
              
              {/* Servicio */}
              <div className="form-group">
                <label htmlFor="id_servicio">
                  Servicio <span className="required">*</span>
                </label>
                <select
                  id="id_servicio"
                  name="id_servicio"
                  value={formData.id_servicio}
                  onChange={handleChange}
                  className={fieldErrors.id_servicio ? 'error' : ''}
                  disabled={loading || !currentUser}
                  required
                >
                  <option value="">Selecciona un servicio</option>
                  {servicios.map(servicio => (
                    <option key={servicio.id_servicio} value={servicio.id_servicio}>
                      {servicio.nombre} - {servicio.rango_precio} 
                      {servicio.capacidad && ` (hasta ${servicio.capacidad} personas)`}
                    </option>
                  ))}
                </select>
                {fieldErrors.id_servicio && (
                  <span className="field-error">{fieldErrors.id_servicio}</span>
                )}
              </div>
              
              {/* Descripción del servicio seleccionado */}
              {formData.id_servicio && (
                <div className="servicio-info">
                  <Info size={16} />
                  <p>
                    {servicios.find(s => s.id_servicio == formData.id_servicio)?.descripcion}
                  </p>
                </div>
              )}
              
              {/* Fecha y Hora */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha">
                    Fecha <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className={fieldErrors.fecha ? 'error' : ''}
                    disabled={loading || !currentUser}
                    required
                  />
                  {fieldErrors.fecha && (
                    <span className="field-error">{fieldErrors.fecha}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="hora">
                    Hora <span className="required">*</span>
                    {checkingDisponibilidad && (
                      <span className="checking-badge">Verificando...</span>
                    )}
                  </label>
                  <input
                    type="time"
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className={fieldErrors.hora ? 'error' : ''}
                    disabled={loading || !currentUser || checkingDisponibilidad}
                    required
                  />
                  {fieldErrors.hora && (
                    <span className="field-error">{fieldErrors.hora}</span>
                  )}
                </div>
              </div>
              
              {/* Número de Personas */}
              <div className="form-group">
                <label htmlFor="numero_personas">
                  Número de Personas <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="numero_personas"
                  name="numero_personas"
                  value={formData.numero_personas}
                  onChange={handleChange}
                  min="1"
                  max={formData.id_servicio 
                    ? servicios.find(s => s.id_servicio == formData.id_servicio)?.capacidad || 100
                    : 100}
                  className={fieldErrors.numero_personas ? 'error' : ''}
                  disabled={loading || !currentUser}
                  required
                />
                {fieldErrors.numero_personas && (
                  <span className="field-error">{fieldErrors.numero_personas}</span>
                )}
                {formData.id_servicio && (
                  <small className="field-hint">
                    Capacidad máxima: {servicios.find(s => s.id_servicio == formData.id_servicio)?.capacidad || 'N/A'} personas
                  </small>
                )}
              </div>
              
              {/* Notas */}
              <div className="form-group">
                <label htmlFor="notas">
                  Notas Adicionales <span className="optional">(Opcional)</span>
                </label>
                <textarea
                  id="notas"
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows="3"
                  maxLength="500"
                  placeholder="Ej: Alergias alimentarias, preferencias de mesa, ocasión especial..."
                  disabled={loading || !currentUser}
                />
                <small className="field-hint">
                  {formData.notas.length}/500 caracteres
                </small>
              </div>
              
              {/* Términos y Condiciones */}
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="aceptaTerminos"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    disabled={loading || !currentUser}
                  />
                  <label htmlFor="aceptaTerminos" className="checkbox-label">
                    <strong>Acepto los términos de cancelación:</strong> Entiendo que cualquier 
                    cancelación debe realizarse con <strong>al menos 24 horas de anticipación</strong> a 
                    la fecha y hora de la reserva. <span className="required">*</span>
                  </label>
                </div>
                {!aceptaTerminos && error.includes('términos') && (
                  <span className="field-error">Debes aceptar los términos de cancelación</span>
                )}
              </div>
              
              {/* Información adicional */}
              <div className="info-box">
                <Info size={16} />
                <div>
                  <strong>Importante:</strong>
                  <ul>
                    <li>Tu reserva quedará en estado <strong>pendiente</strong> hasta ser confirmada</li>
                    <li>Recibirás una notificación cuando sea confirmada</li>
                    <li>Puedes cancelar hasta 24 horas antes de la fecha</li>
                  </ul>
                </div>
              </div>
              
              {/* Actions */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading || 
                    !currentUser || 
                    servicios.length === 0 || 
                    checkingDisponibilidad ||
                    !aceptaTerminos
                  }
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Reservando...
                    </>
                  ) : (
                    '✓ Confirmar Reserva'
                  )}
                </button>
              </div>
              
            </form>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default ReservaModal;