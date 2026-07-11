/**
 * i18next configuration for Nyay Setu v2.0
 * 
 * Supported languages:
 *   en - English (default)
 *   hi - Hindi
 *   kn - Kannada
 *   ta - Tamil
 *   te - Telugu
 *   bn - Bengali
 *   mr - Marathi
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import bn from './locales/bn.json';
import mr from './locales/mr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      kn: { translation: kn },
      ta: { translation: ta },
      te: { translation: te },
      bn: { translation: bn },
      mr: { translation: mr },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'kn', 'ta', 'te', 'bn', 'mr'],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'nyay_setu_lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
