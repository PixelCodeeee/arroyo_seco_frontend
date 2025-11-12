// src/components/EditarProducto.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productosAPI, categoriasAPI, oferentesAPI } from '../services/api';
import '../styles/CrearProducto.css';

function EditarProducto() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    inventario: 0,
    id_categoria: '',
    id_oferente: '',
    imagenes: [],
    esta_disponible: true
  });
  
  const [categorias, setCategorias] = useState([]);
  const [oferentes, setOferentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [imagenesInput, setImagenesInput] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setFetching(true);
      
      const [productoRes, categoriasRes, oferentesRes] = await Promise.all([
        productosAPI.getById(id),
        categoriasAPI.getAll(),
        oferentesAPI.getAll()
      ]);
      
      setCategorias(categoriasRes.categorias || []);
      setOferentes(oferentesRes.oferentes || []);
      
      // Cargar datos del producto
      const producto = productoRes.data || productoRes;
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        inventario: producto.inventario || 0,
        id_categoria: producto.id_categoria || '',
        id_oferente: producto.id_oferente || '',
        imagenes: producto.imagenes || [],
        esta_disponible: producto.esta_disponible !== false
      });
      
      // Establecer las imágenes en el textarea
      if (producto.imagenes && producto.imagenes.length > 0) {
        setImagenesInput(producto.imagenes.join(', '));
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar el producto');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImagenesChange = (e) => {
    setImagenesInput(e.target.value);
    // Convertir las URLs separadas por comas en un array
    const urls = e.target.value
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    setFormData(prev => ({
      ...prev,
      imagenes: urls
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre del producto es requerido';
    } else if (formData.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.precio || formData.precio <= 0) {
      errors.precio = 'El precio debe ser mayor a 0';
    }

    if (formData.inventario < 0) {
      errors.inventario = 'El inventario no puede ser negativo';
    }

    if (!formData.id_categoria) {
      errors.id_categoria = 'Debes seleccionar una categoría';
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
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        inventario: parseInt(formData.inventario),
        id_categoria: formData.id_categoria,
        imagenes: formData.imagenes,
        esta_disponible: formData.esta_disponible
      };

      await productosAPI.update(id, dataToSend);
      
      alert('✅ Producto actualizado exitosamente');
      navigate('/productos');
    } catch (err) {
      setError(err.message || 'Error al actualizar producto. Por favor intenta nuevamente.');
      console.error('Error updating producto:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInventario = async (adjustment) => {
    try {
      const nuevoInventario = parseInt(formData.inventario) + adjustment;
      
      if (nuevoInventario < 0) {
        alert('❌ El inventario no puede ser negativo');
        return;
      }
      
      await productosAPI.updateInventario(id, { cantidad: adjustment });
      
      setFormData(prev => ({
        ...prev,
        inventario: nuevoInventario
      }));
      
      alert(`✅ Inventario ${adjustment > 0 ? 'aumentado' : 'disminuido'} exitosamente`);
    } catch (err) {
      alert(err.message || 'Error al actualizar inventario');
    }
  };

  if (fetching) {
    return (
      <div className="crear-producto-container">
        <div className="crear-producto-card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando información del producto...</p>
          </div>
        </div>
      </div>
    );
  }

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
          <h2>✏️ Editar Producto</h2>
          <p className="subtitle">Actualiza la información del producto</p>
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
                  Inventario Actual <span className="required">*</span>
                </label>
                <div className="inventory-control">
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
                  <div className="inventory-buttons">
                    <button
                      type="button"
                      onClick={() => handleUpdateInventario(-1)}
                      className="btn-inventory decrease"
                      title="Disminuir inventario"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateInventario(1)}
                      className="btn-inventory increase"
                      title="Aumentar inventario"
                    >
                      +
                    </button>
                  </div>
                </div>
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
                <label htmlFor="id_oferente">Oferente</label>
                <select
                  id="id_oferente"
                  name="id_oferente"
                  value={formData.id_oferente}
                  disabled
                  className="disabled-field"
                >
                  <option value="">Selecciona un oferente</option>
                  {oferentes.map(oferente => (
                    <option key={oferente.id_oferente} value={oferente.id_oferente}>
                      {oferente.nombre_negocio} - {oferente.tipo}
                    </option>
                  ))}
                </select>
                <span className="form-hint">
                  El oferente no puede ser modificado
                </span>
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="form-section">
            <h3 className="section-title">🖼️ Imágenes</h3>
            
            <div className="form-group">
              <label htmlFor="imagenes">URLs de Imágenes</label>
              <textarea
                id="imagenes"
                name="imagenes"
                value={imagenesInput}
                onChange={handleImagenesChange}
                placeholder="Ingresa las URLs de las imágenes separadas por comas&#10;Ej: https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                rows="3"
              />
              <span className="form-hint">
                Separa múltiples URLs con comas. Las imágenes deben estar alojadas en línea.
              </span>
              
              {formData.imagenes.length > 0 && (
                <div className="image-preview">
                  <p className="preview-title">Vista previa:</p>
                  <div className="preview-grid">
                    {formData.imagenes.map((url, index) => (
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
                  Actualizando...
                </>
              ) : (
                '✓ Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarProducto;