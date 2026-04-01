import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register'
import { startAutoSync } from './utils/offlineQueue';

import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

registerSW({
  onOfflineReady() {
    console.log(' App lista para usar offline')
  }
})

// Sincronizar formularios pendientes cuando regrese la conexión
startAutoSync(import.meta.env.VITE_API_URL, ({ synced }) => {
  console.log(` Auto-sync: ${synced} formulario(s) enviado(s)`)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)