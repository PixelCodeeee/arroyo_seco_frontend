import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementsAPI } from '../services/api';
import Layout from '../components/Layout';
import '../styles/auth.css';

function CrearAnuncio() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    event_date: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await announcementsAPI.create(formData);
      alert('Anuncio creado exitosamente');
      navigate('/anuncios');
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Crear Anuncio</h2>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Feria del Mango 2026"
              />
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe el evento o festividad..."
              />
            </div>

            <div className="form-group">
              <label>URL de Imagen</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="preview"
                  style={{ marginTop: 8, width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }}
                />
              )}
            </div>

            <div className="form-group">
              <label>Fecha del Evento</label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                /> Anuncio activo
              </label>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/anuncios')} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Creando...' : 'Crear Anuncio'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
}

export default CrearAnuncio;