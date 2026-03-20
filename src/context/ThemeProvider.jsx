import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Read initial states from localStorage or use defaults
    const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');
    const [fontSize, setFontSize] = useState(() => localStorage.getItem('app_fontSize') || 'medium');
    const [dyslexiaFont, setDyslexiaFont] = useState(() => localStorage.getItem('app_dyslexiaFont') === 'true');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        // Apply theme class to HTML root
        const root = document.documentElement;

        // Remove old classes
        root.classList.remove('theme-light', 'theme-dark', 'theme-hc');
        root.classList.add(`theme-${theme}`);
        localStorage.setItem('app_theme', theme);

        // Remove old font sizes
        root.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
        root.classList.add(`font-${fontSize}`);
        localStorage.setItem('app_fontSize', fontSize);

        // Apply dyslexia font toggle
        if (dyslexiaFont) {
            root.classList.add('font-dyslexia');
        } else {
            root.classList.remove('font-dyslexia');
        }
        localStorage.setItem('app_dyslexiaFont', dyslexiaFont.toString());

    }, [theme, fontSize, dyslexiaFont]);

    const value = {
        theme,
        setTheme,
        fontSize,
        setFontSize,
        dyslexiaFont,
        setDyslexiaFont,
        isSettingsOpen,
        setIsSettingsOpen
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
