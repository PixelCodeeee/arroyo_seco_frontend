// pages/Carrito.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = () => {
    const carritoLocal = JSON.parse(sessionStorage.getItem('cartItems') || '[]');
    setCarrito(carritoLocal);
    setLoading(false);
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      return total + (parseFloat(item.precio) * item.cantidad);
    }, 0);
  };

  const calcularCantidadTotal = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(id_producto);
      return;
    }

    const carritoActualizado = carrito.map(item => 
      item.id_producto === id_producto 
        ? { ...item, cantidad: nuevaCantidad }
        : item
    );

    setCarrito(carritoActualizado);
    sessionStorage.setItem('cartItems', JSON.stringify(carritoActualizado));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const eliminarItem = (id_producto) => {
    const carritoActualizado = carrito.filter(item => item.id_producto !== id_producto);
    setCarrito(carritoActualizado);
    sessionStorage.setItem('cartItems', JSON.stringify(carritoActualizado));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const vaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      setCarrito([]);
      sessionStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const procesarPago = () => {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    // Aquí irá la lógica de pago
    alert('Procesando pago...');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Cargando carrito...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="carrito-page">
        <div className="carrito-container">
          <h1 className="carrito-title">Tu carrito</h1>

          {/* Sección de productos en carrito */}
          <div className="carrito-section">
            <div className="section-header">
              <span className="section-text">
                Productos en carrito: {calcularCantidadTotal()}
              </span>
              <button 
                className="ver-detalles-btn"
                onClick={() => setMostrarDetalles(!mostrarDetalles)}
              >
                {mostrarDetalles ? 'Ocultar detalles' : 'Ver detalles'}
                <svg 
                  className={`arrow-icon ${mostrarDetalles ? 'rotated' : ''}`}
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <path 
                    d="M19 9L12 16L5 9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {mostrarDetalles && (
              <div className="productos-detalle">
                {carrito.length === 0 ? (
                  <p className="carrito-vacio">Tu carrito está vacío</p>
                ) : (
                  carrito.map((item) => (
                    <div key={item.id_producto} className="producto-carrito-item">
                      <div className="producto-info-carrito">
                        <img 
                          src={item.imagenes?.[0] || '/images/placeholder.jpg'}
                          alt={item.nombre}
                          className="producto-imagen-mini"
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                        <div>
                          <h4>{item.nombre}</h4>
                          <p className="producto-negocio-mini">{item.nombre_negocio}</p>
                        </div>
                      </div>
                      
                      <div className="producto-controles">
                        <div className="cantidad-control">
                          <button 
                            onClick={() => actualizarCantidad(item.id_producto, item.cantidad - 1)}
                            className="cantidad-btn"
                          >
                            -
                          </button>
                          <span className="cantidad-texto">{item.cantidad}</span>
                          <button 
                            onClick={() => actualizarCantidad(item.id_producto, item.cantidad + 1)}
                            className="cantidad-btn"
                          >
                            +
                          </button>
                        </div>
                        
                        <p className="producto-precio-carrito">
                          ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                        </p>
                        
                        <button 
                          onClick={() => eliminarItem(item.id_producto)}
                          className="eliminar-btn"
                          aria-label="Eliminar producto"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path 
                              d="M18 6L6 18M6 6L18 18" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Método de pago */}
          <div className="carrito-section">
            <div className="section-header">
              <span className="section-text">Método de pago</span>
              <div className="payment-icons">
                <img 
                  src="/images/efectivo-icon.png" 
                  alt="Efectivo"
                  className="payment-icon"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <svg className="payment-icon paypal-icon" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="#00457C" d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L8.926 12.4h2.453c4.061 0 7.213-1.65 8.405-6.42a5.056 5.056 0 0 0 .283-1.502z"/>
                  <path fill="#0079C1" d="M7.331 0h6.227c1.245 0 2.27.058 3.048.256.661.168 1.23.417 1.736.774.652.459 1.148 1.108 1.5 1.95.492.88.556 2.015.3 3.328-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558l1.677-10.643A.97.97 0 0 1 9.878 5h3.093c1.098 0 2.003-.243 2.655-.71z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="carrito-section resumen-section">
            <div className="resumen-header">
              <h3>Resumen de compra</h3>
            </div>
            
            <div className="resumen-items">
              {carrito.map((item) => (
                <div key={item.id_producto} className="resumen-item">
                  <div className="resumen-producto">
                    <span className="resumen-nombre">{item.nombre}</span>
                    <span className="resumen-cantidad">Cantidad: {item.cantidad}</span>
                  </div>
                  <span className="resumen-precio">
                    $ {(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="resumen-divider"></div>
              
              <div className="resumen-total">
                <span className="total-label">Total</span>
                <span className="total-precio">$ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="carrito-acciones">
            <button 
              className="pagar-btn"
              onClick={procesarPago}
              disabled={carrito.length === 0}
            >
              Pagar
            </button>

            {carrito.length > 0 && (
              <button 
                className="vaciar-carrito-btn"
                onClick={vaciarCarrito}
              >
                Vaciar carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carrito;