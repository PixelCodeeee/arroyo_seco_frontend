import React, { useState } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { paypalAPI } from '../services/api';
import { getCart, clearCart } from '../utils/cartUtils';
import '../styles/PayPalCheckout.css';

function PayPalCheckout({ amount, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createOrder = async (data, actions) => {
    try {
      setLoading(true);
      setError('');
      
      const cart = getCart();
      
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // Validar que el usuario esté autenticado
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!currentUser) {
        throw new Error('Debes iniciar sesión para realizar la compra');
      }

      const orderData = {
        items: cart.items,
        total: amount
      };

      console.log('📦 Creating PayPal order:', orderData);

      const response = await paypalAPI.createOrder(orderData);
      
      console.log('✅ Order created:', response.orderID);

      return response.orderID;

    } catch (error) {
      console.error('❌ Error creating order:', error);
      setError(error.message || 'Error al crear la orden');
      setLoading(false);
      onError?.(error);
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      setLoading(true);
      setError('');
      
      const cart = getCart();
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      console.log('💳 Capturing payment for order:', data.orderID);

      const captureData = {
        orderID: data.orderID,
        cartData: cart,
        id_usuario: currentUser.id_usuario
      };

      const response = await paypalAPI.captureOrder(captureData);

      console.log('✅ Payment captured:', response);

      if (response.success) {
        // Limpiar carrito solo si el pago fue exitoso Y se guardó el pedido
        clearCart();
        
        // Llamar callback de éxito con toda la info
        onSuccess?.({
          ...response,
          pedido: response.pedido,
          paypalOrder: response.order
        });

        return response;
      } else {
        throw new Error(response.error || 'Error al procesar el pago');
      }

    } catch (error) {
      console.error('❌ Error capturing payment:', error);
      setError(error.message || 'Error al procesar el pago');
      setLoading(false);
      onError?.(error);
      throw error;
    }
  };

  const onCancel = (data) => {
    console.log('🚫 Payment cancelled by user', data);
    setLoading(false);
    setError('Pago cancelado');
    onError?.(new Error('Pago cancelado por el usuario'));
  };

  const onErrorHandler = (err) => {
    console.error('🔥 PayPal error:', err);
    setError('Error en el proceso de pago');
    setLoading(false);
    onError?.(err);
  };

  return (
    <div className="paypal-checkout-container">
      
      {error && (
        <div className="paypal-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="paypal-loading">
          <div className="spinner"></div>
          <p>Procesando pago...</p>
          <small>Por favor no cierres esta ventana</small>
        </div>
      )}
      
      <PayPalButtons
        style={{ 
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
          height: 45
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onErrorHandler}
        disabled={loading}
        forceReRender={[amount]}
      />

      <div className="paypal-info">
        <p>
          <strong>💳 Pago seguro con PayPal</strong>
        </p>
        <small>Tu pedido se guardará automáticamente al completar el pago</small>
      </div>
    </div>
  );
}

export default PayPalCheckout;