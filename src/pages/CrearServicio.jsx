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
    estatus: true,
    imagenes: [] // array de strings (URLs)
  });
  const [oferentes, setOferentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOferentes();
  }, []);

  const fetchOferentes = async () => {
    try {
      const res = await oferentesAPI.getAll({ tipo: 'restaurante' });
      setOferentes(res.oferentes || res); // depende de cómo devuelvas
    } catch (err) {
      setError('No se pudieron cargar los restaurantes');
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
const dataToSend = {
  id_oferente: parseInt(formData.id_oferente),
  nombre: formData.nombre.trim(),
  descripcion: formData.descripcion.trim() || null,
  rango_precio: formData.rango_precio.trim() || null,
  capacidad: formData.capacidad ? parseInt(formData.capacidad) : null,
  estatus: formData.estatus ? 1 : 0,
  imagenes: formData.imagenes.length > 0 ? formData.imagenes : null  // ← null en vez de []
};

      await serviciosAPI.create(dataToSend);
      alert('Servicio creado exitosamente');
      navigate('/servicios');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Error desconocido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Crear Servicio de Restaurante</h2>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label>Restaurante *</label>
            <select name="id_oferente" value={formData.id_oferente} onChange={handleChange} required>
              <option value="">Seleccionar restaurante</option>
              {oferentes.map(o => (
                <option key={o.id_oferente} value={o.id_oferente}>
                  {o.nombre_negocio}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Nombre del Servicio *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Buffet Libre"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Rango de Precio</label>
            <input
              type="text"
              name="rango_precio"
              value={formData.rango_precio}
              onChange={handleChange}
              placeholder="Ej: $300 - $800"
            />
          </div>

          <div className="form-group">
            <label>Capacidad (personas)</label>
            <input
              type="number"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              min="1"
              placeholder="50"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="estatus"
                checked={formData.estatus}
                onChange={handleChange}
              /> Servicio disponible
            </label>
          </div>

          {/* Imágenes (URLs) */}
          <div className="form-group">
            <label>Imágenes (URLs separadas por coma)</label>
            <textarea
              placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg"
              onChange={(e) => {
                const urls = e.target.value.split(',').map(u => u.trim()).filter(Boolean);
                setFormData(prev => ({ ...prev, imagenes: urls }));
              }}
              rows="2"
            />
            {formData.imagenes.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {formData.imagenes.map((url, i) => (
                  <img key={i} src={url} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/servicios')} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creando...' : 'Crear Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearServicio;