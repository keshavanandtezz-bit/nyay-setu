import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { legalAidData } from '../../data/legalAid';
import { legalAPI } from '../../services/api';

const TEAL = '#1d9e75';

export default function LegalAidFinder() {
  const { t } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredTag, setHoveredTag] = useState(null);
  const [providers, setProviders] = useState(null);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Derive result: prefer API providers, fall back to local data
  const result = providers ?? legalAidData.find(d => d.district === selectedDistrict);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!selectedDistrict) { setProviders(null); return; }
    setLoadingProviders(true);
    legalAPI.getLegalAid(selectedDistrict)
      .then(data => {
        if (data && data.providers && data.providers.length > 0) {
          setProviders(data.providers[0]); // API returns array; use first match
        } else {
          setProviders(null); // fall back to local
        }
      })
      .catch(() => setProviders(null))
      .finally(() => setLoadingProviders(false));
  }, [selectedDistrict]);

  return (
    <PageWrapper style={{ minHeight: '100vh', background: 'var(--bg-citizen)', color: 'var(--text-citizen)' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 2.5rem' }}>
        {/* ── Header ── */}
        <div className="reveal-on-scroll">
          <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(29,158,117,0.7)', marginBottom: '0.3rem' }}>Karnataka DLSA</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
            fontWeight: 700, marginBottom: '0.4rem',
            background: 'linear-gradient(135deg, #d8ede6 0%, #1d9e75 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{t('legalAid.title')}</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300,
            marginBottom: '2rem', lineHeight: 1.6 }}>
            {t('legalAid.subtitle')}
          </p>
        </div>

        {/* ── Helpline Banner ── */}
        <div className="reveal-on-scroll" style={{
          padding: '1rem 1.4rem', background: 'rgba(29,158,117,0.07)',
          border: '1px solid rgba(29,158,117,0.2)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.5rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: 1, textTransform: 'uppercase',
              color: 'rgba(29,158,117,0.6)', marginBottom: 3 }}>National Legal Aid Helpline</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Call from anywhere in India — free legal advice in your language
            </div>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
            fontWeight: 700, color: TEAL }}>15100</div>
        </div>

        {/* ── District Select ── */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase',
            color: 'rgba(29,158,117,0.6)', marginBottom: '0.6rem' }}>{t('legalAid.searchDistrict')}</div>
          <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1.2rem',
              background: 'rgba(29,158,117,0.06)',
              border: '1px solid rgba(29,158,117,0.22)', borderRadius: 10,
              color: selectedDistrict ? 'var(--text-citizen)' : 'var(--text-muted)',
              fontSize: '0.9rem', fontFamily: "'Outfit',sans-serif",
              outline: 'none', cursor: 'pointer',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(29,158,117,0.6)';
              e.target.style.boxShadow = '0 0 0 3px rgba(29,158,117,0.18), 0 0 20px rgba(29,158,117,0.10)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(29,158,117,0.22)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">— Choose a district —</option>
            {legalAidData.map((d, i) => (
              <option key={i} value={d.district} style={{ background: 'var(--bg-input)' }}>{d.district}</option>
            ))}
          </select>
        </div>

        {/* ── Result Card ── */}
        {loadingProviders && (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            ⏳ Loading providers…
          </div>
        )}

        {!loadingProviders && result && (
          <div className="glass-card reveal-on-scroll" style={{
            background: 'rgba(29,158,117,0.04)',
            border: '1px solid rgba(29,158,117,0.18)', borderRadius: 14, overflow: 'hidden',
            transition: 'transform 0.35s ease, box-shadow 0.35s ease',
          }}>
            <div style={{ padding: '1.4rem 1.8rem', borderBottom: '1px solid rgba(29,158,117,0.1)',
              background: 'rgba(29,158,117,0.07)' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem',
                fontWeight: 700, color: 'var(--text-citizen)', marginBottom: '0.2rem' }}>{result.dlsa_name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Secretary: {result.secretary}
              </div>
            </div>

            {/* Responsive grid: 2-col on desktop, 1-col on mobile */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              padding: 0,
            }}>
              {[
                { icon: '📍', label: t('legalAid.address'), value: result.address },
                { icon: '🕐', label: 'Office Hours', value: result.timings },
                { icon: '📞', label: t('legalAid.phone'), value: result.phone },
                { icon: '📧', label: 'Email', value: result.email },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1rem 1.8rem',
                  borderBottom: '1px solid rgba(29,158,117,0.07)',
                  borderRight: (!isMobile && i % 2 === 0) ? '1px solid rgba(29,158,117,0.07)' : 'none',
                }}>
                  <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    marginBottom: '0.3rem' }}>{item.icon} {item.label}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-citizen)', lineHeight: 1.5 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Services with hover tags */}
            <div style={{ padding: '1.2rem 1.8rem', borderTop: '1px solid rgba(29,158,117,0.07)' }}>
              <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                marginBottom: '0.8rem' }}>{t('legalAid.services')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.services.map((s, i) => (
                  <span key={i}
                    onMouseEnter={() => setHoveredTag(i)}
                    onMouseLeave={() => setHoveredTag(null)}
                    style={{
                      fontSize: '0.78rem', padding: '4px 12px',
                      background: hoveredTag === i
                        ? 'rgba(29,158,117,0.25)'
                        : 'rgba(29,158,117,0.1)',
                      border: hoveredTag === i
                        ? '1px solid rgba(29,158,117,0.5)'
                        : '1px solid rgba(29,158,117,0.2)',
                      borderRadius: 20,
                      color: hoveredTag === i ? 'var(--text-citizen)' : 'rgba(216,237,230,0.7)',
                      cursor: 'default',
                      transition: 'all 0.25s ease',
                      transform: hoveredTag === i ? 'translateY(-1px)' : 'none',
                    }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem 1.8rem', background: 'rgba(29,158,117,0.06)',
              borderTop: '1px solid rgba(29,158,117,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                National Toll-Free Legal Aid Helpline
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: '1.5rem', fontWeight: 700, color: TEAL }}>15100</div>
            </div>
          </div>
        )}

        {/* ── Eligibility Section ── */}
        <div className="reveal-on-scroll" style={{ marginTop: '1.5rem', padding: '1.2rem 1.8rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-citizen)',
            marginBottom: '0.8rem' }}>Who is eligible for free legal aid?</div>
          <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              'Annual income below ₹1 lakh (₹2 lakh in some states)',
              'SC/ST community members',
              'Women and children in any case',
              'Victims of trafficking or natural disaster',
              'Persons with disabilities',
              'Industrial workmen',
              'Persons in custody (undertrials)',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8,
                fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%',
                  background: TEAL, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}