/// src/components/CrearProducto.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productosAPI, categoriasAPI, oferentesAPI } from '../services/api';
import '../styles/CrearProducto.css';

function CrearProducto() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    inventario: 0,
    id_categoria: '',
    id_oferente: '',
    imagen: [],          // <-- backend expects "imagen"
    esta_disponible: true
  });

  const [categorias, setCategorias] = useState([]);
  const [oferentes, setOferentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [imagenInput, setimagenInput] = useState('');

  // ---------------------------------------------------------------
  // INITIAL DATA
  // ---------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const [catRes, ofeRes] = await Promise.all([
          categoriasAPI.getAll(),
          oferentesAPI.getAll()
        ]);
        setCategorias(catRes.categorias || []);
        setOferentes(ofeRes.oferentes || []);

        // Pre-select the logged-in oferente
        if (currentUser?.rol === 'oferente' && currentUser?.id_oferente) {
          setFormData(p => ({ ...p, id_oferente: currentUser.id_oferente }));
        }
      } catch (e) {
        setError('Error al cargar datos iniciales');
      }
    })();
  }, []);

  // ---------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    fieldErrors[name] && setFieldErrors(p => ({ ...p, [name]: '' }));
  };

  const handleimagenChange = e => {
    setimagenInput(e.target.value);
    const urls = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(p => ({ ...p, imagen: urls }));
  };

  const validate = () => {
    const err = {};
    if (!formData.nombre.trim() || formData.nombre.length < 3) err.nombre = 'Nombre ≥ 3 caracteres';
    if (!formData.precio || formData.precio <= 0) err.precio = 'Precio > 0';
    if (formData.inventario < 0) err.inventario = 'Inventario ≥ 0';
    if (!formData.id_categoria) err.id_categoria = 'Selecciona categoría';
    if (!formData.id_oferente) err.id_oferente = 'Selecciona oferente';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return setError('Corrige los errores');

    setLoading(true);
    try {
      await productosAPI.create({
        ...formData,
        precio: parseFloat(formData.precio),
        inventario: parseInt(formData.inventario)
      });
      alert('Producto creado');
      navigate('/productos');
    } catch (er) {
      setError(er.message || 'Error al crear');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-producto-container">
      <div className="crear-producto-card">
        <div className="producto-header">
          <button 
            onClick={() => navigate('/productos')} 
            className="back-button"
            aria-label="Volver"
          >
            ← Volver
          </button>
          <h2>📦 Crear Nuevo Producto</h2>
          <p className="subtitle">Agrega un nuevo producto al catálogo</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="producto-form">
          {/* Información Básica */}
          <div className="form-section">
            <h3 className="section-title">📋 Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre del Producto <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Tacos de Pastor"
                className={fieldErrors.nombre ? 'error' : ''}
                required
              />
              {fieldErrors.nombre && (
                <span className="field-error">{fieldErrors.nombre}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe el producto, ingredientes, características especiales..."
                rows="4"
                maxLength="500"
              />
              <span className="char-count">
                {formData.descripcion.length}/500 caracteres
              </span>
            </div>
          </div>

          {/* Precio e Inventario */}
          <div className="form-section">
            <h3 className="section-title">💰 Precio e Inventario</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio">
                  Precio (MXN) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={fieldErrors.precio ? 'error' : ''}
                  required
                />
                {fieldErrors.precio && (
                  <span className="field-error">{fieldErrors.precio}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="inventario">
                  Inventario Inicial <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="inventario"
                  name="inventario"
                  value={formData.inventario}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={fieldErrors.inventario ? 'error' : ''}
                  required
                />
                {fieldErrors.inventario && (
                  <span className="field-error">{fieldErrors.inventario}</span>
                )}
              </div>
            </div>
          </div>

          {/* Categorización */}
          <div className="form-section">
            <h3 className="section-title">🏷️ Categorización</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_categoria">
                  Categoría <span className="required">*</span>
                </label>
                <select
                  id="id_categoria"
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  className={fieldErrors.id_categoria ? 'error' : ''}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nombre} ({categoria.tipo})
                    </option>
                  ))}
                </select>
                {fieldErrors.id_categoria && (
                  <span className="field-error">{fieldErrors.id_categoria}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="id_oferente">
                  Oferente <span className="required">*</span>
                </label>
                <select
                  id="id_oferente"
                  name="id_oferente"
                  value={formData.id_oferente}
                  onChange={handleChange}
                  className={fieldErrors.id_oferente ? 'error' : ''}
                  disabled={currentUser?.rol === 'oferente'}
                  required
                >
                  <option value="">Selecciona un oferente</option>
                  {oferentes.map(oferente => (
                    <option key={oferente.id_oferente} value={oferente.id_oferente}>
                      {oferente.nombre_negocio} - {oferente.tipo}
                    </option>
                  ))}
                </select>
                {fieldErrors.id_oferente && (
                  <span className="field-error">{fieldErrors.id_oferente}</span>
                )}
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="form-section">
            <h3 className="section-title">🖼️ Imágenes</h3>
            
            <div className="form-group">
              <label htmlFor="imagen">URLs de Imágenes</label>
              <textarea
                id="imagen"
                name="imagen"
                value={imagenInput}
                onChange={handleimagenChange}
                placeholder="Ingresa las URLs de las imágenes separadas por comas&#10;Ej: https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                rows="3"
              />
              <span className="form-hint">
                Separa múltiples URLs con comas. Las imágenes deben estar alojadas en línea.
              </span>
              
              {formData.imagen && formData.imagen.length > 0 && (
  <div className="image-preview">
    <p className="preview-title">Vista previa:</p>
    <div className="preview-grid">
      {formData.imagen.map((url, index) => (
        <div key={index} className="preview-item">
          <img
            src={url}
            alt={`Imagen ${index + 1}`}
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
              e.target.alt = 'Error al cargar imagen';
            }}
          />
        </div>
      ))}
    </div>
  </div>
)}
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="form-section">
            <h3 className="section-title">⚙️ Configuración</h3>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="esta_disponible"
                    checked={formData.esta_disponible}
                    onChange={handleChange}
                  />
                  <span>Producto disponible para venta</span>
                </label>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/productos')}
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
                '✓ Crear Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearProducto;