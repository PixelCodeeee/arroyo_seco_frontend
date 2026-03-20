import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

// Get user language or fallback to es
const userLang = navigator.language || navigator.userLanguage;
const defaultLanguage = userLang.startsWith('en') ? 'en' : 'es';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            es: {
                translation: esTranslation
            }
        },
        lng: localStorage.getItem('app_language') || defaultLanguage,
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false // React already escapes values
        }
    });

export default i18n;
