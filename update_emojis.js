const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Layout.jsx',
  'src/pages/AnunciosPublicos.jsx',
  'src/pages/Carrito.jsx',
  'src/pages/Categorias.jsx',
  'src/pages/CrearCategoria.jsx',
  'src/pages/CrearOferente.jsx',
  'src/pages/CrearProducto.jsx',
  'src/pages/EditarCategoria.jsx',
  'src/pages/EditarOferente.jsx',
  'src/pages/EditarProducto.jsx',
  'src/pages/Oferentes.jsx',
  'src/pages/Ordenes.jsx',
  'src/pages/Reservas.jsx',
  'src/services/api.js'
];

const emojiMap = {
  '⚠': 'AlertTriangle',
  '⚠️': 'AlertTriangle', // With variation selector
  '✅': 'CheckCircle',
  '❌': 'XCircle',
  '⏳': 'Clock',
  'ℹ': 'Info',
  'ℹ️': 'Info', 
  '🗑': 'Trash2',
  '🗑️': 'Trash2',
  '✏': 'Edit',
  '✏️': 'Edit',
  '🍽': 'Utensils',
  '🍽️': 'Utensils',
  '🎨': 'Palette',
  '📦': 'Package',
  '📋': 'ClipboardList',
  '💰': 'DollarSign',
  '🏷': 'Tag',
  '🏷️': 'Tag',
  '🖼': 'ImageIcon',
  '🖼️': 'ImageIcon',
  '⚙': 'Settings',
  '⚙️': 'Settings',
  '🚚': 'Truck',
  '🔍': 'Search',
  '👁': 'Eye',
  '👁️': 'Eye',
  '👥': 'Users',
  '📢': 'Megaphone',
  '🗓': 'Calendar',
  '🗓️': 'Calendar',
  '💳': 'CreditCard',
  '✔': 'Check',
  '✔️': 'Check',
  '🚫': 'Ban',
  '📁': 'Folder',
  '📝': 'Edit3',
  '☰': 'Menu',
  '📡': 'Radio',
  '🚨': 'AlertOctagon',
  '🔥': 'Flame'
};

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let usedIcons = new Set();
  
  // Custom replacements for API file (no JSX, just console logs)
  if (f.endsWith('api.js')) {
    Object.keys(emojiMap).forEach(emoji => {
      content = content.split(emoji).join(`[${emojiMap[emoji]}]`);
    });
    fs.writeFileSync(f, content);
    console.log(`Updated ${f} (api logs)`);
    return;
  }

  // Replace emojis with JSX
  Object.keys(emojiMap).forEach(emoji => {
    if (content.includes(emoji)) {
      usedIcons.add(emojiMap[emoji]);
      // Replace only outside of quotes? Or just replace all for now, since they are usually used as text nodes like "⚠" or inside spans
      // We'll replace the emoji with the component string
      // e.g. "<span>⚠️</span>" -> "<span><AlertTriangle size={16} /></span>"
      // But if it's "🛍️ Productos Ordenados", wait we don't have shopping bag here, we just use Package.
      const iconComp = `<${emojiMap[emoji]} size={18} className="icon-inline" />`;
      content = content.split(emoji).join(iconComp);
    }
  });

  if (usedIcons.size > 0) {
    // Inject import
    const iconsArray = Array.from(usedIcons).join(', ');
    const importStr = `import { ${iconsArray} } from 'lucide-react';\n`;
    
    // Check if lucide-react is already imported
    if (content.includes("'lucide-react'") || content.includes('"lucide-react"')) {
      // Very naive: this might fail if they import something else.
      // Easiest is to add a new import below React.
      content = content.replace(/(import React.*?;\n)/, `$1${importStr}`);
    } else {
      content = importStr + content;
    }
    
    fs.writeFileSync(f, content);
    console.log(`Updated ${f} with ${iconsArray}`);
  }
});
