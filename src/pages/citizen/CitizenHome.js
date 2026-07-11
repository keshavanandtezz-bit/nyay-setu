import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';

export default function CitizenHome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const searchRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const features = [
    { icon: '⚖️', title: t('citizen.nyayYatra'), tag: t('citizen.nyayYatraTag'),
      desc: t('citizen.nyayYatraDesc'),
      route: '/citizen/nyay-yatra' },
    { icon: '👤', title: t('citizen.prisonerStatus'), tag: t('citizen.prisonerStatusTag'),
      desc: t('citizen.prisonerStatusDesc'),
      route: '/citizen/status' },
    { icon: '🤖', title: t('citizen.knowYourRights'), tag: t('citizen.knowYourRightsTag'),
      desc: t('citizen.knowYourRightsDesc'),
      route: '/citizen/rights' },
    { icon: '🗓️', title: t('citizen.courtCalendar'), tag: t('citizen.courtCalendarTag'),
      desc: t('citizen.courtCalendarDesc'),
      route: '/citizen/calendar' },
    { icon: '🧑‍⚖️', title: t('citizen.freeLegalAid'), tag: t('citizen.freeLegalAidTag'),
      desc: t('citizen.freeLegalAidDesc'),
      route: '/citizen/legal-aid' },
    { icon: '📋', title: t('citizen.fileComplaint'), tag: t('citizen.fileComplaintTag'),
      desc: t('citizen.fileComplaintDesc'),
      route: '/citizen/rights' },
    { icon: '🔔', title: t('citizen.smsAlerts'), tag: t('citizen.smsAlertsTag'),
      desc: t('citizen.smsAlertsDesc'),
      route: '/citizen/calendar' },
  ];

  function handleSearch(e) {
    if (e.key === 'Enter' || e.type === 'click') {
      const val = searchRef.current?.value?.trim();
      if (val) navigate(`/citizen/status?q=${encodeURIComponent(val)}`);
    }
  }

  return (
    <PageWrapper style={{ minHeight: '100vh', background: '#08120f', color: '#d8ede6' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        margin: isMobile ? '1rem' : '1rem 2.5rem', padding: '0.9rem 1.4rem',
        background: 'rgba(162,29,29,0.08)', border: '1px solid rgba(162,29,29,0.2)',
        borderRadius: 10, animation: 'fadeInScale 0.5s ease-out',
        boxShadow: '0 0 15px rgba(162,29,29,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e24b4a',
            animation: 'cpulse 1.5s infinite' }} />
          <span style={{ fontSize: isMobile ? '0.7rem' : '0.82rem', color: 'rgba(216,237,230,0.6)' }}>
            <strong style={{ color: '#f09595' }}>{t('citizen.emergency')}</strong>
            {' '}{t('citizen.emergencyNumbers')}
          </span>
        </div>
        <button style={{ fontSize: '0.75rem', padding: '5px 14px',
          background: 'rgba(162,29,29,0.15)', border: '1px solid rgba(162,29,29,0.3)',
          borderRadius: 6, color: '#f09595', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(162,29,29,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(162,29,29,0.15)'}>
          {t('citizen.quickDial')}
        </button>
      </div>

      <div className="reveal-on-scroll" style={{ padding: isMobile ? '1rem 1.5rem' : '1.5rem 2.5rem 1rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase',
          color: '#1d9e75', marginBottom: '0.5rem' }}>{t('citizen.welcome')}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? '2rem' : '2.6rem',
          fontWeight: 700, color: '#d8ede6', lineHeight: 1.15, marginBottom: '0.5rem',
          background: 'linear-gradient(90deg, #d8ede6, #1d9e75)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('citizen.howCanWeHelp')}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(216,237,230,0.5)', fontWeight: 300,
          maxWidth: 450, lineHeight: 1.6 }}>
          {t('citizen.searchDesc')}
        </p>
      </div>

      <div className="reveal-on-scroll" style={{ padding: isMobile ? '0 1.5rem 1rem' : '0 2.5rem 1.5rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase',
          color: 'rgba(29,158,117,0.7)', marginBottom: '0.8rem' }}>{t('citizen.trackCase')}</div>
        <div style={{ display: 'flex', background: 'rgba(29,158,117,0.06)',
          border: '1px solid rgba(29,158,117,0.2)', borderRadius: 10, overflow: 'hidden',
          transition: 'box-shadow 0.3s' }}
          onFocus={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(29,158,117,0.3)'}
          onBlur={e => e.currentTarget.style.boxShadow = 'none'}>
          <input ref={searchRef} type="text" onKeyDown={handleSearch}
            placeholder={t('citizen.searchPlaceholder')}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              padding: '0.9rem 1.2rem', fontSize: '0.9rem', color: '#d8ede6',
              fontFamily: "'Outfit',sans-serif" }}
          />
          <button onClick={handleSearch}
            style={{ padding: '0.9rem 1.8rem', background: '#1d9e75', border: 'none',
              color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: '0.85rem',
              fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#2ed89c'}
            onMouseLeave={e => e.currentTarget.style.background = '#1d9e75'}>
            {t('common.search')}
          </button>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '1rem',
        padding: isMobile ? '0 1.5rem 2.5rem' : '0 2.5rem 2.5rem', maxWidth: 1000, margin: '0 auto' }}>
        {features.map((f, i) => (
          <FeatureCard key={i} f={f} onClick={() => navigate(f.route)} />
        ))}
      </div>
      <style>{`@keyframes cpulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </PageWrapper>
  );
}

function FeatureCard({ f, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div onClick={onClick}
      className="glass-card"
      style={{ background: 'rgba(29,158,117,0.05)',
        border: '1px solid rgba(29,158,117,0.12)', borderRadius: 12,
        padding: '1.4rem', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: hovered ? '0 8px 25px rgba(29,158,117,0.15)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      
      {/* Shimmer sweep */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
        transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
        transition: 'transform 0.5s ease',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.8rem', transition: 'transform 0.3s',
          transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)' }}>{f.icon}</div>
        <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#d8ede6',
          marginBottom: '0.4rem' }}>{f.title}</div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(216,237,230,0.5)',
          lineHeight: 1.5, marginBottom: '1rem' }}>{f.desc}</div>
        <div style={{ fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
          color: '#1d9e75', opacity: 0.8, display: 'inline-block',
          transition: 'transform 0.3s', transform: hovered ? 'translateX(5px)' : 'none' }}>{f.tag}</div>
      </div>
    </div>
  );
}