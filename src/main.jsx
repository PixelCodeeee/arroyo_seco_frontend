import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register'
import { startAutoSync } from './utils/offlineQueue';

import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

import { toast } from 'sonner';

const updateSW = registerSW({
  onNeedRefresh() {
    toast('¡Nueva versión disponible!', {
      description: 'Haz clic para actualizar a la última versión.',
      action: {
        label: 'Actualizar',
        onClick: () => updateSW(true)
      },
      duration: Number.POSITIVE_INFINITY
    });
  },
  onOfflineReady() {
    console.log(' App lista para usar offline')
  }
})

// Sincronizar formularios pendientes cuando regrese la conexión
startAutoSync(import.meta.env.VITE_API_URL, ({ synced, failed }) => {
  if (synced > 0) {
    toast.success(`¡Sincronización completada! ${synced} acción(es) enviada(s) al servidor.`);
  }
  if (failed > 0) {
    toast.error(`Atención: ${failed} acción(es) no pudieron ser sincronizadas.`);
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)