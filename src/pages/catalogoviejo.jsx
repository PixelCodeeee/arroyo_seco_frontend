// pages/Catalogo.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/viejo.css';

const CatalogoViejo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detectar tipo según la ruta actual
  const getTipoFromPath = () => {
    if (location.pathname === '/gastronomia') return 'gastronomica';
    if (location.pathname === '/artesanias') return 'artesanal';
    return 'todos';
  };

  const [productos, setProductos] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState(getTipoFromPath());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slideActual, setSlideActual] = useState(0);

  // Actualizar filtro cuando cambie la ruta
  useEffect(() => {
    setFiltroActivo(getTipoFromPath());
  }, [location.pathname]);

  useEffect(() => {
    cargarProductos();
    cargarNegocios();
  }, [filtroActivo]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const url = `http://localhost:5000/api/productos/${filtroActivo}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProductos(data.data);
      } else {
        setError('Error al cargar productos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarNegocios = async () => {
    try {
      const tipo = filtroActivo === 'todos' ? '' : `?tipo=${filtroActivo}`;
      const url = `http://localhost:5000/api/negocios${tipo}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setNegocios(data.data);
      }
    } catch (err) {
      console.error('Error al cargar negocios:', err);
    }
  };

  const cambiarFiltro = (nuevoFiltro) => {
    // Navegar a la ruta correspondiente
    if (nuevoFiltro === 'gastronomica') {
      navigate('/gastronomia');
    } else if (nuevoFiltro === 'artesanal') {
      navigate('/artesanias');
    } else {
      setFiltroActivo('todos');
    }
  };

  const siguienteSlide = () => {
    setSlideActual((prev) => (prev + 1) % negocios.length);
  };

  const anteriorSlide = () => {
    setSlideActual((prev) => (prev - 1 + negocios.length) % negocios.length);
  };

  const agregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(sessionStorage.getItem('cartItems') || '[]');
    
    const productoExistente = carritoActual.find(p => p.id_producto === producto.id_producto);
    
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carritoActual.push({
        ...producto,
        cantidad: 1
      });
    }
    
    sessionStorage.setItem('cartItems', JSON.stringify(carritoActual));
    alert(`${producto.nombre} agregado al carrito`);
    
    // Disparar evento para actualizar el contador del navbar
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const obtenerPrimeraImagen = (imagenes) => {
    if (!imagenes || imagenes.length === 0) {
      return '/images/placeholder.jpg';
    }
    return imagenes[0];
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Cargando catálogo...</div>
      </>
    );
  }

  const negocioActual = negocios[slideActual];
  const mostrarCarousel = filtroActivo !== 'todos' && negocios.length > 0;

  return (
    <>
      <Navbar />
      <div className="catalog-page">
        {/* Carousel de negocios destacados */}
        {mostrarCarousel && negocioActual && (
          <div className="featured-carousel">
            <div className="carousel-content">
              <div className="carousel-text">
                <h2 className="carousel-title">
                  {filtroActivo === 'artesanal' ? 'Artesanía' : 'Restaurantes'}
                </h2>
                <p className="carousel-description">
                  {negocioActual.descripcion || 
                    'Descubre los mejores productos y experiencias que Querétaro tiene para ofrecer. Tradición, calidad y autenticidad en cada detalle.'}
                </p>
                <div className="carousel-buttons">
                  <button className="btn-white">
                    Ubicación
                  </button>
                  <button className="btn-primary">
                    Más detalles
                  </button>
                </div>
              </div>

              <div className="carousel-image-container">
                {negocios.length > 1 && (
                  <button 
                    className="carousel-nav carousel-nav-left"
                    onClick={anteriorSlide}
                    aria-label="Anterior"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                
                <div className="carousel-image">
                  <img 
                    src={obtenerPrimeraImagen(negocioActual.imagenes)} 
                    alt={negocioActual.nombre}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>

                {negocios.length > 1 && (
                  <button 
                    className="carousel-nav carousel-nav-right"
                    onClick={siguienteSlide}
                    aria-label="Siguiente"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {negocios.length > 1 && (
              <div className="carousel-dots">
                {negocios.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === slideActual ? 'active' : ''}`}
                    onClick={() => setSlideActual(index)}
                    aria-label={`Ir a slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Header con filtros */}
        <div className="catalog-header">
          <h1>
            {filtroActivo === 'gastronomica' && 'Gastronomía'}
            {filtroActivo === 'artesanal' && 'Artesanías'}
            {filtroActivo === 'todos' && 'Catálogo'}
          </h1>
          
          <div className="filter-buttons">
            <button 
              className={filtroActivo === 'todos' ? 'btn-primary' : 'btn-outline'}
              onClick={() => cambiarFiltro('todos')}
            >
              Todos
            </button>
            <button 
              className={filtroActivo === 'gastronomica' ? 'btn-primary' : 'btn-outline'}
              onClick={() => cambiarFiltro('gastronomica')}
            >
              Gastronomía
            </button>
            <button 
              className={filtroActivo === 'artesanal' ? 'btn-primary' : 'btn-outline'}
              onClick={() => cambiarFiltro('artesanal')}
            >
              Artesanías
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Grid de productos */}
        <div className="catalog-grid">
          {productos.length === 0 ? (
            <p className="no-products">
              No hay productos disponibles en esta categoría
            </p>
          ) : (
            productos.map((producto) => (
              <div key={producto.id_producto} className="product-card">
                <div className="product-image">
                  <img 
                    src={obtenerPrimeraImagen(producto.imagenes)} 
                    alt={producto.nombre}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                  {producto.inventario <= 5 && producto.inventario > 0 && (
                    <span className="stock-badge">¡Últimas unidades!</span>
                  )}
                  {producto.inventario === 0 && (
                    <span className="stock-badge sold-out">Agotado</span>
                  )}
                </div>
                
                <div className="product-info">
                  <h3>{producto.nombre}</h3>
                  <p className="product-business">{producto.nombre_negocio}</p>
                  <p className="product-description">{producto.descripcion}</p>
                  
                  {producto.categoria_nombre && (
                    <span className="category-badge">{producto.categoria_nombre}</span>
                  )}
                  
                  <div className="product-footer">
                    <p className="product-price">${parseFloat(producto.precio).toFixed(2)}</p>
                    
                    <button 
                      className="btn-primary"
                      onClick={() => agregarAlCarrito(producto)}
                      disabled={producto.inventario === 0}
                    >
                      {producto.inventario === 0 ? 'Agotado' : 'Añadir'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CatalogoViejo;