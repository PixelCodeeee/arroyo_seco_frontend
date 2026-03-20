import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeProvider';
import { Settings as SettingsIcon, Type, Moon, Sun, Monitor, Languages, Eye, X, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/SettingsModal.css';

const SettingsModal = () => {
    const { t, i18n } = useTranslation();
    const { theme, setTheme, fontSize, setFontSize, dyslexiaFont, setDyslexiaFont, isSettingsOpen, setIsSettingsOpen } = useTheme();

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
        i18n.changeLanguage(lng);
        localStorage.setItem('app_language', lng);
        toast.success(lng === 'en' ? 'Language set to English' : 'Idioma configurado a Español');
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
                        <div className="setting-actions">
                            <button
                                onClick={() => handleLanguageChange('es')}
                                className="setting-btn"
                                style={{
                                    backgroundColor: i18n.language.startsWith('es') ? 'var(--accent)' : 'transparent',
                                    color: i18n.language.startsWith('es') ? '#fff' : '#ccc',
                                    borderColor: i18n.language.startsWith('es') ? 'var(--accent)' : '#444'
                                }}
                            >
                                ES
                            </button>
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className="setting-btn"
                                style={{
                                    backgroundColor: i18n.language.startsWith('en') ? 'var(--accent)' : 'transparent',
                                    color: i18n.language.startsWith('en') ? '#fff' : '#ccc',
                                    borderColor: i18n.language.startsWith('en') ? 'var(--accent)' : '#444'
                                }}
                            >
                                EN
                            </button>
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
