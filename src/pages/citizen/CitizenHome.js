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

  const [smsModal, setSmsModal] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);

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
      route: '/citizen/file-complaint' },
    { icon: '🔔', title: t('citizen.smsAlerts'), tag: t('citizen.smsAlertsTag'),
      desc: t('citizen.smsAlertsDesc'),
      route: null, onCardClick: () => setSmsModal(true) },
  ];

  function handleSearch(e) {
    if (e.key === 'Enter' || e.type === 'click') {
      const val = searchRef.current?.value?.trim();
      if (val) navigate(`/citizen/status?q=${encodeURIComponent(val)}`);
    }
  }

  return (
    <PageWrapper style={{ minHeight: '100vh', background: 'var(--bg-citizen)', color: 'var(--text-citizen)' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        margin: isMobile ? '1rem' : '1rem 2.5rem', padding: '0.9rem 1.4rem',
        background: 'rgba(162,29,29,0.08)', border: '1px solid rgba(162,29,29,0.2)',
        borderRadius: 10, animation: 'fadeInScale 0.5s ease-out',
        boxShadow: '0 0 15px rgba(162,29,29,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e24b4a',
            animation: 'cpulse 1.5s infinite' }} />
          <span style={{ fontSize: isMobile ? '0.7rem' : '0.82rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: '#f09595' }}>{t('citizen.emergency')}</strong>
            {' '}{t('citizen.emergencyNumbers')}
          </span>
        </div>
        <button
          onClick={() => window.location.href = 'tel:15100'}
          style={{ fontSize: '0.75rem', padding: '5px 14px',
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
          fontWeight: 700, color: 'var(--text-citizen)', lineHeight: 1.15, marginBottom: '0.5rem',
          background: 'linear-gradient(90deg, #d8ede6, #1d9e75)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('citizen.howCanWeHelp')}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 300,
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
              padding: '0.9rem 1.2rem', fontSize: '0.9rem', color: 'var(--text-citizen)',
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
          <FeatureCard key={i} f={f} onClick={f.onCardClick ? f.onCardClick : () => navigate(f.route)} />
        ))}
      </div>

      {/* SMS Alerts Modal */}
      {smsModal && (
        <div onClick={() => { setSmsModal(false); setSmsSent(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(6px)', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-citizen)', border: '1px solid rgba(29,158,117,0.25)',
              borderRadius: 16, padding: '2rem', maxWidth: 420, width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)', animation: 'fadeInScale 0.3s ease' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>🔔</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem',
              color: 'var(--text-citizen)', textAlign: 'center', marginBottom: '0.5rem' }}>
              SMS Hearing Alerts
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center',
              lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Get free SMS notifications 3 days before every court hearing date.
              Enter your mobile number to register.
            </p>
            {!smsSent ? (
              <div>
                <input
                  type="tel"
                  value={smsPhone}
                  onChange={e => setSmsPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.8rem 1rem',
                    background: 'rgba(29,158,117,0.06)', border: '1px solid rgba(29,158,117,0.2)',
                    borderRadius: 8, color: 'var(--text-citizen)', fontSize: '1rem',
                    fontFamily: "'Outfit',sans-serif", outline: 'none', marginBottom: '1rem' }}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)',
                  background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)',
                  borderRadius: 8, padding: '0.7rem 1rem', marginBottom: '1.2rem',
                  lineHeight: 1.5 }}>
                  ⏳ <strong style={{ color: '#d4a843' }}>Coming Soon:</strong> SMS integration
                  is in active development. We'll notify you as soon as it launches.
                  Thank you for your interest!
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    onClick={() => { if (smsPhone.length === 10 && /^[0-9]{10}$/.test(smsPhone)) setSmsSent(true); }}
                    disabled={smsPhone.length !== 10 || !/^[0-9]{10}$/.test(smsPhone)}
                    style={{ flex: 1, padding: '0.8rem', background: (smsPhone.length === 10 && /^[0-9]{10}$/.test(smsPhone)) ? '#1d9e75' : 'rgba(29,158,117,0.3)',
                      border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.88rem',
                      fontWeight: 600, cursor: (smsPhone.length === 10 && /^[0-9]{10}$/.test(smsPhone)) ? 'pointer' : 'not-allowed',
                      fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s' }}>
                    Pre-Register
                  </button>
                  <button onClick={() => setSmsModal(false)}
                    style={{ padding: '0.8rem 1.2rem', background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                      color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.88rem',
                      fontFamily: "'Outfit',sans-serif" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                <p style={{ color: 'var(--text-citizen)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  +91-{smsPhone} Pre-Registered!
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6,
                  marginBottom: '1.5rem' }}>
                  You'll receive an SMS as soon as the service launches.
                  You can also check hearing dates anytime via Court Calendar.
                </p>
                <button onClick={() => { setSmsModal(false); setSmsSent(false); setSmsPhone(''); }}
                  style={{ padding: '0.7rem 2rem', background: '#1d9e75', border: 'none',
                    borderRadius: 8, color: '#fff', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
        <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-citizen)',
          marginBottom: '0.4rem' }}>{f.title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)',
          lineHeight: 1.5, marginBottom: '1rem' }}>{f.desc}</div>
        <div style={{ fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
          color: '#1d9e75', opacity: 0.8, display: 'inline-block',
          transition: 'transform 0.3s', transform: hovered ? 'translateX(5px)' : 'none' }}>{f.tag}</div>
      </div>
    </div>
  );
}