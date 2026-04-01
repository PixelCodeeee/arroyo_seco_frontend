import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile naturally
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            
            // Do not nag if dismissed previously
            if (!localStorage.getItem('installPromptDismissed')) {
                setShow(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        
        // Show the prompt
        deferredPrompt.prompt();
        
        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setShow(false);
        }
        
        // Clear the saved prompt since it can't be used again
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShow(false);
        localStorage.setItem('installPromptDismissed', 'true');
    };

    if (!show) return null;

    return (
        <div style={{
            position: 'fixed', 
            bottom: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            backgroundColor: '#ffffff', 
            border: '2px solid var(--primary-color, #0f766e)',
            borderRadius: '12px', 
            padding: '20px', 
            zIndex: 10002,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)', 
            width: '90%', 
            maxWidth: '380px',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            textAlign: 'center',
            animation: 'slideUp 0.5s ease-out'
        }}>
            <button 
                onClick={handleDismiss} 
                style={{
                    position: 'absolute', top: '8px', right: '8px', 
                    background: 'none', border: 'none', cursor: 'pointer', color: '#666'
                }}>
                <X size={20} />
            </button>
            
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>¡Instala nuestra App!</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.5' }}>
                Agrega Arroyo Seco a tu pantalla de inicio para navegar más rápido y acceder sin conexión a internet.
            </p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={handleInstall} style={{
                    flex: 1, padding: '12px', background: 'var(--primary-color, #0f766e)',
                    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontWeight: 'bold', fontSize: '1rem'
                }}>
                    <Download size={20}/> Instalar Ahora
                </button>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translate(-50%, 100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default InstallPrompt;
