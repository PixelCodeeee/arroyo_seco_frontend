import { Clock, CheckCircle, Truck, XCircle, CreditCard, Utensils, Palette, AlertTriangle, ClipboardList, DollarSign, Tag, ImageIcon, Settings, Check, Edit3 } from 'lucide-react';
// src/components/EditarProducto.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productosAPI, oferentesAPI } from '../services/api';
import { toast } from 'sonner';
import '../styles/CrearProducto.css'; // <Check size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> usa el mismo estilo

function EditarProducto() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [loadingProducto, setLoadingProducto] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [imagenInput, setImagenInput] = useState('');

  // ---------------------------------------------------------------
  // LOAD PRODUCT + INITIAL DATA
  // ---------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const [cats, ofs] = await Promise.all([
          productosAPI.getCategorias(),
          oferentesAPI.getAll()
        ]);

        setCategorias(cats.categorias || []);
        setOferentes(ofs.oferentes || []);

        // Load existing product
        const res = await productosAPI.getAll();
        const producto = res.productos.find(p => p.id_producto == id);

        if (!producto) {
          setError('Producto no encontrado');
          return;
        }

        // Ownership guard: oferente can only edit their own products
        if (currentUser && currentUser.rol === 'oferente') {
          try {
            const miOferente = await oferentesAPI.getByUserId(currentUser.id_usuario);
            if (!miOferente || producto.id_oferente !== miOferente.id_oferente) {
              toast.error('No tienes permiso para editar este producto');
              navigate('/productos');
              return;
            }
          } catch {
            toast.error('Error al verificar permisos');
            navigate('/productos');
            return;
          }
        }

        setFormData({
          nombre: producto.nombre || '',
          descripcion: producto.descripcion || '',
          precio: producto.precio || '',
          inventario: producto.inventario || 0,
          id_categoria: producto.id_categoria || '',
          id_oferente: producto.id_oferente || '',
          imagenes: producto.imagenes || [],
          estatus: producto.estatus === 1 || producto.estatus === true,
        });

        setImagenInput((producto.imagenes || []).join(', '));

      } catch (e) {
        console.error(e);
        setError('Error al cargar el producto');
      } finally {
        setLoadingProducto(false);
      }
    })();
  }, [id]);

  // ---------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(p => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors(p => ({ ...p, [name]: '' }));
    }
  };

  const handleImagenChange = (e) => {
    const value = e.target.value;
    setImagenInput(value);

    const urls = value.split(',').map(s => s.trim()).filter(Boolean);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return setError('Corrige los errores');

    setLoading(true);

    try {
      await productosAPI.update(id, {
        ...formData,
        precio: parseFloat(formData.precio),
        inventario: parseInt(formData.inventario),
      });

      toast.success('Producto actualizado exitosamente');
      navigate('/productos');

    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error al actualizar');
      setError(err.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProducto) {
    return <div className="crear-producto-container"><p>Cargando...</p></div>;
  }

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------
  return (
    <div className="crear-producto-container">
      <div className="crear-producto-card">
        <div className="producto-header">
          <button
            onClick={() => navigate('/productos')}
            className="back-button"
          >
            ← Volver
          </button>
          <h2><Edit3 size={18} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Editar Producto</h2>
          <p className="subtitle">Modifica los datos de este producto</p>
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
              <label htmlFor="nombre">Nombre del Producto *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={fieldErrors.nombre ? 'error' : ''}
              />
              {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
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
                onChange={handleImagenChange}
                placeholder="URLs separadas por comas"
                rows="3"
              />

              {formData.imagenes.length > 0 && (
                <div className="image-preview">
                  <p className="preview-title">Vista previa:</p>
                  <div className="preview-grid">
                    {formData.imagenes.map((url, i) => (
                      <div key={i} className="preview-item">
                        <img
                          src={url}
                          alt={`Img ${i + 1}`}
                          onError={(e) => (e.target.src = '/images/placeholder.png')}
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

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Guardando...' : '✓ Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarProducto;
