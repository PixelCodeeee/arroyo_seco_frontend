import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCart, 
  updateItemQuantity, 
  removeFromCart, 
  clearCart,
  getCartTotal,
  getCartItemsCount 
} from '../utils/cartUtils';
import Navbar from '../components/Navbar';
import PayPalCheckout from '../components/PayPalCheckout';
import '../styles/carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    cargarCarrito();
    
    const handleCartUpdate = () => {
      cargarCarrito();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const cargarCarrito = () => {
    const carritoData = getCart();
    setCart(carritoData);
    setLoading(false);
  };

  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    if (updateItemQuantity(id_producto, nuevaCantidad)) {
      cargarCarrito();
    }
  };

  const eliminarItem = (id_producto) => {
    if (window.confirm('¿Eliminar este producto del carrito?')) {
      if (removeFromCart(id_producto)) {
        cargarCarrito();
      }
    }
  };

  const vaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      clearCart();
      cargarCarrito();
      setShowPayPal(false);
    }
  };

  const iniciarPago = () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para realizar el pago');
      navigate('/login');
      return;
    }

    if (!cart || cart.items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    setPaymentError('');
    setShowPayPal(true);
  };

  const handlePaymentSuccess = (response) => {
    console.log('Payment successful:', response);
    setPaymentSuccess(true);
    setShowPayPal(false);
    
    // Show success message
    alert(`¡Pago exitoso! ID de transacción: ${response.transaction.id}`);
    
    // Redirect to orders page after 2 seconds
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setPaymentError(error.message || 'Error al procesar el pago');
    setShowPayPal(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Cargando carrito...</div>
      </>
    );
  }

  const items = cart?.items || [];
  const totalItems = getCartItemsCount();
  const totalPrice = getCartTotal();

  if (paymentSuccess) {
    return (
      <>
        <Navbar />
        <div className="carrito-page">
          <div className="carrito-container">
            <div className="payment-success">
              <div className="success-icon">✓</div>
              <h2>¡Pago Exitoso!</h2>
              <p>Tu pedido ha sido procesado correctamente.</p>
              <p>Redirigiendo a inicio...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="carrito-page">
        <div className="carrito-container">
          <h1 className="carrito-title">Tu carrito</h1>

          {/* Oferente info */}
          {cart && cart.nombre_negocio && (
            <div className="oferente-info-banner">
              <span className="oferente-label">Comprando de:</span>
              <span className="oferente-name">{cart.nombre_negocio}</span>
            </div>
          )}

          {/* Payment Error */}
          {paymentError && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              <span>⚠️</span>
              <span>{paymentError}</span>
            </div>
          )}

          {/* Sección de productos en carrito */}
          <div className="carrito-section">
            <div className="section-header">
              <span className="section-text">
                Productos en carrito: {totalItems}
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
                {items.length === 0 ? (
                  <p className="carrito-vacio">Tu carrito está vacío</p>
                ) : (
                  items.map((item) => {
                    const primeraImagen = Array.isArray(item.imagenes) && item.imagenes.length > 0
                      ? item.imagenes[0]
                      : '/images/placeholder.png';

                    return (
                      <div key={item.id_producto} className="producto-carrito-item">
                        <div className="producto-info-carrito">
                          <img 
                            src={primeraImagen}
                            alt={item.nombre}
                            className="producto-imagen-mini"
                            onError={(e) => {
                              e.target.src = '/images/placeholder.png';
                            }}
                          />
                          <div>
                            <h4>{item.nombre}</h4>
                            {item.descripcion && (
                              <p className="producto-descripcion-mini">{item.descripcion}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="producto-controles">
                          <div className="cantidad-control">
                            <button 
                              onClick={() => actualizarCantidad(item.id_producto, item.cantidad - 1)}
                              className="cantidad-btn"
                              disabled={showPayPal}
                            >
                              -
                            </button>
                            <span className="cantidad-texto">{item.cantidad}</span>
                            <button 
                              onClick={() => actualizarCantidad(item.id_producto, item.cantidad + 1)}
                              className="cantidad-btn"
                              disabled={showPayPal}
                            >
                              +
                            </button>
                          </div>
                          
                          <p className="producto-precio-carrito">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </p>
                          
                          <button 
                            onClick={() => eliminarItem(item.id_producto)}
                            className="eliminar-btn"
                            aria-label="Eliminar producto"
                            disabled={showPayPal}
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
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Resumen de compra */}
          <div className="carrito-section resumen-section">
            <div className="resumen-header">
              <h3>Resumen de compra</h3>
            </div>
            
            <div className="resumen-items">
              {items.map((item) => (
                <div key={item.id_producto} className="resumen-item">
                  <div className="resumen-producto">
                    <span className="resumen-nombre">{item.nombre}</span>
                    <span className="resumen-cantidad">Cantidad: {item.cantidad}</span>
                  </div>
                  <span className="resumen-precio">
                    $ {(item.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="resumen-divider"></div>
              
              <div className="resumen-total">
                <span className="total-label">Total</span>
                <span className="total-precio">$ {totalPrice.toFixed(2)} MXN</span>
              </div>
            </div>
          </div>

          {/* PayPal Payment Section */}
          {showPayPal && (
            <div className="carrito-section">
              <div className="section-header">
                <span className="section-text">Método de pago</span>
              </div>
              <div className="paypal-section">
                <PayPalCheckout
                  amount={totalPrice.toFixed(2)}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="carrito-acciones">
            {!showPayPal ? (
              <>
                <button 
                  className="pagar-btn"
                  onClick={iniciarPago}
                  disabled={!cart || items.length === 0}
                >
                  Proceder al Pago
                </button>

                {cart && items.length > 0 && (
                  <button 
                    className="vaciar-carrito-btn"
                    onClick={vaciarCarrito}
                  >
                    Vaciar carrito
                  </button>
                )}
              </>
            ) : (
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPayPal(false)}
              >
                Cancelar pago
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carrito;