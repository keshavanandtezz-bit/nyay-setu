import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { prisoners } from '../../data/prisoners';

const TEAL = '#1d9e75';

export default function CourtCalendar() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredTimeline, setHoveredTimeline] = useState(null);
  const [infoHovered, setInfoHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleSearch() {
    const q = query.toLowerCase().trim();
    const found = prisoners.find(p =>
      p.case_number?.toLowerCase().includes(q) ||
      p.prisoner_id?.toLowerCase().includes(q) ||
      p.prisoner_name?.toLowerCase().includes(q)
    );
    if (found) { setResult(found); setNotFound(false); }
    else { setResult(null); setNotFound(true); }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const daysUntil = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
  };

  const allDates = result ? [
    ...result.hearings.map(h => ({ date: h.date, type: 'past', label: h.outcome, delay: h.delay_reason })),
    { date: result.next_hearing_date, type: 'upcoming', label: 'Next Scheduled Hearing', delay: null }
  ] : [];

  const daysLeft = result ? daysUntil(result.next_hearing_date) : 0;
  const hearingPassed = daysLeft < 0;

  return (
    <PageWrapper style={{ minHeight: '100vh', background: '#08120f', color: '#d8ede6' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '1.5rem 1rem' : '2rem 2.5rem' }}>

        {/* ── Header section ── */}
        <div className="reveal-on-scroll">
          <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(29,158,117,0.7)', marginBottom: '0.3rem' }}>{t('courtCalendar.subtitle')}</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: isMobile ? '1.6rem' : '2rem',
            fontWeight: 700,
            marginBottom: '0.4rem',
            background: 'linear-gradient(135deg, #d8ede6 0%, #1d9e75 50%, #2ed89c 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'rotateGradient 6s ease infinite',
          }}>{t('courtCalendar.title')}</h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(216,237,230,0.45)', fontWeight: 300,
            marginBottom: '2rem' }}>
            {t('courtCalendar.enterPrisonerId')}
          </p>
        </div>

        {/* ── Search bar with focus glow ── */}
        <div className="reveal-on-scroll" style={{
          display: 'flex',
          background: searchFocused ? 'rgba(29,158,117,0.1)' : 'rgba(29,158,117,0.06)',
          border: `1px solid ${searchFocused ? 'rgba(29,158,117,0.5)' : 'rgba(29,158,117,0.22)'}`,
          borderRadius: 10,
          overflow: 'hidden',
          marginBottom: '0.6rem',
          transition: 'all 0.3s ease',
          boxShadow: searchFocused
            ? '0 0 15px rgba(29,158,117,0.25), 0 0 30px rgba(29,158,117,0.1)'
            : '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t('courtCalendar.enterPrisonerId')}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              padding: '0.9rem 1.2rem', fontSize: isMobile ? '0.82rem' : '0.9rem', color: '#d8ede6',
              fontFamily: "'Outfit',sans-serif" }}
          />
          <button onClick={handleSearch}
            style={{ padding: isMobile ? '0.9rem 1.2rem' : '0.9rem 2rem', background: TEAL, border: 'none',
              color: 'white', fontFamily: "'Outfit',sans-serif",
              fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2ed89c'}
            onMouseLeave={e => e.currentTarget.style.background = TEAL}
          >{t('common.search')}</button>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(216,237,230,0.25)',
          marginBottom: '1.5rem' }}>
          Try: SC/BLR/2024/1182 · JMFC/MYS/2023/887 · SC/TUK/2023/445
        </div>

        {/* ── Not found state ── */}
        {notFound && (
          <div className="reveal-on-scroll" style={{ padding: '2rem', textAlign: 'center',
            border: '1px solid rgba(29,158,117,0.1)', borderRadius: 12,
            animation: 'fadeInUp 0.4s ease forwards' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
            <div style={{ color: '#d8ede6', marginBottom: '0.4rem' }}>{t('common.noResults')}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(216,237,230,0.4)' }}>
              Check the case number and try again, or contact your nearest court registry.
            </div>
          </div>
        )}

        {/* ── Result section ── */}
        {result && (
          <div>
            {/* Case info card */}
            <div className="reveal-on-scroll glass-card" style={{
              background: 'rgba(29,158,117,0.05)',
              border: '1px solid rgba(29,158,117,0.15)', borderRadius: 12,
              padding: isMobile ? '1.2rem' : '1.4rem 1.8rem', marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'stretch' : 'flex-start',
              gap: isMobile ? '1rem' : 0,
            }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem',
                  fontWeight: 700, color: '#d8ede6', marginBottom: '0.3rem' }}>
                  {result.prisoner_name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(216,237,230,0.45)' }}>
                  {result.case_number} · {result.court}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(216,237,230,0.35)', marginTop: 4 }}>
                  {result.charges}
                </div>
              </div>
              <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                {hearingPassed ? (
                  <>
                    <div style={{ fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
                      color: 'rgba(226,75,74,0.7)', marginBottom: 4 }}>{t('courtCalendar.hearingPassed')}</div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: isMobile ? '1.2rem' : '1.4rem',
                      fontWeight: 700,
                      color: '#e24b4a',
                      lineHeight: 1,
                      animation: 'countFade 0.6s ease forwards',
                      textShadow: '0 0 20px rgba(226,75,74,0.3)',
                    }}>
                      {Math.abs(daysLeft)} {t('courtCalendar.daysAgo')}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
                      color: 'rgba(29,158,117,0.6)', marginBottom: 4 }}>{t('courtCalendar.daysUntil')}</div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: isMobile ? '1.6rem' : '2rem',
                      fontWeight: 700,
                      lineHeight: 1,
                      background: 'linear-gradient(135deg, #d4a843, #f0d78c)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'countFade 0.6s ease forwards',
                      filter: 'drop-shadow(0 0 8px rgba(212,168,67,0.3))',
                    }}>
                      {daysLeft}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(216,237,230,0.3)' }}>days</div>
                  </>
                )}
              </div>
            </div>

            {/* Timeline section */}
            <div className="reveal-on-scroll" style={{ background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(29,158,117,0.1)', borderRadius: 12,
              padding: isMobile ? '1.2rem' : '1.5rem 1.8rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem',
                fontWeight: 600, color: '#d8ede6', marginBottom: '1.5rem' }}>{t('statusTracker.hearingHistory')}</div>
              <div className="stagger-children" style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0,
                  width: 1, background: 'linear-gradient(to bottom, rgba(29,158,117,0.3), rgba(29,158,117,0.05))' }} />
                {allDates.map((item, i) => {
                  const isUpcoming = item.type === 'upcoming';
                  return (
                    <div key={i}
                      onMouseEnter={() => setHoveredTimeline(i)}
                      onMouseLeave={() => setHoveredTimeline(null)}
                      style={{
                        position: 'relative',
                        marginBottom: '1.3rem',
                        padding: '0.5rem 0.7rem',
                        borderRadius: 8,
                        background: hoveredTimeline === i ? 'rgba(29,158,117,0.06)' : 'transparent',
                        transition: 'all 0.25s ease',
                        transform: hoveredTimeline === i ? 'translateX(4px)' : 'translateX(0)',
                      }}>
                      <div style={{
                        position: 'absolute', left: '-1.5rem', top: 11,
                        width: 13, height: 13, borderRadius: '50%', zIndex: 1,
                        background: isUpcoming ? 'transparent' : '#1d9e75',
                        border: isUpcoming ? '2px solid #d4a843' : '2px solid #08120f',
                        boxShadow: isUpcoming ? '0 0 8px rgba(212,168,67,0.4)' : 'none',
                        transition: 'box-shadow 0.3s ease',
                      }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem',
                          color: isUpcoming ? '#d4a843' : 'rgba(216,237,230,0.35)',
                          letterSpacing: '0.5px' }}>
                          {isUpcoming ? '⬡ UPCOMING — ' : ''}{formatDate(item.date)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem',
                        color: isUpcoming ? 'rgba(216,237,230,0.6)' : '#d8ede6',
                        fontStyle: isUpcoming ? 'italic' : 'normal',
                        marginBottom: '0.2rem' }}>{item.label}</div>
                      {item.delay && item.delay !== 'None' && (
                        <div style={{ fontSize: '0.72rem', color: 'rgba(239,159,39,0.65)',
                          display: 'flex', alignItems: 'center', gap: 4 }}>
                          ⚠ Delayed — {item.delay}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info note with hover lift */}
            <div
              className="reveal-on-scroll"
              onMouseEnter={() => setInfoHovered(true)}
              onMouseLeave={() => setInfoHovered(false)}
              style={{
                padding: isMobile ? '1rem' : '1rem 1.4rem',
                background: infoHovered ? 'rgba(29,158,117,0.08)' : 'rgba(29,158,117,0.05)',
                border: `1px solid ${infoHovered ? 'rgba(29,158,117,0.3)' : 'rgba(29,158,117,0.15)'}`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 0.3s ease',
                transform: infoHovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: infoHovered
                  ? '0 8px 30px rgba(0,0,0,0.25), 0 0 15px rgba(29,158,117,0.1)'
                  : '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'default',
              }}>
              <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
              <div style={{ fontSize: '0.82rem', color: 'rgba(216,237,230,0.55)' }}>
                SMS alerts for hearing updates will be available soon.
                For now, bookmark this page and check back before your hearing date.
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}