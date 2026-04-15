import { openDB } from 'idb';

const DB_NAME = 'arroyo_seco_pwa';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('pending_operations')) {
        const store = db.createObjectStore('pending_operations', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp');
      }

      const caches = [
        'cached_pedidos',
        'cached_reservas',
        'cached_productos',
        'cached_categorias',
        'cached_servicios',
        'cached_usuarios',
        'cached_perfil',
        'cached_announcements'
      ];

      caches.forEach(cacheName => {
        if (!db.objectStoreNames.contains(cacheName)) {
          // Uses standard key-value setup where the Endpoint URL will be the key
          db.createObjectStore(cacheName);
        }
      });
    },
  });
};

// ==========================================
// Pending Operations CRUD
// ==========================================
export const addPendingOperation = async (operation) => {
  const db = await initDB();
  return db.add('pending_operations', { 
    ...operation, 
    timestamp: Date.now(),
    status: 'pending' 
  });
};

export const getPendingOperations = async () => {
  const db = await initDB();
  return db.getAllFromIndex('pending_operations', 'timestamp');
};

export const removePendingOperation = async (id) => {
  const db = await initDB();
  return db.delete('pending_operations', id);
};

export const updatePendingOperationStatus = async (id, status) => {
  const db = await initDB();
  const tx = db.transaction('pending_operations', 'readwrite');
  const store = tx.objectStore('pending_operations');
  const op = await store.get(id);
  if (op) {
    op.status = status;
    await store.put(op);
  }
  await tx.done;
};

// ==========================================
// Caching GET Requests
// ==========================================
export const setCache = async (storeName, key, data) => {
  try {
    const db = await initDB();
    if (db.objectStoreNames.contains(storeName)) {
      await db.put(storeName, data, key);
    }
  } catch (err) {
    console.error(`Failed to set cache for ${storeName}`, err);
  }
};

export const getCache = async (storeName, key) => {
  try {
    const db = await initDB();
    if (db.objectStoreNames.contains(storeName)) {
      return await db.get(storeName, key);
    }
    return null;
  } catch (err) {
    console.warn(`Failed to get cache for ${storeName}`, err);
    return null;
  }
};
