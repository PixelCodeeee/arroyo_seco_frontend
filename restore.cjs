const fs = require('fs');

function replaceFile(path, replacements) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    for (let r of replacements) {
        content = content.replace(r[0], r[1] || '');
    }
    fs.writeFileSync(path, content);
}

replaceFile('src/pages/Carrito.jsx', [
    [/import PayPalCheckout from '\.\.\/components\/PayPalCheckout';/g, "import MercadoPagoCheckout from '../components/MercadoPagoCheckout';"],
    [/const \[showPayPal, setShowPayPal\] = useState\(false\);/g, "const [showMercadoPago, setShowMercadoPago] = useState(false);"],
    [/setShowPayPal/g, "setShowMercadoPago"],
    [/showPayPal/g, "showMercadoPago"],
    [/PayPalCheckout/g, "MercadoPagoCheckout"],
    [/\.\.\/styles\/carrito\.css/g, "../styles/carrito.css"],
    [/<span>⚠️<\/span>/g, "<span><AlertTriangle size={18} className=\"lucide-icon-inline\" style={{ verticalAlign: 'middle', marginRight: '4px' }} /></span>"],
    [/import React, \{ useState, useEffect \} from 'react';\n/g, "import React, { useState, useEffect } from 'react';\nimport { AlertTriangle } from 'lucide-react';\n"]
]);

replaceFile('src/components/Sidebar.jsx', [
    [/icon: '🏠'/g, "icon: <Home size={20} />"],
    [/icon: '🍽️'/g, "icon: <Utensils size={20} />"],
    [/icon: '📦'/g, "icon: <Package size={20} />"],
    [/icon: '🏷️'/g, "icon: <Tag size={20} />"],
    [/icon: '🎨'/g, "icon: <Palette size={20} />"],
    [/icon: '📢'/g, "icon: <Megaphone size={20} />"],
    [/icon: '🛒'/g, "icon: <ShoppingCart size={20} />"],
    [/icon: '📋'/g, "icon: <ClipboardList size={20} />"],
    [/icon: '👥'/g, "icon: <Users size={20} />"],
    [/icon: '⚙️'/g, "icon: <Settings size={20} />"],
    [/<span className="menu-icon">\{item\.icon\}<\/span>/g, "<span className=\"menu-icon\">{item.icon}</span>"],
    [/import \{ LogOut, X, Menu/g, "import { LogOut, X, Menu, Home, Utensils, Package, Tag, Palette, Megaphone, ShoppingCart, ClipboardList, Users, Settings, Store, Crown"],
    [/<span className="profile-icon">👑<\/span>/g, "<span className=\"profile-icon\"><Crown size={20} /></span>"],
    [/<span className="profile-icon">🏪<\/span>/g, "<span className=\"profile-icon\"><Store size={20} /></span>"]
]);

// modals
replaceFile('src/components/CartConfirmModal.jsx', [
    [/import \{ X \} from 'lucide-react';/g, "import { X, ShoppingCart, AlertTriangle } from 'lucide-react';"],
    [/<h2>🛒 Cambiar de Oferente<\/h2>/g, "<h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingCart size={24} /> Cambiar de Oferente</h2>"],
    [/<span>⚠️<\/span>/g, "<span><AlertTriangle size={20} /></span>"]
]);

replaceFile('src/components/OrdenDetailModal.jsx', [
    [/import \{ X \} from "lucide-react";/g, "import { X, Package, Clock, CheckCircle, Truck, User, ShoppingBag, DollarSign } from 'lucide-react';"],
    [/<h2>📦 Detalle del Pedido #\{pedido\.id_pedido\}<\/h2>/g, "<h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={24} /> Detalle del Pedido #{pedido.id_pedido}</h2>"],
    [/"⏳ Pendiente"/g, "<><Clock size={16} /> Pendiente</>"],
    [/"✅ Pagado"/g, "<><CheckCircle size={16} /> Pagado</>"],
    [/"🚚 Enviado"/g, "<><Truck size={16} /> Enviado</>"],
    [/>\s*⏳ Marcar Pendiente/g, " style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Marcar Pendiente"],
    [/>\s*✅ Marcar Pagado/g, " style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Marcar Pagado"],
    [/>\s*🚚 Marcar Enviado/g, " style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Truck size={14} /> Marcar Enviado"],
    [/<h3>👤 Información del Cliente<\/h3>/g, "<h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={20} /> Información del Cliente</h3>"],
    [/<h3>🛍️ Productos Ordenados<\/h3>/g, "<h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingBag size={20} /> Productos Ordenados</h3>"],
    [/>\s*📦\s*<\/div>/g, "><Package size={32} color=\"#999\" /></div>"],
    [/<h3>💰 Resumen del Pedido<\/h3>/g, "<h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><DollarSign size={20} /> Resumen del Pedido</h3>"]
]);

replaceFile('src/components/ReservaDetailModal.jsx', [
    [/import \{ X \} from "lucide-react";/g, "import { X, Utensils, Clock, CheckCircle, XCircle, AlertCircle, CalendarDays, User, Clipboard, Info } from 'lucide-react';"],
    [/<h2>🍽️ Detalle de Reserva #\{reserva\.id_reserva\}<\/h2>/g, "<h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Utensils size={24} /> Detalle de Reserva #{reserva.id_reserva}</h2>"],
    [/"⏳ Pendiente"/g, "<><Clock size={16} /> Pendiente</>"],
    [/"✅ Confirmada"/g, "<><CheckCircle size={16} /> Confirmada</>"],
    [/"❌ Cancelada"/g, "<><XCircle size={16} /> Cancelada</>"],
    [/<span className="tiempo-icon">⏰<\/span>/g, "<Clock size={16} className=\"tiempo-icon\" />"],
    [/>\s*⏳ Marcar Pendiente/g, " style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Marcar Pendiente"],
    [/>\s*✅ Confirmar Reserva/g, " style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Confirmar Reserva"],
    [/>\s*❌ Cancelar Reserva/g, " style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Cancelar Reserva"],
    [/>\s*❌ Cancelar mi Reserva/g, " style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Cancelar mi Reserva"],
    [/⚠️ Puedes cancelar hasta 24 horas antes de la reserva/g, "<AlertCircle size={14} /> Puedes cancelar hasta 24 horas antes de la reserva"],
    [/<h3>🍽️ Información del Servicio<\/h3>/g, "<h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Utensils size={20} /> Información del Servicio</h3>"],
    [/<h3>📅 Detalles de la Reserva<\/h3>/g, "<h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CalendarDays size={20} /> Detalles de la Reserva</h3>"],
    [/<h3>👤 Información del Cliente<\/h3>/g, "<h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={20} /> Información del Cliente</h3>"],
    [/<h3>📝 Notas Adicionales<\/h3>/g, "<h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clipboard size={20} /> Notas Adicionales</h3>"],
    [/<h3>ℹ️ Información Importante<\/h3>/g, "<h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={20} /> Información Importante</h3>"]
]);

replaceFile('src/components/ReservaModal.jsx', [
    [/import \{ X, AlertCircle, Info \} from 'lucide-react';/g, "import { X, AlertCircle, Info, Utensils, Frown, CheckCircle } from 'lucide-react';"],
    [/<h2>🍽️ Hacer Reservación<\/h2>/g, "<h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Utensils size={24} /> Hacer Reservación</h2>"],
    [/<p>😔 No hay servicios disponibles en este momento\.<\/p>/g, "<Frown size={24} style={{ display: 'block', margin: '0 auto 8px', color: '#999' }} /><p>No hay servicios disponibles en este momento.</p>"],
    [/'✓ Confirmar Reserva'/g, "<><CheckCircle size={16} /> Confirmar Reserva</>"]
]);

console.log("Restored previous correct state!");
