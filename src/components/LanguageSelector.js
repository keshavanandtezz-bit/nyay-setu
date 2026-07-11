import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

export default function LanguageSelector({ theme = 'green' }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const color = theme === 'green' ? '#1d9e75' : '#d4a843';
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(code) {
    i18n.changeLanguage(code);
    localStorage.setItem('nyay_setu_lang', code);
    document.documentElement.setAttribute('lang', code);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select Language"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', fontSize: '0.75rem',
          background: 'transparent',
          border: `1px solid ${color}44`,
          borderRadius: 20, color: `${color}cc`,
          cursor: 'pointer', letterSpacing: 0.5,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${color}88`;
          e.currentTarget.style.background = `${color}10`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = `${color}44`;
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span style={{ fontSize: '0.85rem' }}>🌐</span>
        <span>{currentLang.nativeLabel}</span>
        <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '110%', right: 0,
          background: '#0d1f1a', border: `1px solid ${color}33`,
          borderRadius: 10, padding: '6px 0',
          minWidth: 160, zIndex: 200,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${color}15`,
          animation: 'langDropIn 0.15s ease-out',
        }}>
          {LANGUAGES.map(lang => (
            <div
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 16px', cursor: 'pointer', fontSize: '0.8rem',
                color: i18n.language === lang.code ? color : 'rgba(216,237,230,0.7)',
                background: i18n.language === lang.code ? `${color}12` : 'transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (i18n.language !== lang.code) {
                  e.currentTarget.style.background = `${color}0a`;
                  e.currentTarget.style.color = '#d8ede6';
                }
              }}
              onMouseLeave={e => {
                if (i18n.language !== lang.code) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(216,237,230,0.7)';
                }
              }}
            >
              <span>{lang.nativeLabel}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>{lang.label}</span>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes langDropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
