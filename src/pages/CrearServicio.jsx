import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviciosAPI, oferentesAPI } from '../services/api';
import '../styles/auth.css';

function CrearServicio() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_oferente: '',
    nombre: '',
    descripcion: '',
    rango_precio: '',
    capacidad: '',
    esta_disponible: true
  });
  const [oferentes, setOferentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOferentes();
  }, []);

  const fetchOferentes = async () => {
    try {
      const response = await oferentesAPI.getAll();
      // Filter only oferentes tipo 'restaurante'
      const restaurantes = response.oferentes.filter(o => o.tipo === 'restaurante');
      setOferentes(restaurantes);
    } catch (err) {
      console.error('Error fetching oferentes:', err);
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
      // 
      const dataToSend = {
        ...formData,
        capacidad: formData.capacidad ? parseInt(formData.capacidad) : null,
        rango_precio: formData.rango_precio || null,
        descripcion: formData.descripcion || null
      };

      await serviciosAPI.create(dataToSend);
      alert('Servicio creado exitosamente');
      navigate('/servicios');
    } catch (err) {
      setError(err.message || 'Error al crear servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Crear Servicio</h2>
          <p>Registra un nuevo servicio de restaurante</p>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="id_oferente">Restaurante *</label>
            <select
              id="id_oferente"
              name="id_oferente"
              value={formData.id_oferente}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un restaurante</option>
              {oferentes.map(oferente => (
                <option key={oferente.id_oferente} value={oferente.id_oferente}>
                  {oferente.nombre_negocio}
                </option>
              ))}
            </select>
          </div>

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
              {loading ? 'Creando...' : 'Crear Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearServicio;