import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { citizenAPI } from '../../services/api';
import { searchPrisoners, getDaysInCustody, getAlertStatus } from '../../data/prisoners';

const TEAL = '#1d9e75';

export default function StatusTracker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (query) {
      setLoading(true);
      citizenAPI.searchPrisoner(query)
        .then(data => {
          const found = data.results || [];
          setResults(found);
          setSearched(true);
          if (found.length === 1) setSelected(found[0]);
        })
        .catch(() => {
          const found = searchPrisoners(query);
          setResults(found);
          setSearched(true);
          if (found.length === 1) setSelected(found[0]);
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  function handleSearch() {
    if (!inputVal.trim()) return;
    setSelected(null); // Reset selection
    navigate(`/citizen/status?q=${encodeURIComponent(inputVal.trim())}`);
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <PageWrapper style={{ minHeight: '100vh', background: 'var(--bg-citizen)', color: 'var(--text-citizen)' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '1.5rem' : '2rem 2.5rem' }}>

        <div className="reveal-on-scroll" style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
            fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-citizen)',
            background: 'linear-gradient(90deg, #d8ede6, #1d9e75)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('statusTracker.title')}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)',
            fontWeight: 300, marginBottom: '1.2rem' }}>
            {t('statusTracker.searchPlaceholder')}
          </p>
          <div style={{ display: 'flex', background: 'rgba(29,158,117,0.06)',
            border: '1px solid rgba(29,158,117,0.25)', borderRadius: 10, overflow: 'hidden',
            transition: 'box-shadow 0.3s' }}
            onFocus={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(29,158,117,0.3)'}
            onBlur={e => e.currentTarget.style.boxShadow = 'none'}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKey}
              placeholder={isMobile ? "ID or Name..." : "e.g. KA/BLR/2024/001 or Ramesh Kumar"}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '0.9rem 1.2rem', fontSize: '0.9rem', color: 'var(--text-citizen)',
                fontFamily: "'Outfit',sans-serif" }}
            />
            <button onClick={handleSearch}
              style={{ padding: '0.9rem 2rem', background: TEAL, border: 'none',
                color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: '0.85rem',
                fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#2ed89c'}
              onMouseLeave={e => e.currentTarget.style.background = TEAL}>
              {t('common.search')}
            </button>
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.75rem',
            color: 'var(--text-dim)' }}>
            Try: KA/BLR/2024/001 · KA/MYS/2024/047 · KA/TUK/2023/112
          </div>
        </div>

        {loading && (
          <div style={{ padding: '2rem 0' }}>
            <LoadingSkeleton variant="card" count={1} style={{ height: 200, marginBottom: 20, background: 'rgba(29,158,117,0.08)' }} />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem',
            border: '1px solid rgba(29,158,117,0.1)', borderRadius: 12,
            background: 'rgba(29,158,117,0.03)', animation: 'fadeInScale 0.4s ease-out' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'float 4s infinite ease-in-out' }}>🔍</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-citizen)', marginBottom: '0.5rem',
              fontWeight: 500 }}>{t('common.noResults')}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)',
              lineHeight: 1.6 }}>
              We could not find a prisoner matching "{query}".<br />
              Please check the ID or name and try again. If the issue persists,<br />
              contact your nearest DLSA helpline:{' '}
              <strong style={{ color: TEAL }}>15100</strong>
            </div>
          </div>
        )}

        {!loading && results.length > 1 && !selected && (
          <div className="stagger-children">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)',
              marginBottom: '1.2rem', fontWeight: 500 }}>
              Found {results.length} results — select one to view details:
            </div>
            {results.map((p, i) => (
              <div key={i} onClick={() => setSelected(p)}
                className="glass-card"
                style={{ display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '1.2rem 1.5rem',
                  background: 'rgba(29,158,117,0.05)',
                  border: '1px solid rgba(29,158,117,0.15)', borderRadius: 10,
                  marginBottom: '0.8rem', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(29,158,117,0.1)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(29,158,117,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(29,158,117,0.05)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem',
                    color: 'var(--text-citizen)' }}>{p.name || p.prisoner_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)',
                    marginTop: 4 }}>
                    {p.prisoner_id} · {p.district}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: TEAL, fontWeight: 500, padding: '6px 12px', background: 'rgba(29,158,117,0.1)', borderRadius: 20 }}>View details →</div>
              </div>
            ))}
          </div>
        )}

        {!loading && selected && (
          <div style={{ animation: 'fadeInScale 0.5s ease-out' }}>
            <PrisonerCard prisoner={selected} isMobile={isMobile} />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function PrisonerCard({ prisoner: p, isMobile }) {
  const { t } = useTranslation();
  const rawDays = p.days_in_custody || getDaysInCustody(p.arrest_date);
  const rawStatus = p.alert_status || getAlertStatus(rawDays, p.ipc_sections || '');

  const alertColors = {
    red: { bg: 'rgba(226,75,74,0.08)', border: 'rgba(226,75,74,0.3)',
      text: '#f09595', label: 'OVERDUE — Exceeds Legal Detention Limit', pulse: true },
    orange: { bg: 'rgba(239,159,39,0.08)', border: 'rgba(239,159,39,0.3)',
      text: '#fac775', label: 'APPROACHING LIMIT — Review Bail Status', pulse: false },
    yellow: { bg: 'rgba(239,159,39,0.08)', border: 'rgba(239,159,39,0.3)',
      text: '#fac775', label: 'APPROACHING LIMIT — Review Bail Status', pulse: false },
    green: { bg: 'rgba(29,158,117,0.08)', border: 'rgba(29,158,117,0.3)',
      text: '#1d9e75', label: 'Within Legal Detention Period', pulse: false },
  };
  const ac = alertColors[rawStatus] || alertColors.green;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN',
    { day: 'numeric', month: 'short', year: 'numeric' });

  const daysUntilHearing = () => {
    const nextDate = p.next_hearing_date || p.next_hearing;
    if (!nextDate) return '—';
    const next = new Date(nextDate);
    const today = new Date();
    return Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  };

  const name = p.name || p.prisoner_name || 'Unknown';
  const lawyerName = p.lawyer || p.lawyer_assigned || 'Not assigned';
  const lawyerPhone = p.lawyer_phone || null;
  const nextHearing = p.next_hearing_date || p.next_hearing || null;
  const hearings = p.hearings || [];

  return (
    <div>
      <div style={{ padding: '1rem 1.4rem', background: ac.bg,
        border: `1px solid ${ac.border}`, borderRadius: 10,
        marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: ac.pulse ? '0 0 20px rgba(226,75,74,0.15)' : 'none',
        animation: ac.pulse ? 'pulseGlow 2s infinite' : 'none' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%',
          background: ac.text, flexShrink: 0,
          boxShadow: `0 0 10px ${ac.text}` }} />
        <span style={{ fontSize: '0.82rem', color: ac.text,
          fontWeight: 600, letterSpacing: '0.5px' }}>{ac.label}</span>
      </div>

      <div style={{ background: 'rgba(29,158,117,0.03)',
        border: '1px solid rgba(29,158,117,0.15)', borderRadius: 16,
        overflow: 'hidden', marginBottom: '2rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>

        <div style={{ padding: '1.8rem',
          borderBottom: '1px solid rgba(29,158,117,0.1)',
          background: 'var(--bg-card)',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: 14,
              background: 'rgba(29,158,117,0.1)',
              border: '1px solid rgba(29,158,117,0.2)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '2rem',
              boxShadow: 'inset 0 0 20px rgba(29,158,117,0.05)' }}>👤</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: '1.8rem', fontWeight: 700,
                color: 'var(--text-citizen)', lineHeight: 1, marginBottom: 6 }}>{name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Age {p.age || '—'} · {p.prisoner_id}
              </div>
            </div>
          </div>
          <div style={{ textAlign: isMobile ? 'left' : 'right',
            background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 12, border: 'var(--border-card)' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: 2,
              textTransform: 'uppercase', color: 'var(--text-muted)',
              marginBottom: 4 }}>{t('statusTracker.daysInCustody')}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif",
              fontSize: '2.5rem', fontWeight: 700, color: ac.text, lineHeight: 1 }}>
              {rawDays}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              since {formatDate(p.arrest_date)}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
          {[
            { label: t('statusTracker.court'), value: p.prison || p.prison_location },
            { label: t('statusTracker.court'), value: p.court },
            { label: t('statusTracker.charges'), value: p.charges },
            { label: 'IPC Sections', value: p.ipc_sections },
            { label: t('statusTracker.lawyer'), value: lawyerName,
              sub: lawyerPhone ? `📞 ${lawyerPhone}` : null,
              highlight: lawyerName === 'Not assigned yet' || lawyerName === 'Not assigned' },
            { label: 'Presiding Judge', value: p.judge || '—' },
            { label: 'Case Number', value: p.case_number || p.prisoner_id },
            { label: t('statusTracker.status'), value: p.case_status },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.2rem 1.8rem',
              borderBottom: '1px solid rgba(29,158,117,0.07)',
              borderRight: isMobile ? 'none' : (i % 2 === 0 ? '1px solid rgba(29,158,117,0.07)' : 'none'),
              transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                marginBottom: '0.4rem' }}>{item.label}</div>
              <div style={{ fontSize: '0.9rem',
                color: item.highlight ? '#f09595' : 'var(--text-citizen)',
                fontWeight: item.highlight ? 500 : 400 }}>{item.value || '—'}</div>
              {item.sub && (
                <div style={{ fontSize: '0.75rem', color: 'rgba(29,158,117,0.8)',
                  marginTop: 4 }}>{item.sub}</div>
              )}
            </div>
          ))}
        </div>

        {nextHearing && (
          <div style={{ padding: '1.5rem 1.8rem',
            background: 'rgba(29,158,117,0.08)',
            borderTop: '1px solid rgba(29,158,117,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                marginBottom: '0.4rem' }}>{t('statusTracker.nextHearing')}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600,
                color: 'var(--text-citizen)' }}>{formatDate(nextHearing)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                marginBottom: '0.4rem' }}>{t('courtCalendar.daysUntil')}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: '2rem', fontWeight: 700, color: '#d4a843' }}>
                {daysUntilHearing()}
              </div>
            </div>
          </div>
        )}
      </div>

      {hearings.length > 0 && (
        <div style={{ background: 'var(--bg-card)',
          border: '1px solid rgba(29,158,117,0.15)', borderRadius: 16,
          padding: '1.8rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-citizen)',
            marginBottom: '1.8rem' }}>{t('statusTracker.hearingHistory')}</div>
          <div className="stagger-children" style={{ position: 'relative', paddingLeft: '1.8rem' }}>
            <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0,
              width: 2, background: 'rgba(29,158,117,0.15)' }} />
            {hearings.map((h, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '1.5rem',
                animation: 'slideInLeft 0.5s ease-out forwards', animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <div style={{ position: 'absolute', left: '-1.8rem', top: 4,
                  width: 14, height: 14, borderRadius: '50%',
                  background: i === hearings.length - 1
                    ? '#1d9e75' : 'rgba(29,158,117,0.25)',
                  border: '2px solid var(--bg-citizen)', zIndex: 1,
                  boxShadow: i === hearings.length - 1 ? '0 0 10px rgba(29,158,117,0.5)' : 'none' }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)',
                  marginBottom: '0.3rem', letterSpacing: '0.5px' }}>
                  {new Date(h.hearing_date || h.date).toLocaleDateString('en-IN',
                    { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-citizen)',
                  marginBottom: '0.3rem', fontWeight: 500 }}>{h.outcome}</div>
                {h.delay_reason && h.delay_reason !== 'None' && (
                  <div style={{ fontSize: '0.78rem',
                    color: 'rgba(239,159,39,0.8)',
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(239,159,39,0.08)', padding: '4px 10px', borderRadius: 4, width: 'fit-content' }}>
                    ⚠ Delayed — {h.delay_reason}
                  </div>
                )}
              </div>
            ))}
            {nextHearing && (
              <div style={{ position: 'relative', marginBottom: '0.5rem',
                animation: 'slideInLeft 0.5s ease-out forwards', animationDelay: `${hearings.length * 0.1}s`, opacity: 0 }}>
                <div style={{ position: 'absolute', left: '-1.8rem', top: 4,
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid #1d9e75', background: 'transparent', zIndex: 1,
                  animation: 'pulseGlowGreen 2s infinite' }} />
                <div style={{ fontSize: '0.75rem', color: 'rgba(29,158,117,0.8)',
                  marginBottom: '0.3rem', letterSpacing: '0.5px', fontWeight: 600 }}>
                  UPCOMING — {new Date(nextHearing).toLocaleDateString('en-IN',
                    { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)',
                  fontStyle: 'italic' }}>{t('statusTracker.nextHearing')}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '1.2rem 1.6rem',
        background: 'rgba(29,158,117,0.06)',
        border: '1px solid rgba(29,158,117,0.15)', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Need a lawyer? Call NALSA Legal Aid Helpline free
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif",
          fontSize: '1.5rem', fontWeight: 700, color: '#1d9e75' }}>15100</div>
      </div>
    </div>
  );
}