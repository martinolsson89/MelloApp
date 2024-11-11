// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: { translation: { welcome: 'Welcome' } },
    sv: { translation: { welcome: 'Välkommen' } },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'sv', // set default language
        interpolation: { escapeValue: false },
    });

export default i18n;
