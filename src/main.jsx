import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register'
import { startSyncEngine } from './services/syncEngine';

import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

import { toast } from 'sonner';
import { Download } from 'lucide-react';

const updateSW = registerSW({
  onNeedRefresh() {
    toast('¡Nueva versión disponible!', {
      icon: <Download size={18} />,
      description: 'Haz clic para actualizar a la última versión.',
      action: {
        label: 'Actualizar',
        onClick: () => updateSW(true)
      },
      duration: Number.POSITIVE_INFINITY
    });
  },
  onOfflineReady() {
    console.log('App lista para usar offline')
  }
})

// Initialize background sync engine
startSyncEngine();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)