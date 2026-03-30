import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { announcementsAPI } from '../services/api';
import Layout from '../components/Layout';
import '../styles/auth.css';

function EditarAnuncio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    event_date: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnuncio();
  }, [id]);

  const fetchAnuncio = async () => {
    try {
      const data = await announcementsAPI.getById(id);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        image_url: data.image_url || '',
        event_date: data.event_date ? data.event_date.substring(0, 10) : '',
        is_active: data.is_active === 1 || data.is_active === true
      });
    } catch {
      setError('Error al cargar el anuncio');
    } finally {
      setLoadingData(false);
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
      await announcementsAPI.update(id, formData);
      alert('Anuncio actualizado exitosamente');
      navigate('/anuncios');
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="auth-container">
          <div className="loading">Cargando anuncio...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Editar Anuncio</h2>
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
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
}

export default EditarAnuncio;