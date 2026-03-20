import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { serviciosAPI } from '../services/api';
import '../styles/auth.css';

function EditarServicio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    rango_precio: '',
    capacidad: '',
    esta_disponible: true
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServicio();
  }, [id]);

  const fetchServicio = async () => {
    try {
      setFetching(true);
      const servicio = await serviciosAPI.getById(id);
      setFormData({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || '',
        rango_precio: servicio.rango_precio || '',
        capacidad: servicio.capacidad || '',
        esta_disponible: servicio.esta_disponible
      });
    } catch (err) {
      setError(err.message || 'Error al cargar servicio');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convert empty strings to null for optional fields
      const dataToSend = {
        ...formData,
        capacidad: formData.capacidad ? parseInt(formData.capacidad) : null,
        rango_precio: formData.rango_precio || null,
        descripcion: formData.descripcion || null
      };

      await serviciosAPI.update(id, dataToSend);
      alert('Servicio actualizado exitosamente');
      navigate('/servicios');
    } catch (err) {
      setError(err.message || 'Error al actualizar servicio');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading">Cargando datos del servicio...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Editar Servicio</h2>
          <p>Actualiza la información del servicio</p>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Servicio *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Comida Buffet, Desayuno Especial"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe el servicio que ofreces"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rango_precio">Rango de Precio</label>
            <input
              type="text"
              id="rango_precio"
              name="rango_precio"
              value={formData.rango_precio}
              onChange={handleChange}
              placeholder="Ej: $200-$500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacidad">Capacidad (personas)</label>
            <input
              type="number"
              id="capacidad"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              placeholder="Ej: 50"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="esta_disponible"
                checked={formData.esta_disponible}
                onChange={handleChange}
              />
              <span>Servicio disponible</span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/servicios')}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Actualizando...' : 'Actualizar Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarServicio;