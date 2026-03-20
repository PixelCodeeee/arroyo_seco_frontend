import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register'
import './index.css';
import App from './App.jsx';

registerSW({
  onOfflineReady() {
    console.log(' App lista para usar offline')
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);