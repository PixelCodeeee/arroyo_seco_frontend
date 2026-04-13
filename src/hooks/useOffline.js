import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Conexión restaurada — sincronizando cambios...', { 
        icon: React.createElement(Wifi, { size: 18 }) 
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.warning('Modo sin conexión — los cambios se guardarán localmente', { 
        icon: React.createElement(WifiOff, { size: 18 }) 
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};
