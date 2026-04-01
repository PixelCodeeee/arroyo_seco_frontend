import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            document.documentElement.style.setProperty('--offline-banner-height', '0px');
        };
        const handleOffline = () => {
            setIsOffline(true);
            document.documentElement.style.setProperty('--offline-banner-height', '40px');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check on mount
        if (!navigator.onLine) {
            document.documentElement.style.setProperty('--offline-banner-height', '40px');
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            document.documentElement.style.setProperty('--offline-banner-height', '0px');
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '40px',
            backgroundColor: 'var(--danger-color, #ef4444)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            zIndex: 10001,
            fontSize: '0.875rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        }} title="Sin conexión - Modo Offline">
            <WifiOff style={{ width: '1.2rem', height: '1.2rem' }} />
            <span>Modo Offline - Trabajando sin conexión</span>
        </div>
    );
};

export default OfflineIndicator;
