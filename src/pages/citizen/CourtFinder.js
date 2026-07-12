import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { courtsAPI } from '../../services/api';

/* ── Constants ───────────────────────────────────────────────────────── */
const C = {
  bg: 'var(--bg-citizen)', text: 'var(--text-citizen)', sub: 'var(--text-muted)',
  green: '#1d9e75', greenLight: '#2ed89c',
  cardBg: 'rgba(29,158,117,0.05)', cardBorder: 'rgba(29,158,117,0.12)',
  cardHoverBg: 'rgba(29,158,117,0.1)', cardHoverBorder: 'rgba(29,158,117,0.25)',
  inputBg: 'rgba(29,158,117,0.06)', inputBorder: 'rgba(29,158,117,0.2)',
};

const COURT_TYPES = [
  { value: 'sessions', label: 'Sessions Court' },
  { value: 'district', label: 'District Court' },
  { value: 'magistrate', label: 'Magistrate Court' },
  { value: 'family', label: 'Family Court' },
  { value: 'consumer', label: 'Consumer Court' },
  { value: 'fast_track', label: 'Fast Track Court' },
  { value: 'labour', label: 'Labour Court' },
];

const DISTRICTS = [
  'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru',
  'Hubballi-Dharwad', 'Belagavi', 'Kalaburagi', 'Davanagere',
  'Ballari', 'Tumakuru', 'Shivamogga', 'Raichur',
];

const TYPE_COLORS = {
  sessions: '#e879f9', district: '#3b82f6', magistrate: '#f59e0b',
  family: '#f472b6', consumer: '#34d399', fast_track: '#fb923c', labour: '#60a5fa',
};

const selectStyle = {
  flex: 1, minWidth: 180, background: C.inputBg,
  border: `1px solid ${C.inputBorder}`, borderRadius: 8, outline: 'none',
  padding: '0.8rem 1rem', fontSize: '0.88rem', color: C.text,
  fontFamily: "'Outfit',sans-serif", appearance: 'none', cursor: 'pointer',
};

/* ── Component ──────────────────────────────────────────────────────── */
export default function CourtFinder() {
  const { t } = useTranslation();
  const [courtType, setCourtType] = useState('');
  const [district, setDistrict] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSearch() {
    if (!courtType && !district) return;
    setLoading(true);
    setError('');
    setResults(null);

    courtsAPI.findCourts(courtType, district)
      .then(data => {
        const list = Array.isArray(data) ? data : data?.courts || [];
        setResults(list);
      })
      .catch(err => setError(err.message || 'Search failed'))
      .finally(() => setLoading(false));
  }

  return (
    <PageWrapper style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 2rem 3rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
            color: C.green, marginBottom: '0.4rem',
          }}>Court Locator</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: '2.4rem',
            fontWeight: 700, color: C.text, margin: 0, lineHeight: 1.1,
          }}>{t('courtFinder.title')}</h1>
          <p style={{
            fontSize: '0.88rem', color: C.sub, fontWeight: 300,
            maxWidth: 480, lineHeight: 1.6, margin: '0.5rem 0 0',
          }}>
            {t('courtFinder.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: '0.8rem', flexWrap: 'wrap',
          marginBottom: '1.5rem', alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{
              display: 'block', fontSize: '0.7rem', letterSpacing: 1,
              textTransform: 'uppercase', color: 'rgba(29,158,117,0.7)',
              marginBottom: 6,
            }}>{t('courtFinder.caseType')}</label>
            <select value={courtType} onChange={e => setCourtType(e.target.value)} style={selectStyle}>
              <option value="">All Types</option>
              {COURT_TYPES.map(ct => <option key={ct.value} value={ct.value}>{ct.label}</option>)}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{
              display: 'block', fontSize: '0.7rem', letterSpacing: 1,
              textTransform: 'uppercase', color: 'rgba(29,158,117,0.7)',
              marginBottom: 6,
            }}>{t('courtFinder.district')}</label>
            <select value={district} onChange={e => setDistrict(e.target.value)} style={selectStyle}>
              <option value="">All Districts</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || (!courtType && !district)}
            style={{
              padding: '0.8rem 2rem', background: C.green, border: 'none',
              borderRadius: 8, color: '#fff', fontSize: '0.88rem', fontWeight: 600,
              fontFamily: "'Outfit',sans-serif",
              cursor: loading ? 'wait' : (!courtType && !district) ? 'not-allowed' : 'pointer',
              opacity: loading || (!courtType && !district) ? 0.5 : 1,
              transition: 'all 0.2s', height: 'fit-content',
            }}
          >
            {loading ? `${t('common.loading')}…` : `🔍 ${t('courtFinder.findCourts')}`}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, padding: '0.7rem 1rem', fontSize: '0.82rem', color: '#f87171',
            marginBottom: '1rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <>
            <div style={{
              fontSize: '0.72rem', letterSpacing: 1.5, textTransform: 'uppercase',
              color: C.green, marginBottom: '0.8rem',
            }}>
              {results.length} court{results.length !== 1 ? 's' : ''} found
            </div>

            {results.length === 0 && (
              <div style={{
                background: C.cardBg, border: `1px solid ${C.cardBorder}`,
                borderRadius: 12, padding: '2.5rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🏛️</div>
                <div style={{ fontSize: '0.95rem', color: C.text, marginBottom: '0.3rem' }}>
                  {t('common.noResults')}
                </div>
                <div style={{ fontSize: '0.82rem', color: C.sub }}>
                  Try changing your filters or select "All" for broader results.
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
              {results.map((court, i) => {
                const typeColor = TYPE_COLORS[court.type] || C.greenLight;
                return (
                  <div
                    key={i}
                    style={{
                      background: C.cardBg, border: `1px solid ${C.cardBorder}`,
                      borderRadius: 12, padding: '1.4rem',
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = C.cardHoverBg;
                      e.currentTarget.style.borderColor = C.cardHoverBorder;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = C.cardBg;
                      e.currentTarget.style.borderColor = C.cardBorder;
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {/* Header row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: '0.8rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '1rem', fontWeight: 600, color: C.text,
                          lineHeight: 1.3, marginBottom: 4,
                        }}>
                          {court.name || 'Court'}
                        </div>
                      </div>
                      {/* Type badge */}
                      <span style={{
                        fontSize: '0.6rem', letterSpacing: 1, textTransform: 'uppercase',
                        padding: '3px 10px', borderRadius: 10, fontWeight: 600, flexShrink: 0,
                        background: `${typeColor}18`, color: typeColor,
                        border: `1px solid ${typeColor}35`,
                      }}>
                        {COURT_TYPES.find(ct => ct.value === court.type)?.label || court.type || 'Court'}
                      </span>
                    </div>

                    {/* Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {court.presiding_judge && (
                        <DetailRow icon="👤" label={t('courtFinder.presidingJudge')} value={court.presiding_judge} />
                      )}
                      {court.address && (
                        <DetailRow icon="📍" label="Address" value={court.address} />
                      )}
                      {court.timings && (
                        <DetailRow icon="🕐" label={t('courtFinder.timings')} value={court.timings} />
                      )}
                      {court.avg_disposal_days != null && (
                        <DetailRow
                          icon="📊"
                          label={t('courtFinder.avgDisposal')}
                          value={`${court.avg_disposal_days} ${t('courtFinder.days')}`}
                          accent={court.avg_disposal_days <= 90 ? '#34d399' : court.avg_disposal_days <= 180 ? '#f59e0b' : '#ef4444'}
                        />
                      )}
                      {court.jurisdiction && (
                        <DetailRow icon="🗺️" label={t('courtFinder.jurisdiction')} value={court.jurisdiction} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Idle state */}
        {!results && !loading && !error && (
          <div style={{
            background: C.cardBg, border: `1px solid ${C.cardBorder}`,
            borderRadius: 14, padding: '3rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏛️</div>
            <div style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem',
              fontWeight: 700, color: C.text, marginBottom: '0.3rem',
            }}>Select filters to search</div>
            <div style={{ fontSize: '0.85rem', color: C.sub }}>
              Choose a court type and/or district to find courts in Karnataka.
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

/* ── Helper ──────────────────────────────────────────────────────────── */
function DetailRow({ icon, label, value, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.82rem' }}>
      <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>{icon}</span>
      <div>
        <span style={{ color: 'var(--text-muted)', marginRight: 4 }}>{label}:</span>
        <span style={{ color: accent || 'var(--text-citizen)', fontWeight: accent ? 600 : 400 }}>{value}</span>
      </div>
    </div>
  );
}
