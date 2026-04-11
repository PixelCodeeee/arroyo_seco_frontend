import React, { useState, useEffect } from 'react';
import { paypalAPI } from '../services/api'; // keeping api object the same, as per previous implementation, but maybe backend is updated
import { getCart, clearCart } from '../utils/cartUtils';
import { AlertCircle, Lock, CreditCard } from 'lucide-react';
import '../styles/MercadoPagoCheckout.css';

function MercadoPagoCheckout({ amount, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // Al regresar de MercadoPago, la URL trae ?status=success&payment_id=...
  useEffect(() => {
    const params     = new URLSearchParams(window.location.search);
    const status     = params.get('status');
    const payment_id = params.get('collection_id') || params.get('payment_id');

    if (status === 'success' && payment_id) {
      handleReturnFromMP(payment_id);
    } else if (status === 'failure') {
      setError('El pago fue rechazado. Intenta de nuevo.');
      onError?.(new Error('Pago rechazado'));
    } else if (status === 'pending') {
      setError('Tu pago está pendiente de confirmación.');
    }
  }, []); 

  const handleReturnFromMP = async (payment_id) => {
    try {
      setLoading(true);
      setError('');

      const cart = getCart();
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      if (!cart || !cart.items || cart.items.length === 0) {
        // El carrito ya fue limpiado en un refresh anterior
        onSuccess?.({ transaction: { id: payment_id, status: 'approved' } });
        return;
      }

      console.log('💳 Confirmando pago MP:', payment_id);

      const captureData = {
        payment_id,
        cartData:   cart,
        id_usuario: currentUser.id_usuario
      };

      // api object uses paypalAPI for MP, keeping the existing method ref
      const response = await paypalAPI.captureOrder(captureData);

      if (response.success) {
        clearCart();

        // Llamar callback de éxito con toda la info
        onSuccess?.({
          ...response,
          pedido:      response.pedido,
          transaction: response.transaction
        });
      } else {
        throw new Error(response.error || 'Error al confirmar el pago');
      }

    } catch (err) {
      console.error('❌ Error confirmando pago:', err);
      setError(err.message || 'Error al confirmar el pago');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  // Iniciar pago — crea preferencia y redirige a MercadoPago
  const iniciarPago = async () => {
    try {
      setLoading(true);
      setError('');

      const cart        = getCart();
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error('El carrito está vacío');
      }

      if (!currentUser) {
        throw new Error('Debes iniciar sesión para realizar la compra');
      }

      const orderData = {
        items:       cart.items,
        total:       amount,
        id_oferente: cart.id_oferente || null
      };

      console.log('📦 Creando preferencia MP:', orderData);

      const response = await paypalAPI.createOrder(orderData);

      console.log('✅ Preferencia creada:', response.preference_id);

      // Redirigir a MercadoPago (sandbox en pruebas, init_point en producción)
      const url = response.sandbox_url || response.init_point;
      window.location.href = url;

    } catch (err) {
      console.error('❌ Error creando preferencia:', err);
      setError(err.message || 'Error al iniciar el pago');
      setLoading(false);
      onError?.(err);
    }
  };

  return (
    <div className="mercadopago-checkout-container">

      {error && (
        <div className="mercadopago-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="mercadopago-loading">
          <div className="spinner"></div>
          <p>Procesando pago...</p>
          <small>Por favor no cierres esta ventana</small>
        </div>
      ) : (
        <button
          className="mp-pay-btn"
          onClick={iniciarPago}
          disabled={loading}
        >
          <CreditCard size={20} /> Pagar con MercadoPago
        </button>
      )}

      <div className="mercadopago-info">
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Lock size={16} /> <strong>Pago seguro con MercadoPago</strong>
        </p>
        <small>Serás redirigido a MercadoPago para completar tu pago</small>
      </div>

    </div>
  );
}

export default MercadoPagoCheckout;
