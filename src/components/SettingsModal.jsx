import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeProvider';
import { Settings as SettingsIcon, Type, Moon, Sun, Monitor, Languages, Eye, X, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/SettingsModal.css';

const SettingsModal = () => {
    const { t, i18n } = useTranslation();
    const { theme, setTheme, fontSize, setFontSize, dyslexiaFont, setDyslexiaFont, isSettingsOpen, setIsSettingsOpen, contrast, setContrast } = useTheme();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isSettingsOpen) {
                setIsSettingsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSettingsOpen, setIsSettingsOpen]);

    if (!isSettingsOpen) return null;

    const handleLanguageChange = (lng) => {
        try {
            i18n.changeLanguage(lng);
        } catch(e) {}
        
        localStorage.setItem('app_language', lng);
        toast.success(lng === 'en' ? 'Changing language...' : 'Cambiando idioma...', { duration: 1500 });
        
        // Native Google Translate trigger
        const selectField = document.querySelector('.goog-te-combo');
        if (selectField) {
            selectField.value = lng;
            selectField.dispatchEvent(new Event('change'));
        }
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        toast.success(newTheme === 'dark' ? 'Tema oscuro activado' : newTheme === 'hc' ? 'Alto contraste activado' : 'Tema claro activado');
    };

    const handleFontSizeChange = (size) => {
        setFontSize(size);
        toast.success(`Tamaño de fuente actualizado`);
    };

    return (
        <div className="settings-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsSettingsOpen(false) }}>
            <div className="settings-modal-box settings-modal-animate">

                {/* Header */}
                <div className="settings-header">
                    <SettingsIcon
                        className="settings-header-icon"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setIsSettingsOpen(false)}
                    />
                    <h1 className="settings-title">
                        {t('settings.title', 'Configuración')}
                    </h1>
                </div>

                <div className="settings-content">
                    {/* Setting Item: Language */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon-wrapper">
                                <Languages className="setting-icon" />
                            </div>
                            <div className="setting-text">
                                <h2>{t('settings.language', 'Language')}</h2>
                                <p>Select your preferred language</p>
                            </div>
                        </div>
                        <div className="setting-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxWidth: '300px' }}>
                            {[
                              { code: 'es', label: '🇲🇽 ES' },
                              { code: 'en', label: '🇺🇸 EN' },
                              { code: 'fr', label: '🇫🇷 FR' },
                              { code: 'de', label: '🇩🇪 DE' },
                              { code: 'pt', label: '🇧🇷 PT' },
                              { code: 'ja', label: '🇯🇵 JA' },
                              { code: 'ru', label: '🇷🇺 RU' },
                              { code: 'ar', label: '🇸🇦 AR' },
                              { code: 'it', label: '🇮🇹 IT' },
                              { code: 'zh-CN', label: '🇨🇳 ZH' }
                            ].map(lang => {
                                const currentLang = i18n.language || localStorage.getItem('app_language') || 'es';
                                const isActive = currentLang.startsWith(lang.code);
                                return (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className="setting-btn"
                                    style={{
                                        padding: '4px 8px',
                                        fontSize: '0.85rem',
                                        backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                                        color: isActive ? '#fff' : '#ccc',
                                        borderColor: isActive ? 'var(--accent)' : '#444'
                                    }}
                                >
                                    {lang.label}
                                </button>
                            )})}
                        </div>
                    </div>

                    {/* Setting Item: Theme */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon-wrapper">
                                <Sun className="setting-icon" />
                            </div>
                            <div className="setting-text">
                                <h2>{t('settings.theme', 'Theme')}</h2>
                                <p>Customize the interface appearance</p>
                            </div>
                        </div>
                        <div className="setting-actions">
                            <button
                                onClick={() => handleThemeChange('light')}
                                className="setting-btn setting-btn-icon"
                                title={t('settings.light')}
                                style={{
                                    backgroundColor: theme === 'light' ? 'var(--accent)' : 'transparent',
                                    color: theme === 'light' ? '#fff' : '#ccc',
                                    borderColor: theme === 'light' ? 'var(--accent)' : '#444'
                                }}
                            >
                                <Sun />
                            </button>
                            <button
                                onClick={() => handleThemeChange('dark')}
                                className="setting-btn setting-btn-icon"
                                title={t('settings.dark')}
                                style={{
                                    backgroundColor: theme === 'dark' ? 'var(--accent)' : 'transparent',
                                    color: theme === 'dark' ? '#fff' : '#ccc',
                                    borderColor: theme === 'dark' ? 'var(--accent)' : '#444'
                                }}
                            >
                                <Moon />
                            </button>
                            <button
                                onClick={() => handleThemeChange('hc')}
                                className="setting-btn setting-btn-icon"
                                title={t('settings.high_contrast')}
                                style={{
                                    backgroundColor: theme === 'hc' ? 'var(--accent)' : 'transparent',
                                    color: theme === 'hc' ? '#fff' : '#ccc',
                                    borderColor: theme === 'hc' ? 'var(--accent)' : '#444'
                                }}
                            >
                                <Eye />
                            </button>
                        </div>
                    </div>

                    {/* Setting Item: Contrast */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon-wrapper">
                                <Sun className="setting-icon" />
                            </div>
                            <div className="setting-text">
                                <h2>{t('settings.contrast', 'Contraste')}</h2>
                                <p>Ajustar el contraste de la interfaz</p>
                            </div>
                        </div>
                        <div className="setting-actions" style={{ flexDirection: 'column', alignItems: 'flex-start', width: '150px' }}>
                            <input
                                type="range"
                                min="100"
                                max="200"
                                value={contrast}
                                onChange={(e) => setContrast(Number(e.target.value))}
                                style={{ width: '100%', marginBottom: '8px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{contrast}%</span>
                                <button 
                                    className="setting-btn" 
                                    style={{ padding: '2px 8px', fontSize: '0.8rem' }} 
                                    onClick={() => setContrast(100)}
                                >
                                    Resetear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Setting Item: Font Size */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon-wrapper">
                                <Type className="setting-icon" />
                            </div>
                            <div className="setting-text">
                                <h2>{t('settings.font_size', 'Font Size')}</h2>
                                <p>Adjust the global text size</p>
                            </div>
                        </div>
                        <div className="setting-actions">
                            {['small', 'medium', 'large', 'xlarge'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleFontSizeChange(size)}
                                    className="setting-btn"
                                    style={{
                                        backgroundColor: fontSize === size ? 'var(--accent)' : 'transparent',
                                        color: fontSize === size ? '#fff' : '#ccc',
                                        borderColor: fontSize === size ? 'var(--accent)' : '#444'
                                    }}
                                >
                                    {size === 'small' ? 'A' : size === 'medium' ? 'AA' : size === 'large' ? 'AAA' : 'AAAA'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Setting Item: Dyslexia Font */}
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon-wrapper">
                                <BookOpen className="setting-icon" />
                            </div>
                            <div className="setting-text">
                                <h2>{t('settings.dyslexia_font', 'Dyslexia Font')}</h2>
                                <p>{t('settings.dyslexia_desc', 'Enable highly legible font')}</p>
                            </div>
                        </div>
                        <div>
                            <label className="setting-toggle">
                                <input
                                    type="checkbox"
                                    checked={dyslexiaFont}
                                    onChange={(e) => {
                                        setDyslexiaFont(e.target.checked);
                                        toast.success(e.target.checked ? 'Fuente activada' : 'Fuente desactivada');
                                    }}
                                />
                                <div
                                    className="setting-toggle-bg"
                                    style={{
                                        backgroundColor: dyslexiaFont ? 'var(--accent)' : 'transparent',
                                        borderColor: dyslexiaFont ? 'var(--accent)' : '#444'
                                    }}
                                ></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="settings-footer">
                    <div className="settings-footer-right">
                        <span className="settings-footer-key">Esc</span>
                        <span>Cerrar</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
