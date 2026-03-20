import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productosAPI } from '../services/api';
import '../styles/CrearProducto.css';

function EditarCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingCat, setLoadingCat] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await productosAPI.getCategorias();
        const categoria = res.categorias.find(c => c.id_categoria == id);

        if (!categoria) {
          setError('Categoría no encontrada');
          return;
        }

        setFormData({
          nombre: categoria.nombre || '',
          tipo: categoria.tipo || '',
        });
      } catch (e) {
        console.error(e);
        setError('Error al cargar categoría');
      } finally {
        setLoadingCat(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(p => ({ ...p, [name]: '' }));
    }
  };

  const validate = () => {
    const err = {};

    if (!formData.nombre.trim() || formData.nombre.length < 3)
      err.nombre = 'Nombre ≥ 3 caracteres';

    if (!formData.tipo)
      err.tipo = 'Selecciona un tipo';

    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return setError('Corrige los errores');

    setLoading(true);

    try {
      await productosAPI.actualizarCategoria(id, {
        nombre: formData.nombre,
        tipo: formData.tipo,
      });

      alert('Categoría actualizada');
      navigate('/categorias');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al actualizar categoría');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCat) {
    return <div className="crear-producto-container"><p>Cargando...</p></div>;
  }

  return (
    <div className="crear-producto-container">
      <div className="crear-producto-card">
        <div className="producto-header">
          <button onClick={() => navigate('/categorias')} className="back-button">
            ← Volver
          </button>
          <h2>📝 Editar Categoría</h2>
          <p className="subtitle">Modifica los datos de esta categoría</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="producto-form">

          <div className="form-section">
            <h3 className="section-title">📋 Información Básica</h3>

            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
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

            {/* Tipo */}
            <div className="form-group">
              <label htmlFor="tipo">Tipo *</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className={fieldErrors.tipo ? 'error' : ''}
              >
                <option value="">Selecciona tipo</option>
                <option value="gastronomica">Gastronómica</option>
                <option value="artesanal">Artesanal</option>
              </select>
              {fieldErrors.tipo && <span className="field-error">{fieldErrors.tipo}</span>}
            </div>

          </div>

          {/* Acciones */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/categorias')}
            >
              Cancelar
            </button>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Guardando...' : '✓ Guardar Cambios'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default EditarCategoria;
