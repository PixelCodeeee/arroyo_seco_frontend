// src/components/EditarCategoria.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriasAPI } from '../services/api';
import '../styles/Categorias.css';

function EditarCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [categoriaInfo, setCategoriaInfo] = useState(null);

  useEffect(() => {
    fetchCategoria();
  }, [id]);

  const fetchCategoria = async () => {
    try {
      setFetching(true);
      const categoria = await categoriasAPI.getById(id);
      
      setFormData({
        nombre: categoria.nombre || '',
        tipo: categoria.tipo || ''
      });
      
      setCategoriaInfo(categoria);
    } catch (err) {
      console.error('Error fetching categoría:', err);
      setError('Error al cargar la categoría');
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
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre de la categoría es requerido';
    } else if (formData.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.tipo) {
      errors.tipo = 'Debes seleccionar un tipo de categoría';
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
      await categoriasAPI.update(id, formData);
      alert('✅ Categoría actualizada exitosamente');
      navigate('/productos');
    } catch (err) {
      setError(err.message || 'Error al actualizar categoría. Por favor intenta nuevamente.');
      console.error('Error updating categoría:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="categoria-form-container">
        <div className="categoria-form-card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando información de la categoría...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categoria-form-container">
      <div className="categoria-form-card">
        <div className="form-header">
          <button 
            onClick={() => navigate('/productos')} 
            className="back-button"
            aria-label="Volver"
          >
            ← Volver
          </button>
          <h2>✏️ Editar Categoría</h2>
          <p className="subtitle">Actualiza la información de la categoría</p>
        </div>

        {categoriaInfo && categoriaInfo.total_productos > 0 && (
          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <span>Esta categoría tiene {categoriaInfo.total_productos} productos asociados</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="categoria-form">
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre de la Categoría <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Panadería, Cerámica, etc."
              className={fieldErrors.nombre ? 'error' : ''}
              required
            />
            {fieldErrors.nombre && (
              <span className="field-error">{fieldErrors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tipo">
              Tipo de Categoría <span className="required">*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={fieldErrors.tipo ? 'error' : ''}
              required
            >
              <option value="">Selecciona un tipo</option>
              <option value="gastronomica">🍽️ Gastronómica</option>
              <option value="artesanal">🎨 Artesanal</option>
            </select>
            {fieldErrors.tipo && (
              <span className="field-error">{fieldErrors.tipo}</span>
            )}
          </div>

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

export default EditarCategoria;