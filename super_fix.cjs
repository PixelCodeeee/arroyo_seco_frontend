const fs = require('fs');
const files = [
  'src/components/Layout.jsx',
  'src/pages/AnunciosPublicos.jsx',
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
  'src/pages/Carrito.jsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');

  // Fix: '{cat.tipo === 'gastronomica' ? '<Utensils /> Gastronómica' : '<Palette /> Artesanal'}'
  // We match a starting quote (', " or `), then the tag, then ANY text until a matching quote, 
  // BUT because the tag itself contains single quotes (`verticalAlign: 'middle'`), the end quote is tricky.
  // Actually, we can match: 
  // `['"]?(<[A-Za-z]+ size=\{18\} style=\{\{ verticalAlign: 'middle', marginRight: '4px' \}\} \/>(?:️?))(.*?)(['"]?)`
  // Wait, no, we just replace `"<Icon /> text"` with `<><Icon /> text</>` manually or securely.
  
  // Let's just fix the exact pattern that broke:
  // any quote, then `<X ... />`, then optional text, then quote.
  const regex = /['"`](<[A-Za-z]+ size=\{18\} style=\{\{ verticalAlign: 'middle', marginRight: '4px' \}\} \/>️?)(.*?)['"`]/g;
  
  content = content.replace(regex, (match, tag, text, offset, string) => {
     // If the match ends with ', but the tag had ', the regex might stop early.
     // But .*? is lazy. The next text could be " Gastronómica'"
     // The best way is to not use single/double quotes around JSX in our source.
     return `<>${tag}${text.replace(/['"`]$/, '')}</>`;
  });
  
  // Actually, just to be sure we also fix remaining ones:
  // Because the single quote inside `verticalAlign: 'middle'` causes the regex /['"`](<...)/ to match the FIRST single quote (the one before <Utensils).
  // Then (.*?) matches until the NEXT quote. But the next quote is inside `verticalAlign: 'middle'`!
  // So it would match ` '<Utensils size={18} style={{ verticalAlign: ' ` (and stop!).
  // To avoid this, let's explicitly match the whole tag text first!
  const exactTagRegex = /(["'`])(<[A-Za-z]+ size=\{18\} style=\{\{ verticalAlign: 'middle', marginRight: '4px' \}\} \/>️?)(.*?)\1/g;
  // still fails because \1 matches the first quote and it encounters the same quote inside the tag.
  
  // Instead: find exactly `<[A-Za-z]+ size=\{18\} style={{ verticalAlign: 'middle', marginRight: '4px' }} \/>`
  // and manually see if there's a surrounding quote.
  // Or even simpler: just replace ALL instances of `style={{ verticalAlign: 'middle', marginRight: '4px' }}` 
  // with `style={{ verticalAlign: "middle", marginRight: "4px" }}` (using double quotes).
  // Let's do that first to normalize quotes!
  content = content.replace(/style=\{\{ verticalAlign: 'middle', marginRight: '4px' \}\}/g, 'style={{ verticalAlign: "middle", marginRight: "4px" }}');

  // NOW we can safely match single quotes around the tag!
  content = content.replace(/'(<[A-Za-z]+ size=\{18\} style=\{\{ verticalAlign: "middle", marginRight: "4px" \}\} \/>️?)(.*?)'/g, '<>$1$2</>');
  
  // And for double quotes around the tag: (Wait, if double quotes are around it, the tag's double quotes would break!)
  // So let's fix double quotes:
  content = content.replace(/"(<[A-Za-z]+ size=\{18\} style=\{\{ verticalAlign: \\"middle\\", marginRight: \\"4px\\" \}\} \/>️?)(.*?)"/g, '<>$1$2</>');
  // Actually if it was double quotes, the tag's inner quotes were single, which we just replaced!
  
  // Let's just do a manual replace of known broken strings:
  content = content.replace(/"<Clock size=\{18\} style=\{\{ verticalAlign: "middle", marginRight: "4px" \}\} \/> Pendiente"/g, "<><Clock size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Pendiente</>");
  content = content.replace(/"<CheckCircle size=\{18\} style=\{\{ verticalAlign: "middle", marginRight: "4px" \}\} \/> Pagado"/g, "<><CheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Pagado</>");
  content = content.replace(/"<Truck size=\{18\} style=\{\{ verticalAlign: "middle", marginRight: "4px" \}\} \/> Enviado"/g, "<><Truck size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Enviado</>");

  // Categorias.jsx
  content = content.replace(/'<Utensils size=\{18\} style=\{\{ verticalAlign: "middle", marginRight: "4px" \}\} \/>️ Gastronómica'/g, "<><Utensils size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Gastronómica</>");
  content = content.replace(/'<Palette size=\{18\} style=\{\{ verticalAlign: "middle", marginRight: "4px" \}\} \/> Artesanal'/g, "<><Palette size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Artesanal</>");

  fs.writeFileSync(f, content);
});
