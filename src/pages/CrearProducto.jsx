import { Clock, CheckCircle, Truck, XCircle, CreditCard, Utensils, Palette, AlertTriangle, Package, ClipboardList, DollarSign, Tag, ImageIcon, Settings, RefreshCcw, Info, Store } from 'lucide-react';
/// src/components/CrearProducto.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productosAPI, oferentesAPI } from '../services/api';

import { toast } from 'sonner';
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
    imagenes: [],
    estatus: true,
  });

  const [categorias, setCategorias] = useState([]);
  const [oferentes, setOferentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [imagenInput, setimagenInput] = useState('');
  const [hasOferenteProfile, setHasOferenteProfile] = useState(null); // null = loading

  // ---------------------------------------------------------------
  // INITIAL DATA
  // ---------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        // Always fetch categories
        const catRes = await productosAPI.getCategorias();
        setCategorias(catRes.categorias || []);

        if (currentUser?.rol === 'oferente' && currentUser?.id_usuario) {
          // Oferente: fetch only own oferente profile
          try {
            const miOferente = await oferentesAPI.getByUserId(currentUser.id_usuario);
            if (miOferente && miOferente.id_oferente) {
              setHasOferenteProfile(true);
              setOferentes([miOferente]);
              setFormData(p => ({ ...p, id_oferente: miOferente.id_oferente }));
            } else {
              setHasOferenteProfile(false);
            }
          } catch {
            setHasOferenteProfile(false);
          }
        } else if (currentUser?.rol === 'admin') {
          // Admin: fetch all oferentes
          const ofeRes = await oferentesAPI.getAll();
          setOferentes(ofeRes.oferentes || []);
          setHasOferenteProfile(true); // N/A for admin
        }
      } catch (e) {
        console.error(e);
        setError('Error al cargar datos iniciales');
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  // ---------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    fieldErrors[name] && setFieldErrors(p => ({ ...p, [name]: '' }));
  };

  const handleimagenChange = e => {
    const value = e.target.value;
    setimagenInput(value);

    const urls = value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // ✓ actualizar correctamente "imagenes" (antes decía "imagen")
    setFormData(p => ({ ...p, imagenes: urls }));
  };

  const validate = () => {
    const err = {};
    if (!formData.nombre.trim() || formData.nombre.length < 3)
      err.nombre = 'Nombre ≥ 3 caracteres';
    if (!formData.precio || formData.precio <= 0)
      err.precio = 'Precio > 0';
    if (formData.inventario < 0)
      err.inventario = 'Inventario ≥ 0';
    if (!formData.id_categoria)
      err.id_categoria = 'Selecciona categoría';
    if (!formData.id_oferente)
      err.id_oferente = 'Selecciona oferente';

    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return setError('Corrige los errores');

    setLoading(true);

    try {
      const res = await productosAPI.create({
        ...formData,
        precio: parseFloat(formData.precio),
        inventario: parseInt(formData.inventario),
      });
      if (res && res._offlineQueued) {
        toast.info(res.message || "Sin conexión — operación guardada para sincronizar", { icon: <RefreshCcw size={18} /> });
      } else {
        toast.success("Producto creado exitosamente");
      }
      navigate('/productos');
    } catch (er) {
      toast.error(er.message || 'Error al crear');
      setError(er.message || 'Error al crear');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------

  // Loading state
  if (initialLoading) {
    return (
      <div className="crear-producto-container">
        <div className="crear-producto-card">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  // Oferente with no profile
  if (currentUser?.rol === 'oferente' && hasOferenteProfile === false) {
    return (
      <div className="crear-producto-container">
        <div className="crear-producto-card">
          <div className="producto-header">
            <button onClick={() => navigate('/productos')} className="back-button" aria-label="Volver">← Volver</button>
            <h2><Package size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Crear Nuevo Producto</h2>
          </div>
          <div className="alert alert-error" style={{ background: 'var(--info-bg, #e0f2fe)', color: 'var(--info-color, #0369a1)', borderColor: 'var(--info-border, #7dd3fc)' }}>
            <span className="alert-icon"><Info size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /></span>
            <div>
              <strong>Necesitas crear tu perfil de oferente primero.</strong>
              <p style={{ marginTop: 8 }}>Antes de agregar productos, debes registrar tu negocio como oferente.</p>
              <Link to="/oferentes/crear" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
                Crear Mi Perfil de Oferente
              </Link>
            </div>
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
          <h2><Package size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Crear Nuevo Producto</h2>
          <p className="subtitle">Agrega un nuevo producto al catálogo</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon"><AlertTriangle size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />️</span>
            <span>{error}</span>
          </div>
        )}


        <form onSubmit={handleSubmit} className="producto-form">
          {/* Información Básica */}
          <div className="form-section">
            <h3 className="section-title"><ClipboardList size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Información Básica</h3>

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
                rows="4"
                maxLength="500"
              />
            </div>
          </div>

          {/* Precio e Inventario */}
          <div className="form-section">
            <h3 className="section-title"><DollarSign size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Precio e Inventario</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio">Precio (MXN) *</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={fieldErrors.precio ? 'error' : ''}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="inventario">Inventario *</label>
                <input
                  type="number"
                  id="inventario"
                  name="inventario"
                  value={formData.inventario}
                  onChange={handleChange}
                  min="0"
                  className={fieldErrors.inventario ? 'error' : ''}
                  required
                />
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div className="form-section">
            <h3 className="section-title"><Tag size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />️ Categorización</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_categoria">Categoría *</label>
                <select
                  id="id_categoria"
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  className={fieldErrors.id_categoria ? 'error' : ''}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(c => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre} ({c.tipo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="id_oferente">Oferente *</label>
                <select
                  id="id_oferente"
                  name="id_oferente"
                  value={formData.id_oferente}
                  onChange={handleChange}
                  disabled={currentUser?.rol === 'oferente'}
                  className={fieldErrors.id_oferente ? 'error' : ''}
                  required
                >
                  <option value="">Selecciona un oferente</option>
                  {oferentes.map(o => (
                    <option key={o.id_oferente} value={o.id_oferente}>
                      {o.nombre_negocio} - {o.tipo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="form-section">
            <h3 className="section-title"><ImageIcon size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />️ Imágenes</h3>

            <div className="form-group">
              <label>URLs de Imágenes</label>
              <textarea
                value={imagenInput}
                onChange={handleimagenChange}
                placeholder="URLs separadas por comas"
                rows="3"
              />

              {/* ✓ Preview corregido: formData.imagenes */}
              {formData.imagenes.length > 0 && (
                <div className="image-preview">
                  <p className="preview-title">Vista previa:</p>
                  <div className="preview-grid">
                    {formData.imagenes.map((url, i) => (
                      <div key={i} className="preview-item">
                        <img
                          src={url}
                          alt={`Img ${i + 1}`}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.png';
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
            <h3 className="section-title"><Settings size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} />️ Configuración</h3>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="estatus"
                checked={formData.estatus}
                onChange={handleChange}
              />
              Disponible para venta
            </label>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/productos')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearProducto;
