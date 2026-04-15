import React from 'react';
import { getPendingOperations, removePendingOperation, updatePendingOperationStatus } from './localDB';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

let isSyncing = false;

export const syncPendingOperations = async (onCountChange) => {
  if (!navigator.onLine || isSyncing) return;

  const operations = await getPendingOperations();
  if (operations.length === 0) return;

  isSyncing = true;
  if (onCountChange) onCountChange(operations.length);
  
  const toastId = toast.loading(`Sincronizando ${operations.length} operaciones...`, {
    icon: React.createElement(RefreshCw, { size: 18, className: "animate-spin" })
  });

  let successCount = 0;
  let failCount = 0;

  for (const op of operations) {
    await updatePendingOperationStatus(op.id, 'syncing');
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json', ...op.headers };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // This performs the actual real request directly, bypassing our interceptor's offline check
      // because we are explicitly online and need to push this to the backend.
      const response = await fetch(`${API_URL}${op.endpoint}`, {
        method: op.method,
        headers,
        body: op.body ? JSON.stringify(op.body) : undefined
      });

      let data;
      try {
        data = await response.json();
      } catch (_) {
        data = null;
      }

      if (response.ok) {
        await removePendingOperation(op.id);
        successCount++;
        // NOTE: Our api interceptor handles GET cache updates, but since operations succeed, 
        // a subsequent refresh or navigation will fetch the updated dataset.
      } else {
        failCount++;
        // We remove the operation because it failed business logic at the server level (e.g. invalid state transitions).
        // It should not infinitely retry on successive reconnections.
        await removePendingOperation(op.id);
        
        const errorMsg = data?.error || data?.message || response.statusText || 'Error desconocido';
        toast.error(`No se pudo sincronizar la acción (${op.method}): ${errorMsg}`, { 
          duration: 10000,
          action: {
            label: 'Cerrar',
            onClick: () => {}
          }
        });
      }
    } catch (err) {
      // This happens if fetch fails entirely (network drops during sync)
      console.error('Network dropped during sync step:', err);
      await updatePendingOperationStatus(op.id, 'pending');
      break; 
    }
  }

  toast.dismiss(toastId);
  if (successCount > 0) {
    toast.success(`${successCount} operaciones sincronizadas de manera exitosa.`);
    
    // Optional: trigger a custom event that pages can listen to for refreshing data
    window.dispatchEvent(new Event('dashboard-synced'));
  }

  if (onCountChange) onCountChange(0);
  isSyncing = false;
};

export const startSyncEngine = () => {
  window.addEventListener('online', () => {
    syncPendingOperations();
  });
  
  if (navigator.onLine) {
    syncPendingOperations();
  }
};
