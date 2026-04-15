import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCcw, AlertTriangle, Info, Store } from 'lucide-react';
import { serviciosAPI, oferentesAPI } from '../services/api';

import { toast } from 'sonner';
import '../styles/auth.css';

function CrearServicio() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const isOferente = currentUser?.rol === 'oferente';
  const isAdmin = currentUser?.rol === 'admin';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for oferente-specific checks
  const [hasOferenteProfile, setHasOferenteProfile] = useState(null); // null = loading, true/false
  const [oferenteTipo, setOferenteTipo] = useState(null); // 'restaurante' | 'artesanal' | null

  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      if (isOferente) {
        // Fetch only own oferente profile
        try {
          const miOferente = await oferentesAPI.getByUserId(currentUser.id_usuario);
          if (miOferente && miOferente.id_oferente) {
            setHasOferenteProfile(true);
            setOferenteTipo(miOferente.tipo);
            setOferentes([miOferente]);
            setFormData(prev => ({ ...prev, id_oferente: miOferente.id_oferente }));
          } else {
            setHasOferenteProfile(false);
          }
        } catch {
          setHasOferenteProfile(false);
        }
      } else if (isAdmin) {
        // Admin can see all restaurant oferentes
        const res = await oferentesAPI.getAll({ tipo: 'restaurante' });
        setOferentes(res.oferentes || res);
      } else {
        navigate('/');
        return;
      }
    } catch {
      setError('Error al cargar información');
    } finally {
      setLoading(false);
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
        estatus: formData.estatus,
        imagenes: formData.imagenes.length > 0 ? formData.imagenes : null  // ← null en vez de []
      };

      const res = await serviciosAPI.create(dataToSend);
      if (res && res._offlineQueued) {
        toast.info(res.message || "Sin conexión — operación guardada para sincronizar", { icon: <RefreshCcw size={18} /> });
      } else {
        toast.success("Servicio creado exitosamente");
      }
      navigate('/servicios');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Error desconocido';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  // ── Oferente: no profile yet ──
  if (isOferente && hasOferenteProfile === false) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2><Store size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />Crear Servicio</h2>
          </div>
          <div className="error-banner" style={{ background: 'var(--info-bg, #e0f2fe)', color: 'var(--info-color, #0369a1)', border: '1px solid var(--info-border, #7dd3fc)' }}>
            <Info size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            <strong>Necesitas crear tu perfil de oferente primero.</strong>
            <p style={{ marginTop: 8 }}>
              Antes de crear servicios, debes registrar tu negocio como oferente.
            </p>
            <Link to="/oferentes/crear" className="btn-primary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
              Crear Mi Perfil de Oferente
            </Link>
          </div>
          <div className="form-actions" style={{ marginTop: 16 }}>
            <button type="button" onClick={() => navigate('/servicios')} className="btn-secondary">
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Oferente: wrong tipo (artesanía, not restaurante) ──
  if (isOferente && oferenteTipo && oferenteTipo !== 'restaurante') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2><Store size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />Servicios de Restaurante</h2>
          </div>
          <div className="error-banner" style={{ background: 'var(--warning-bg, #fefce8)', color: 'var(--warning-color, #854d0e)', border: '1px solid var(--warning-border, #fde047)' }}>
            <AlertTriangle size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            <strong>Esta sección es exclusiva para restaurantes.</strong>
            <p style={{ marginTop: 8 }}>
              Los servicios están diseñados para oferentes tipo restaurante que desean ofrecer experiencias culinarias, 
              servicios de buffet, eventos gastronómicos y similares.
            </p>
            <p style={{ marginTop: 4, fontSize: '0.9em', opacity: 0.8 }}>
              Tu perfil es de tipo <strong>{oferenteTipo}</strong>. Puedes gestionar tus productos desde la sección de Productos.
            </p>
          </div>
          <div className="form-actions" style={{ marginTop: 16 }}>
            <button type="button" onClick={() => navigate('/productos')} className="btn-primary">
              Ir a Productos
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal form ──
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
            <select
              name="id_oferente"
              value={formData.id_oferente}
              onChange={handleChange}
              required
              disabled={isOferente}
            >
              <option value="">Seleccionar restaurante</option>
              {oferentes.map(o => (
                <option key={o.id_oferente} value={o.id_oferente}>
                  {o.nombre_negocio}
                </option>
              ))}
            </select>
            {isOferente && (
              <small style={{ color: 'var(--text-muted, #6b7280)', fontSize: '0.85em' }}>
                Tu restaurante se selecciona automáticamente.
              </small>
            )}
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