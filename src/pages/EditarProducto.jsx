// src/components/EditarProducto.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productosAPI, categoriasAPI, oferentesAPI } from '../services/api';
import '../styles/CrearProducto.css';

function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', precio: '', inventario: 0,
    id_categoria: '', id_oferente: '', imagen: [], esta_disponible: true
  });

  const [categorias, setCategorias] = useState([]);
  const [oferentes, setOferentes] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [imagenesInput, setImagenesInput] = useState('');

  // ---------------------------------------------------------------
  // LOAD PRODUCT + SELECTS
  // ---------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        setFetching(true);
        const [prodRes, catRes, ofeRes] = await Promise.all([
          productosAPI.getById(id),          // GET /api/productos/detalle/:id
          categoriasAPI.getAll(),
          oferentesAPI.getAll()
        ]);

        const p = prodRes.producto;          // backend returns { producto: {...} }
        setFormData({
          nombre: p.nombre || '',
          descripcion: p.descripcion || '',
          precio: p.precio || '',
          inventario: p.inventario || 0,
          id_categoria: p.id_categoria || '',
          id_oferente: p.id_oferente || '',
          imagen: p.imagen || [],
          esta_disponible: p.esta_disponible !== false
        });
        setImagenesInput((p.imagen || []).join(', '));

        setCategorias(catRes.categorias || []);
        setOferentes(ofeRes.oferentes || []);
      } catch (e) {
        setError('No se pudo cargar el producto');
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  // ---------------------------------------------------------------
  // INVENTORY PATCH
  // ---------------------------------------------------------------
  const adjustInventory = async (delta) => {
    try {
      const nuevo = formData.inventario + delta;
      if (nuevo < 0) throw new Error('Inventario no puede ser negativo');
      await productosAPI.updateInventario(id, { cantidad: delta });
      setFormData(p => ({ ...p, inventario: nuevo }));
      alert('Inventario actualizado');
    } catch (er) {
      alert(er.message || 'Error');
    }
  };

  // ---------------------------------------------------------------
  // SUBMIT UPDATE
  // ---------------------------------------------------------------
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await productosAPI.update(id, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        inventario: parseInt(formData.inventario),
        id_categoria: formData.id_categoria,
        imagen: formData.imagen,
        esta_disponible: formData.esta_disponible
      });
      alert('Producto actualizado');
      navigate('/productos');
    } catch (er) {
      setError(er.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // RENDER (same UI, only field name "imagen")
  // ---------------------------------------------------------------
  if (fetching) return <div className="loading"><div className="spinner"></div><p>Cargando…</p></div>;

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
              <label htmlFor="imagen">URLs de Imágen</label>
              <textarea
                id="imagen"
                name="imagen"
                value={imagenesInput}
                onChange={handleImagenesChange}
                placeholder="Ingresa las URLs de la imágen&#10;Ej: https://ejemplo.com/imagen1.jpg"
                rows="3"
              />
              
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