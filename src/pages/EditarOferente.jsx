import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { oferentesAPI } from '../services/api';
import '../styles/crearOferente.css';

function EditarOferente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre_negocio: '',
    direccion: '',
    telefono: '',
    tipo: 'restaurante',
    imagen: '',
    horario_apertura: '',
    horario_cierre: '',
    dias_disponibles: []
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  useEffect(() => {
    fetchOferente();
  }, [id]);

  const fetchOferente = async () => {
    try {
      setFetching(true);
      const oferente = await oferentesAPI.getById(id);
      
      // Extraer datos del horario_disponibilidad JSON
      const horario = oferente.horario_disponibilidad || {};
      
      setFormData({
        nombre_negocio: oferente.nombre_negocio || '',
        direccion: oferente.direccion || '',
        telefono: oferente.telefono || '',
        tipo: oferente.tipo || 'restaurante',
        imagen: oferente.imagen || '',
        horario_apertura: horario.horario_apertura || '',
        horario_cierre: horario.horario_cierre || '',
        dias_disponibles: horario.dias || []
      });
    } catch (err) {
      setError(err.message || 'Error al cargar oferente');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDiasChange = (dia) => {
    setFormData(prev => ({
      ...prev,
      dias_disponibles: prev.dias_disponibles.includes(dia)
        ? prev.dias_disponibles.filter(d => d !== dia)
        : [...prev.dias_disponibles, dia]
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre_negocio.trim()) {
      errors.nombre_negocio = 'El nombre del negocio es requerido';
    } else if (formData.nombre_negocio.length < 3) {
      errors.nombre_negocio = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.direccion.trim()) {
      errors.direccion = 'La dirección es requerida';
    }

    if (formData.telefono && !/^\d{10,13}$/.test(formData.telefono.replace(/\s/g, ''))) {
      errors.telefono = 'El teléfono debe tener entre 10 y 13 dígitos';
    }

    if (formData.horario_apertura && formData.horario_cierre) {
      if (formData.horario_apertura >= formData.horario_cierre) {
        errors.horario_cierre = 'El horario de cierre debe ser posterior a la apertura';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      // Preparar horario_disponibilidad como objeto JSON
      const horario_disponibilidad = {
        dias: formData.dias_disponibles,
        horario_apertura: formData.horario_apertura || null,
        horario_cierre: formData.horario_cierre || null
      };

      // Preparar datos para enviar al backend
      const dataToSend = {
        nombre_negocio: formData.nombre_negocio,
        direccion: formData.direccion,
        tipo: formData.tipo,
        horario_disponibilidad: horario_disponibilidad,
        imagen: formData.imagen || null,
        telefono: formData.telefono || null
      };

      await oferentesAPI.update(id, dataToSend);
      alert('✅ Oferente actualizado exitosamente');
      navigate('/oferentes');
    } catch (err) {
      setError(err.message || 'Error al actualizar oferente');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="crear-oferente-container">
        <div className="crear-oferente-card">
          <div className="loading">Cargando datos del oferente...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="crear-oferente-container">
      <div className="crear-oferente-card">
        <div className="oferente-header">
          <button 
            onClick={() => navigate('/oferentes')} 
            className="back-button"
            aria-label="Volver"
          >
            ← Volver
          </button>
          <h2>Editar Oferente</h2>
          <p className="subtitle">Actualiza la información del oferente</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="oferente-form">
          {/* Información del Negocio */}
          <div className="form-section">
            <h3 className="section-title">Información del Negocio</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre_negocio">
                  Nombre del Negocio <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre_negocio"
                  name="nombre_negocio"
                  value={formData.nombre_negocio}
                  onChange={handleChange}
                  placeholder="Ej: Restaurante El Arroyo"
                  className={fieldErrors.nombre_negocio ? 'error' : ''}
                  required
                />
                {fieldErrors.nombre_negocio && (
                  <span className="field-error">{fieldErrors.nombre_negocio}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tipo">
                  Tipo de Negocio <span className="required">*</span>
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="restaurante">🍽️ Restaurante</option>
                  <option value="artesanal">🎨 Artesanal</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="imagen">URL de Imagen</label>
              <input
                type="url"
                id="imagen"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <small className="field-hint">Opcional: URL de la imagen del negocio</small>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="form-section">
            <h3 className="section-title">Información de Contacto</h3>
            
            <div className="form-group">
              <label htmlFor="direccion">
                Dirección <span className="required">*</span>
              </label>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Calle, número, colonia, ciudad, código postal"
                rows="3"
                className={fieldErrors.direccion ? 'error' : ''}
                required
              />
              {fieldErrors.direccion && (
                <span className="field-error">{fieldErrors.direccion}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono de Contacto</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: 4421234567"
                className={fieldErrors.telefono ? 'error' : ''}
                maxLength="13"
              />
              {fieldErrors.telefono && (
                <span className="field-error">{fieldErrors.telefono}</span>
              )}
              <small className="field-hint">10-13 dígitos</small>
            </div>
          </div>

          {/* Horarios y Disponibilidad */}
          <div className="form-section">
            <h3 className="section-title">Horarios y Disponibilidad</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="horario_apertura">Horario de Apertura</label>
                <input
                  type="time"
                  id="horario_apertura"
                  name="horario_apertura"
                  value={formData.horario_apertura}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="horario_cierre">Horario de Cierre</label>
                <input
                  type="time"
                  id="horario_cierre"
                  name="horario_cierre"
                  value={formData.horario_cierre}
                  onChange={handleChange}
                  className={fieldErrors.horario_cierre ? 'error' : ''}
                />
                {fieldErrors.horario_cierre && (
                  <span className="field-error">{fieldErrors.horario_cierre}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Días Disponibles</label>
              <div className="dias-checkboxes">
                {diasSemana.map(dia => (
                  <label key={dia} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.dias_disponibles.includes(dia)}
                      onChange={() => handleDiasChange(dia)}
                    />
                    <span>{dia}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/oferentes')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Actualizando...
                </>
              ) : (
                '✓ Actualizar Oferente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarOferente;