// ============================================================
// useOfflineForm.js — Hook para formularios con soporte offline
// Uso: const { submitForm, offlineMsg } = useOfflineForm()
// ============================================================

import { useState, useEffect } from 'react';
import { saveToQueue, syncPendingRequests, startAutoSync } from '../utils/offlineQueue';

const API_URL = import.meta.env.VITE_API_URL;

export function useOfflineForm() {
  const [offlineMsg, setOfflineMsg] = useState(''); // mensaje para mostrar al usuario

  // Al montar, iniciar auto-sync y sincronizar si ya hay conexión
  useEffect(() => {
    // Sincronizar pendientes si hay red al cargar la página
    if (navigator.onLine) {
      syncPendingRequests(API_URL).then(({ synced }) => {
        if (synced > 0) {
          showMsg(`Se sincronizaron ${synced} formulario(s) pendiente(s).`, 'success');
        }
      });
    }

    // Escuchar cuando regrese la conexión
    startAutoSync(API_URL, ({ synced }) => {
      showMsg(` Conexión restaurada. Se enviaron ${synced} formulario(s) guardado(s).`, 'success');
    });
  }, []);

  function showMsg(text, type = 'info') {
    setOfflineMsg({ text, type });
    setTimeout(() => setOfflineMsg(''), 5000); // desaparece en 5s
  }

  // ---- Función principal: intenta enviar, si falla guarda offline ----
  async function submitForm({ endpoint, method = 'POST', data, onSuccess, onError }) {
    if (!navigator.onLine) {
      // Sin internet → guardar en cola
      await saveToQueue(endpoint, method, data);
      showMsg(' Sin conexión. Tu formulario se guardó y se enviará cuando haya internet.', 'offline');
      return { savedOffline: true };
    }

    // Con internet → intentar enviar normal
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}`);
      }

      if (onSuccess) onSuccess(result);
      return { savedOffline: false, result };

    } catch (err) {
      // Si falla por red (no por validación), guardar offline
      if (!navigator.onLine || err.message === 'Failed to fetch') {
        await saveToQueue(endpoint, method, data);
        showMsg(' Sin conexión. Tu formulario se guardó y se enviará cuando haya internet.', 'offline');
        return { savedOffline: true };
      }

      if (onError) onError(err);
      throw err;
    }
  }

  return { submitForm, offlineMsg };
}
