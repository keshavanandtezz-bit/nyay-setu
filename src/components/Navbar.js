import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ theme = 'gold', showBack = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  function handleBack() {
    if (location.pathname.startsWith('/legal')) navigate('/legal');
    else if (location.pathname.startsWith('/citizen')) navigate('/citizen');
    else navigate('/');
  }

  const color = theme === 'green' ? '#1d9e75' : '#d4a843';
  const portalLabel = theme === 'green' ? t('common.citizenPortal') : 
                      theme === 'legal' ? t('common.legalPortal') : 'India';

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: window.innerWidth < 480 ? '0.75rem 1rem' : '1rem 2.5rem',
    borderBottom: `1px solid ${color}22`,
    background: 'var(--bg-nav)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: `0 4px 30px rgba(0,0,0,0.1), 0 1px 0 ${color}11`,
    transition: 'all 0.3s ease'
  };

  return (
    <nav style={navStyle}>
      <div
        onClick={handleBack}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: 'float 4s infinite ease-in-out' }}>
          <path d="M16 4L6 9v6c0 5.5 4 10.7 10 12 6-1.3 10-6.5 10-12V9L16 4z"
            stroke={color} strokeWidth="1.5" fill={`${color}15`} />
          <line x1="10" y1="16" x2="22" y2="16" stroke={color} strokeWidth="1.5" />
          <line x1="16" y1="10" x2="16" y2="22" stroke={color} strokeWidth="1.5" />
        </svg>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem',
            fontWeight: 700, color, lineHeight: 1 }}>Nyay Setu</div>
          <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
            color: `${color}99`, lineHeight: 1 }}>{portalLabel}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <LanguageSelector theme={theme} />
        <ThemeToggle />

        {showBack && (
          <div onClick={handleBack}
            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer',
              padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-card-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-card)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            ← {t('common.backToHome')}
          </div>
        )}

        {!showBack && (
          <div style={{ fontSize: '0.7rem', padding: '4px 12px',
            border: `1px solid ${color}44`, borderRadius: 20,
            color: `${color}bb`, letterSpacing: 1,
            background: `${color}11`, boxShadow: `0 0 10px ${color}11` }}>
            {t('common.beta')}
          </div>
        )}
      </div>
    </nav>
  );
}