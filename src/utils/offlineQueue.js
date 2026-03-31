// ============================================================
// offlineQueue.js — Cola offline con IndexedDB
// Guarda peticiones pendientes y las sincroniza cuando hay red
// ============================================================

const DB_NAME = 'arroyo_seco_offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending_requests';

// ---- Abrir / crear la base de datos ----
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// ---- Guardar una petición pendiente ----
export async function saveToQueue(endpoint, method, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item = {
      endpoint,
      method,
      data,
      createdAt: Date.now(),
    };
    const req = store.add(item);
    req.onsuccess = () => resolve(req.result); // devuelve el id generado
    req.onerror = (e) => reject(e.target.error);
  });
}

// ---- Obtener todas las peticiones pendientes ----
export async function getAllPending() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

// ---- Eliminar una petición ya procesada ----
export async function removeFromQueue(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject(e.target.error);
  });
}

// ---- Sincronizar todo lo pendiente con el backend ----
export async function syncPendingRequests(apiUrl) {
  const pending = await getAllPending();
  if (pending.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;

  for (const item of pending) {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiUrl}${item.endpoint}`, {
        method: item.method,
        headers,
        body: JSON.stringify(item.data),
      });

      if (response.ok) {
        await removeFromQueue(item.id);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}

// ---- Escuchar cuando regresa la conexión y sincronizar ----
export function startAutoSync(apiUrl, onSyncComplete) {
  window.addEventListener('online', async () => {
    const result = await syncPendingRequests(apiUrl);
    if (result.synced > 0 && onSyncComplete) {
      onSyncComplete(result);
    }
  });
}
