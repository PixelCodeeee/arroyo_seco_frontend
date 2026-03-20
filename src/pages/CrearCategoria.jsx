import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productosAPI } from '../services/api';
import '../styles/CrearProducto.css';

function CrearCategoria() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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
      await productosAPI.crearCategoria({
        nombre: formData.nombre,
        tipo: formData.tipo,
      });

      alert('Categoría creada');
      navigate('/categorias');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al crear categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-producto-container">
      <div className="crear-producto-card">
        <div className="producto-header">
          <button onClick={() => navigate('/categorias')} className="back-button">
            ← Volver
          </button>
          <h2>📁 Crear Categoría</h2>
          <p className="subtitle">Añade una nueva categoría al sistema</p>
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
              {loading ? 'Guardando...' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearCategoria;
