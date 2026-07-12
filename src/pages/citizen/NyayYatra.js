import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { caseAPI } from '../../services/api';

/* ── Constants ───────────────────────────────────────────────────────── */
const C = {
  bg: 'var(--bg-citizen)',
  text: 'var(--text-citizen)',
  sub: 'var(--text-muted)',
  green: '#1d9e75',
  greenLight: '#2ed89c',
  greenGlow: 'rgba(29,158,117,0.35)',
  cardBg: 'rgba(29,158,117,0.05)',
  cardBorder: 'rgba(29,158,117,0.12)',
  cardHoverBg: 'rgba(29,158,117,0.1)',
  cardHoverBorder: 'rgba(29,158,117,0.25)',
};

/* ── Component ──────────────────────────────────────────────────────── */
export default function NyayYatra() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const searchRef = useRef(null);

  const STAGE_LABELS = {
    complaint_filed: t('nyayYatra.stages.complaint_filed'),
    fir_registered: t('nyayYatra.stages.fir_registered'),
    investigation: t('nyayYatra.stages.investigation'),
    chargesheet_filed: t('nyayYatra.stages.chargesheet_filed'),
    court_hearing: t('nyayYatra.stages.court_hearing'),
    judgment: t('nyayYatra.stages.judgment'),
    appeal: t('nyayYatra.stages.appeal'),
    closed: t('nyayYatra.stages.closed'),
  };

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  /* Fetch analytics on mount */
  useEffect(() => {
    caseAPI.getAnalytics()
      .then(data => setAnalytics(data))
      .catch(() => setAnalytics(null))
      .finally(() => setAnalyticsLoading(false));
  }, []);

  /* Search handler */
  function handleSearch(e) {
    if (e.key && e.key !== 'Enter') return;
    const val = searchRef.current?.value?.trim();
    if (!val) return;
    setSearchLoading(true);
    setSearchError('');
    setSearchResults(null);

    // Detect phone vs name
    const isPhone = /^\d{10}$/.test(val);
    const promise = isPhone
      ? caseAPI.searchCases(val, '')
      : caseAPI.searchCases('', val);

    promise
      .then(data => {
        const list = Array.isArray(data) ? data : data?.cases || [];
        setSearchResults(list);
      })
      .catch(err => setSearchError(err.message || 'Search failed'))
      .finally(() => setSearchLoading(false));
  }

  /* ── Stat card helper ─────────────────────────────────────────────── */
  function StatCard({ label, value, icon, accent }) {
    return (
      <div style={{
        background: C.cardBg, border: `1px solid ${C.cardBorder}`,
        borderRadius: 12, padding: '1.2rem 1.4rem', flex: 1, minWidth: 140,
        transition: 'all 0.25s',
      }}>
        <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>{icon}</div>
        <div style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: '1.9rem',
          fontWeight: 700, color: accent || C.greenLight, lineHeight: 1,
        }}>
          {value ?? '—'}
        </div>
        <div style={{
          fontSize: '0.72rem', letterSpacing: 1, textTransform: 'uppercase',
          color: C.sub, marginTop: 6,
        }}>
          {label}
        </div>
      </div>
    );
  }

  /* ── Render ────────────────────────────────────────────────────────── */
  return (
    <PageWrapper style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <Navbar theme="green" showBack={true} />

      {/* Hero */}
      <div style={{ padding: '2.5rem 2.5rem 1rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{
          fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
          color: C.green, marginBottom: '0.5rem',
        }}>
          Case Resolution Portal
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: '2.8rem',
          fontWeight: 700, color: C.text, lineHeight: 1.1, margin: 0, marginBottom: '0.5rem',
        }}>
          {t('nyayYatra.title')}
        </h1>
        <p style={{
          fontSize: '0.95rem', color: C.sub, fontWeight: 300,
          maxWidth: 520, lineHeight: 1.6, margin: 0,
        }}>
          {t('nyayYatra.subtitle')}
        </p>
      </div>

      {/* Action cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem',
        padding: '1.5rem 2.5rem', maxWidth: 1000, margin: '0 auto',
      }}>
        {/* File New Complaint */}
        <div
          onClick={() => navigate('/citizen/file-complaint')}
          style={{
            background: 'linear-gradient(135deg, rgba(29,158,117,0.12) 0%, rgba(46,216,156,0.06) 100%)',
            border: `1px solid ${C.cardBorder}`, borderRadius: 14,
            padding: '2rem 1.8rem', cursor: 'pointer',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(29,158,117,0.18) 0%, rgba(46,216,156,0.1) 100%)';
            e.currentTarget.style.borderColor = C.cardHoverBorder;
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = `0 8px 30px ${C.greenGlow}`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(29,158,117,0.12) 0%, rgba(46,216,156,0.06) 100%)';
            e.currentTarget.style.borderColor = C.cardBorder;
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>✏️</div>
          <div style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: '1.45rem',
            fontWeight: 700, color: C.text, marginBottom: '0.4rem',
          }}>{t('nyayYatra.fileNew')}</div>
          <div style={{ fontSize: '0.82rem', color: C.sub, lineHeight: 1.5 }}>
            AI-guided 5-step wizard. Get IPC section suggestions and a legal summary automatically.
          </div>
          <div style={{
            marginTop: '1rem', fontSize: '0.7rem', letterSpacing: 1.5,
            textTransform: 'uppercase', color: C.green,
          }}>Begin Filing →</div>
        </div>

        {/* Track Existing Case */}
        <div style={{
          background: C.cardBg, border: `1px solid ${C.cardBorder}`,
          borderRadius: 14, padding: '2rem 1.8rem',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>🔍</div>
          <div style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: '1.45rem',
            fontWeight: 700, color: C.text, marginBottom: '0.4rem',
          }}>{t('nyayYatra.trackExisting')}</div>
          <div style={{ fontSize: '0.82rem', color: C.sub, lineHeight: 1.5, marginBottom: '1rem' }}>
            Enter your phone number or name to find your case and view its journey.
          </div>
          <div style={{
            display: 'flex', background: 'rgba(29,158,117,0.06)',
            border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8, overflow: 'hidden',
          }}>
            <input
              ref={searchRef}
              type="text"
              onKeyDown={handleSearch}
              placeholder={t('nyayYatra.searchByPhone')}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '0.75rem 1rem', fontSize: '0.85rem', color: C.text,
                fontFamily: "'Outfit',sans-serif",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              style={{
                padding: '0.75rem 1.4rem', background: C.green, border: 'none',
                color: '#fff', fontFamily: "'Outfit',sans-serif", fontSize: '0.82rem',
                fontWeight: 500, cursor: searchLoading ? 'wait' : 'pointer',
                opacity: searchLoading ? 0.7 : 1,
              }}
            >
              {searchLoading ? '...' : t('common.search')}
            </button>
          </div>
        </div>
      </div>

      {/* Search error */}
      {searchError && (
        <div style={{
          padding: '0 2.5rem', maxWidth: 1000, margin: '0.5rem auto 0',
        }}>
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, padding: '0.7rem 1rem', fontSize: '0.82rem', color: '#f87171',
          }}>
            ⚠️ {searchError}
          </div>
        </div>
      )}

      {/* Search results */}
      {searchResults && (
        <div style={{ padding: '1rem 2.5rem', maxWidth: 1000, margin: '0 auto' }}>
          <div style={{
            fontSize: '0.72rem', letterSpacing: 1.5, textTransform: 'uppercase',
            color: C.green, marginBottom: '0.8rem',
          }}>
            {searchResults.length} case{searchResults.length !== 1 ? 's' : ''} found
          </div>

          {searchResults.length === 0 && (
            <div style={{
              background: C.cardBg, border: `1px solid ${C.cardBorder}`,
              borderRadius: 10, padding: '1.5rem', textAlign: 'center',
              fontSize: '0.88rem', color: C.sub,
            }}>
              {t('common.noResults')}
            </div>
          )}

          {searchResults.map((c, i) => (
            <div
              key={i}
              onClick={() => navigate(`/citizen/case/${c.case_id}`)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: C.cardBg, border: `1px solid ${C.cardBorder}`,
                borderRadius: 10, padding: '1rem 1.3rem', marginBottom: '0.6rem',
                cursor: 'pointer', transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.cardHoverBg;
                e.currentTarget.style.borderColor = C.cardHoverBorder;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.cardBg;
                e.currentTarget.style.borderColor = C.cardBorder;
              }}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: C.text }}>
                  {c.case_id}
                </div>
                <div style={{ fontSize: '0.75rem', color: C.sub, marginTop: 2 }}>
                  {c.complainant_name || 'Unknown complainant'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: 10,
                  background: 'rgba(29,158,117,0.12)', color: C.green,
                  fontWeight: 600,
                }}>
                  {STAGE_LABELS[c.current_stage] || c.current_stage || 'Filed'}
                </span>
                {c.created_at && (
                  <div style={{ fontSize: '0.7rem', color: C.sub, marginTop: 4 }}>
                    {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics */}
      <div style={{ padding: '1.5rem 2.5rem 2.5rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{
          fontSize: '0.72rem', letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'rgba(29,158,117,0.6)', marginBottom: '0.8rem',
        }}>
          Platform Analytics
        </div>

        {analyticsLoading ? (
          <div style={{
            textAlign: 'center', padding: '2rem', fontSize: '0.85rem', color: C.sub,
          }}>
            {t('common.loading')}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <StatCard
              icon="📊" label={t('nyayYatra.totalCases')}
              value={analytics?.total_cases ?? '—'}
              accent={C.greenLight}
            />
            <StatCard
              icon="✅" label={t('nyayYatra.resolved')}
              value={analytics?.resolved ?? '—'}
              accent="#38e8a8"
            />
            <StatCard
              icon="⏳" label={t('nyayYatra.inProgress')}
              value={analytics?.in_progress ?? '—'}
              accent="#3b82f6"
            />
            <StatCard
              icon="📈" label={t('nyayYatra.resolutionRate')}
              value={analytics?.resolution_rate != null ? `${analytics.resolution_rate}%` : '—'}
              accent="#d4a843"
            />
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{
        display: 'flex', gap: '0.8rem', padding: '0 2.5rem 2.5rem',
        maxWidth: 1000, margin: '0 auto',
      }}>
        <button
          onClick={() => navigate('/citizen/courts')}
          style={{
            padding: '0.7rem 1.4rem', background: 'transparent',
            border: `1px solid ${C.cardBorder}`, borderRadius: 8,
            color: C.text, fontSize: '0.82rem', cursor: 'pointer',
            fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.cardHoverBorder; e.currentTarget.style.background = C.cardBg; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.background = 'transparent'; }}
        >
          🏛️ Find Courts
        </button>
        <button
          onClick={() => navigate('/citizen/rights')}
          style={{
            padding: '0.7rem 1.4rem', background: 'transparent',
            border: `1px solid ${C.cardBorder}`, borderRadius: 8,
            color: C.text, fontSize: '0.82rem', cursor: 'pointer',
            fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.cardHoverBorder; e.currentTarget.style.background = C.cardBg; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.background = 'transparent'; }}
        >
          🤖 Know Your Rights
        </button>
      </div>
    </PageWrapper>
  );
}
