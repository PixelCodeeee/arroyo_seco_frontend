// src/utils/cartUtils.js

/**
 * Cart structure in localStorage:
 * {
 *   id_oferente: number,
 *   nombre_negocio: string,
 *   items: [
 *     {
 *       id_producto: number,
 *       id_oferente: number,
 *       nombre: string,
 *       descripcion: string,
 *       precio: number,
 *       imagenes: array,
 *       id_categoria: number,
 *       cantidad: number
 *     }
 *   ]
 * }
 */

const CART_KEY = 'carritoArroyo';

// Get cart from localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : null;
  } catch (error) {
    console.error('Error parsing cart:', error);
    return null;
  }
};

// Save cart to localStorage
export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Dispatch event for cart updates
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

// Clear cart
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
};

// Get total items count
export const getCartItemsCount = () => {
  const cart = getCart();
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((total, item) => total + item.cantidad, 0);
};

// Get cart total price
export const getCartTotal = () => {
  const cart = getCart();
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
};

// Add product to cart
export const addToCart = (producto, oferente) => {
  const cart = getCart();
  
  // Validate product data
  if (!producto.id_producto || !producto.precio) {
    throw new Error('Datos de producto inválidos');
  }

  // If cart is empty, create new cart with this oferente
  if (!cart) {
    const newCart = {
      id_oferente: oferente.id_oferente,
      nombre_negocio: oferente.nombre_negocio,
      items: [
        {
          id_producto: producto.id_producto,
          id_oferente: oferente.id_oferente,
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          precio: parseFloat(producto.precio),
          imagenes: producto.imagenes || [],
          id_categoria: producto.id_categoria || null,
          cantidad: 1
        }
      ]
    };
    saveCart(newCart);
    return { success: true, message: 'Producto agregado al carrito' };
  }

  // Check if trying to add from different oferente
  if (cart.id_oferente !== oferente.id_oferente) {
    return {
      success: false,
      requiresConfirmation: true,
      message: `Tu carrito tiene productos de "${cart.nombre_negocio}". ¿Deseas vaciarlo y agregar productos de "${oferente.nombre_negocio}"?`,
      currentOferente: cart.nombre_negocio,
      newOferente: oferente.nombre_negocio
    };
  }

  // Same oferente - check if product already exists
  const existingItemIndex = cart.items.findIndex(item => item.id_producto === producto.id_producto);

  if (existingItemIndex > -1) {
    // Increment quantity
    cart.items[existingItemIndex].cantidad += 1;
  } else {
    // Add new product
    cart.items.push({
      id_producto: producto.id_producto,
      id_oferente: oferente.id_oferente,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: parseFloat(producto.precio),
      imagenes: producto.imagenes || [],
      id_categoria: producto.id_categoria || null,
      cantidad: 1
    });
  }

  saveCart(cart);
  return { success: true, message: 'Producto agregado al carrito' };
};

// Replace cart with new oferente
export const replaceCartWithNewOferente = (producto, oferente) => {
  const newCart = {
    id_oferente: oferente.id_oferente,
    nombre_negocio: oferente.nombre_negocio,
    items: [
      {
        id_producto: producto.id_producto,
        id_oferente: oferente.id_oferente,
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: parseFloat(producto.precio),
        imagenes: producto.imagenes || [],
        id_categoria: producto.id_categoria || null,
        cantidad: 1
      }
    ]
  };
  saveCart(newCart);
  return { success: true, message: 'Carrito actualizado con nuevos productos' };
};

// Update item quantity
export const updateItemQuantity = (id_producto, cantidad) => {
  const cart = getCart();
  if (!cart) return false;

  const itemIndex = cart.items.findIndex(item => item.id_producto === id_producto);
  if (itemIndex === -1) return false;

  if (cantidad <= 0) {
    // Remove item
    cart.items.splice(itemIndex, 1);
    
    // If cart is empty, clear it completely
    if (cart.items.length === 0) {
      clearCart();
      return true;
    }
  } else {
    cart.items[itemIndex].cantidad = cantidad;
  }

  saveCart(cart);
  return true;
};

// Remove item from cart
export const removeFromCart = (id_producto) => {
  const cart = getCart();
  if (!cart) return false;

  cart.items = cart.items.filter(item => item.id_producto !== id_producto);

  // If cart is empty, clear it completely
  if (cart.items.length === 0) {
    clearCart();
  } else {
    saveCart(cart);
  }

  return true;
};

// Check if product is in cart
export const isProductInCart = (id_producto) => {
  const cart = getCart();
  if (!cart) return false;
  return cart.items.some(item => item.id_producto === id_producto);
};

// Get product quantity in cart
export const getProductQuantity = (id_producto) => {
  const cart = getCart();
  if (!cart) return 0;
  const item = cart.items.find(item => item.id_producto === id_producto);
  return item ? item.cantidad : 0;
};