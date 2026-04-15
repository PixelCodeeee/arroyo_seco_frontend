import { Clock, CheckCircle, Truck, XCircle, CreditCard, Utensils, Palette, AlertTriangle, Info, RefreshCcw } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { oferentesAPI, usuariosAPI } from '../services/api';

import { toast } from 'sonner';
import '../styles/crearOferente.css';

function CrearOferente() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_usuario: '',
    nombre_negocio: '',
    direccion: '',
    telefono: '',
    tipo: 'restaurante',
    imagen: '',
    horario_apertura: '',
    horario_cierre: '',
    dias_disponibles: []
  });

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isOferente, setIsOferente] = useState(false);

  const diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('currentUser') || 'null');

      if (!userData) {
        // No user logged in at all, redirect away
        navigate('/login');
        return;
      }

      if (userData.rol === 'oferente') {
        setIsOferente(true);
        setFormData(prev => ({
          ...prev,
          id_usuario: userData.id_usuario.toString()
        }));
        setUsuarios([userData]);

      } else if (userData.rol === 'admin') {
        await fetchUsuarios();

      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Error initializing component:', err);
      setError('Error al cargar información del usuario');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await usuariosAPI.getAll();
      const oferentesUsers = response.usuarios.filter(u => u.rol === 'oferente');
      setUsuarios(oferentesUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario escribe
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

    if (!formData.id_usuario) {
      errors.id_usuario = 'Debes seleccionar un usuario';
    }

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
      const horario_disponibilidad = {
        dias: formData.dias_disponibles,
        horario_apertura: formData.horario_apertura || null,
        horario_cierre: formData.horario_cierre || null
      };

      const dataToSend = {
        id_usuario: formData.id_usuario,
        nombre_negocio: formData.nombre_negocio,
        direccion: formData.direccion,
        tipo: formData.tipo,
        horario_disponibilidad: horario_disponibilidad,
        imagen: formData.imagen || null,
        telefono: formData.telefono || null
      };

      const result = await oferentesAPI.create(dataToSend);
      if (result && result._offlineQueued) {
        toast.info(result.message || "Sin conexión — guardado en cola para sincronizar", { icon: <RefreshCcw size={18} /> });
      } else {
        toast.success("Oferente creado exitosamente");
      }
      navigate('/oferentes');
    } catch (err) {
      toast.error(err.message || 'Error al crear oferente. Por favor intenta nuevamente.');
      setError(err.message || 'Error al crear oferente. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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
          <h2>Crear Nuevo Oferente</h2>
          <p className="subtitle">Registra un nuevo oferente en el sistema</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon"><AlertTriangle size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></span>
            <span>{error}</span>
          </div>
        )}


        <form onSubmit={handleSubmit} className="oferente-form">
          {/* Usuario Oferente */}
          <div className="form-section">
            <h3 className="section-title">Información del Usuario</h3>

            <div className="form-group">
              <label htmlFor="id_usuario">
                Usuario Oferente <span className="required">*</span>
              </label>
              <select
                id="id_usuario"
                name="id_usuario"
                value={formData.id_usuario}
                onChange={handleChange}
                className={fieldErrors.id_usuario ? 'error' : ''}
                disabled={isOferente}
                required
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombre} - {usuario.correo}
                  </option>
                ))}
              </select>
              {fieldErrors.id_usuario && (
                <span className="field-error">{fieldErrors.id_usuario}</span>
              )}
              {isOferente && (
                <small className="field-hint">
                  <Info size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Como oferente, estás registrando tu propio negocio
                </small>
              )}
            </div>
          </div>

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
                  <option value="restaurante"><Utensils size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Restaurante</option>
                  <option value="artesanal"><Palette size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Artesanal</option>
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
                  Creando...
                </>
              ) : (
                'Crear Oferente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearOferente;