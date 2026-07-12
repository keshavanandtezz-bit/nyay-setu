import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { undertrials, getDaysInCustody, getAlertStatus, getBailScore } from '../../data/undertrials';
import { legalAPI } from '../../services/api';

const GOLD = '#d4a843';

// STATUS_CONFIG moved inside component

const DISTRICTS = [...new Set(undertrials.map(u => u.district))];

/* ---------- Count-up animation (mirrors LegalHome) ---------- */
function CountUp({ end, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) { setCount(0); return; }
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{Math.floor(count).toLocaleString('en-IN')}</span>;
}

export default function UndertrialAlerts() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const STATUS_CONFIG = {
    red: { bg: 'rgba(226,75,74,0.1)', border: 'rgba(226,75,74,0.3)',
      text: '#f09595', dot: '#e24b4a', label: t('legal.overdue') },
    yellow: { bg: 'rgba(239,159,39,0.08)', border: 'rgba(239,159,39,0.25)',
      text: '#fac775', dot: '#ef9f27', label: t('legal.approaching') },
    green: { bg: 'rgba(29,158,117,0.08)', border: 'rgba(29,158,117,0.2)',
      text: '#1d9e75', dot: '#1d9e75', label: 'Within Limit' },
  };
  const [filter, setFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState('days_desc');
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState([]);
  const [liveCounts, setLiveCounts] = useState({ total: 0, red: 0, yellow: 0, green: 0 });
  const [apiError, setApiError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredBailBtn, setHoveredBailBtn] = useState(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    setLoading(true);
    legalAPI.getUndertrials(filter, districtFilter)
      .then(data => {
        if (data.success) {
          setLiveData(data.undertrials || []);
          setLiveCounts(data.counts || { total: 0, red: 0, yellow: 0, green: 0 });
        }
      })
      .catch(err => {
        setApiError('Using offline data — ' + err.message);
      })
      .finally(() => setLoading(false));
  }, [filter, districtFilter]);

  const processed = useMemo(() => {
    return undertrials.map(u => ({
      ...u,
      days_in_custody: getDaysInCustody(u.arrest_date),
      alert_status: getAlertStatus(getDaysInCustody(u.arrest_date)),
      bail_score: getBailScore(u),
    }));
  }, []);

  const activeData = liveData.length > 0 ? liveData : processed;

  const counts = liveData.length > 0 ? liveCounts : {
    total: processed.length,
    red: processed.filter(u => u.alert_status === 'red').length,
    yellow: processed.filter(u => u.alert_status === 'yellow').length,
    green: processed.filter(u => u.alert_status === 'green').length,
  };

  const filtered = useMemo(() => {
    let list = [...activeData];
    if (filter !== 'all') list = list.filter(u => u.alert_status === filter);
    if (districtFilter) list = list.filter(u => u.district === districtFilter);
    list.sort((a, b) => {
      const ad = a.days_in_custody || 0;
      const bd = b.days_in_custody || 0;
      const ab = a.bail_score || 0;
      const bb = b.bail_score || 0;
      if (sortBy === 'days_desc') return bd - ad;
      if (sortBy === 'days_asc') return ad - bd;
      if (sortBy === 'bail_desc') return bb - ab;
      return (a.name || '').localeCompare(b.name || '');
    });
    return list;
  }, [activeData, filter, districtFilter, sortBy]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN',
    { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <PageWrapper style={{ background: 'var(--bg-legal)', color: 'var(--text-legal)' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '1.5rem 1rem' : '2rem 2.5rem' }}>

        {/* ---- Header ---- */}
        <div className="reveal-on-scroll" style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: 2,
            textTransform: 'uppercase', color: 'rgba(212,168,67,0.6)',
            marginBottom: '0.4rem' }}>Legal Compliance Monitor</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? '1.7rem' : '2.2rem',
            fontWeight: 700, marginBottom: '0.3rem',
            background: `linear-gradient(135deg, #e8e0cc 0%, ${GOLD} 50%, #e8e0cc 100%)`,
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'rotateGradient 4s ease infinite',
          }}>
            {t('legal.undertrialAlerts')}
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            {t('legal.undertrialAlertsDesc')}
          </p>
        </div>

        {/* ---- Loading state (skeleton, no inline keyframes) ---- */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '1rem' }}>
              {[0,1,2,3].map(i => (
                <div key={i} className="skeleton" style={{ height: 80, borderRadius: 10 }} />
              ))}
            </div>
            {[0,1,2].map(i => (
              <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10 }} />
            ))}
          </div>
        )}

        {/* ---- API error banner ---- */}
        {apiError && (
          <div style={{ marginBottom: '1rem', padding: '0.6rem 1rem',
            background: 'rgba(239,159,39,0.07)',
            border: '1px solid rgba(239,159,39,0.2)',
            borderRadius: 8, fontSize: '0.75rem',
            color: 'rgba(239,159,39,0.7)' }}>
            ⚠ {apiError}
          </div>
        )}

        {!loading && (
          <>
            {/* ---- Stats cards with CountUp ---- */}
            <div className="reveal-on-scroll stagger-children" style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)',
              gap: '1rem', marginBottom: '1.5rem',
            }}>
              {[
                { label: t('legal.totalUndertrials'), value: counts.total, color: GOLD, filterVal: 'all' },
                { label: t('legal.overdue'), value: counts.red, color: '#e24b4a', filterVal: 'red' },
                { label: t('legal.approaching'), value: counts.yellow, color: '#ef9f27', filterVal: 'yellow' },
                { label: 'Within Legal Limit', value: counts.green, color: '#1d9e75', filterVal: 'green' },
              ].map((s, i) => (
                <div key={i} className="glass-card" onClick={() => setFilter(s.filterVal)}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    padding: '1rem', cursor: 'pointer',
                    borderColor: filter === s.filterVal ? s.color + '40' : undefined,
                    background: filter === s.filterVal || hoveredCard === i
                      ? 'rgba(255,255,255,0.05)' : undefined,
                    boxShadow: filter === s.filterVal
                      ? `0 0 20px ${s.color}15, inset 0 1px 0 ${s.color}20` : undefined,
                  }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '2rem', fontWeight: 600, color: s.color,
                    lineHeight: 1, marginBottom: '0.3rem',
                    animation: 'countFade 1s ease-out forwards',
                    animationDelay: `${i * 0.15}s`,
                  }}>
                    <CountUp end={s.value} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ---- Filters row ---- */}
            <div className="reveal-on-scroll" style={{ display: 'flex', gap: '0.7rem', marginBottom: '1.2rem',
              flexWrap: 'wrap', alignItems: 'center' }}>
              {['all', 'red', 'yellow', 'green'].map(f => {
                const labels = { all: 'All', red: '🔴 ' + t('legal.overdue'),
                  yellow: '🟡 ' + t('legal.approaching'), green: '🟢 Within Limit' };
                const isActive = filter === f;
                return (
                  <button key={f} onClick={() => setFilter(f)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,67,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = isActive ? 'rgba(212,168,67,0.15)' : 'transparent'}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.78rem',
                      fontFamily: "'Outfit',sans-serif", cursor: 'pointer',
                      borderRadius: 8, transition: 'all 0.25s ease',
                      background: isActive ? 'rgba(212,168,67,0.15)' : 'transparent',
                      border: `1px solid ${isActive
                        ? 'rgba(212,168,67,0.4)' : 'rgba(212,168,67,0.1)'}`,
                      color: isActive ? GOLD : 'var(--text-muted)' }}>
                    {labels[f]}
                  </button>
                );
              })}

              <select value={districtFilter}
                onChange={e => setDistrictFilter(e.target.value)}
                style={{ padding: '0.45rem 1rem',
                  background: 'rgba(212,168,67,0.04)',
                  border: '1px solid rgba(212,168,67,0.12)', borderRadius: 8,
                  color: districtFilter ? 'var(--text-legal)' : 'var(--text-muted)',
                  fontSize: '0.78rem', fontFamily: "'Outfit',sans-serif",
                  outline: 'none', cursor: 'pointer',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}>
                <option value="" style={{ background: '#1a1408' }}>All Districts</option>
                {DISTRICTS.map((d, i) => (
                  <option key={i} value={d} style={{ background: '#1a1408' }}>{d}</option>
                ))}
              </select>

              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding: '0.45rem 1rem',
                  background: 'rgba(212,168,67,0.04)',
                  border: '1px solid rgba(212,168,67,0.12)', borderRadius: 8,
                  color: 'var(--text-legal)', fontSize: '0.78rem',
                  fontFamily: "'Outfit',sans-serif",
                  outline: 'none', cursor: 'pointer', marginLeft: 'auto',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}>
                <option value="days_desc" style={{ background: '#1a1408' }}>Most Days First</option>
                <option value="days_asc" style={{ background: '#1a1408' }}>Least Days First</option>
                <option value="bail_desc" style={{ background: '#1a1408' }}>Highest Bail Score</option>
                <option value="name" style={{ background: '#1a1408' }}>Name A–Z</option>
              </select>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* ---- Table header (desktop only) ---- */}
            {!isMobile && (
              <div style={{ display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                padding: '0.5rem 1.2rem', marginBottom: '0.4rem' }}>
                {['Prisoner', 'District', t('statusTracker.daysInCustody'), t('statusTracker.status'), 'Bail Score', 'Action'].map((h, i) => (
                  <div key={i} style={{ fontSize: '0.62rem', letterSpacing: 1.5,
                    textTransform: 'uppercase', color: 'var(--text-dim)',
                    textAlign: i > 1 ? 'center' : 'left' }}>{h}</div>
                ))}
              </div>
            )}

            {/* ---- Data rows ---- */}
            <div className="reveal-on-scroll">
              {filtered.map((u) => {
                const alertStatus = u.alert_status || 'green';
                const sc = STATUS_CONFIG[alertStatus] || STATUS_CONFIG.green;
                const isExpanded = expanded === u.id;
                const days = u.days_in_custody || 0;
                const bailScore = u.bail_score || 0;
                const isHovered = hoveredRow === u.id;

                return (
                  <div key={u.id} style={{ marginBottom: '0.5rem',
                    border: `1px solid ${isExpanded ? sc.border : isHovered ? 'rgba(212,168,67,0.15)' : 'rgba(212,168,67,0.08)'}`,
                    borderRadius: 10, overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    background: isExpanded ? 'var(--bg-card)' : 'transparent',
                  }}>

                    {/* --- Desktop row --- */}
                    {!isMobile ? (
                      <div onClick={() => setExpanded(isExpanded ? null : u.id)}
                        onMouseEnter={() => setHoveredRow(u.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{ display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                          padding: '0.85rem 1.2rem', cursor: 'pointer',
                          background: isExpanded || isHovered ? 'var(--bg-card)' : 'transparent',
                          transition: 'background 0.25s ease' }}>

                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 500,
                            color: 'var(--text-legal)', marginBottom: 2 }}>{u.name}</div>
                          <div style={{ fontSize: '0.7rem',
                            color: 'var(--text-muted)' }}>{u.prisoner_id}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem',
                            color: 'var(--text-muted)' }}>{u.district}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center',
                          justifyContent: 'center' }}>
                          <span style={{ fontFamily: "'Cormorant Garamond',serif",
                            fontSize: '1.3rem', fontWeight: 600, color: sc.text }}>
                            {days}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center',
                          justifyContent: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5,
                            padding: '3px 10px', borderRadius: 20,
                            background: sc.bg, border: `1px solid ${sc.border}` }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%',
                              background: sc.dot }} />
                            <span style={{ fontSize: '0.65rem', color: sc.text,
                              fontWeight: 500 }}>{sc.label}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 500,
                            color: bailScore >= 60 ? '#1d9e75'
                              : bailScore >= 40 ? '#ef9f27' : '#e24b4a' }}>
                            {bailScore}/100
                          </div>
                          <div style={{ width: 60, height: 4,
                            background: 'var(--border-card)',
                            borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 2,
                              width: `${bailScore}%`,
                              transition: 'width 0.8s ease',
                              background: bailScore >= 60 ? '#1d9e75'
                                : bailScore >= 40 ? '#ef9f27' : '#e24b4a' }} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center',
                          justifyContent: 'center' }}>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              navigate(`/legal/bail?id=${u.id}`);
                            }}
                            onMouseEnter={() => setHoveredBtn(u.id)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={{ padding: '4px 12px', fontSize: '0.7rem',
                              background: hoveredBtn === u.id ? 'rgba(212,168,67,0.2)' : 'rgba(212,168,67,0.1)',
                              border: '1px solid rgba(212,168,67,0.25)',
                              borderRadius: 6, color: GOLD, cursor: 'pointer',
                              fontFamily: "'Outfit',sans-serif",
                              transition: 'all 0.25s ease', whiteSpace: 'nowrap' }}>
                            Bail App →
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* --- Mobile card layout --- */
                      <div onClick={() => setExpanded(isExpanded ? null : u.id)}
                        style={{ padding: '1rem', cursor: 'pointer',
                          background: isExpanded ? 'var(--bg-card)' : 'transparent',
                          transition: 'background 0.25s ease' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-legal)' }}>{u.name}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{u.prisoner_id} · {u.district}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5,
                            padding: '3px 10px', borderRadius: 20,
                            background: sc.bg, border: `1px solid ${sc.border}`, flexShrink: 0 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                            <span style={{ fontSize: '0.62rem', color: sc.text, fontWeight: 500 }}>{sc.label}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--text-dim)', marginBottom: 2 }}>Days</div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', fontWeight: 600, color: sc.text }}>{days}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--text-dim)', marginBottom: 2 }}>Bail Score</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ fontSize: '0.88rem', fontWeight: 500,
                                color: bailScore >= 60 ? '#1d9e75' : bailScore >= 40 ? '#ef9f27' : '#e24b4a' }}>
                                {bailScore}/100
                              </div>
                              <div style={{ flex: 1, height: 4, background: 'var(--border-card)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: 2, width: `${bailScore}%`, transition: 'width 0.8s ease',
                                  background: bailScore >= 60 ? '#1d9e75' : bailScore >= 40 ? '#ef9f27' : '#e24b4a' }} />
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); navigate(`/legal/bail?id=${u.id}`); }}
                            style={{ padding: '5px 10px', fontSize: '0.68rem',
                              background: 'rgba(212,168,67,0.1)',
                              border: '1px solid rgba(212,168,67,0.25)',
                              borderRadius: 6, color: GOLD, cursor: 'pointer',
                              fontFamily: "'Outfit',sans-serif",
                              transition: 'all 0.25s ease', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            Bail →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ---- Expanded detail panel ---- */}
                    {isExpanded && (
                      <div style={{ padding: '0 1.2rem 1.2rem',
                        borderTop: `1px solid ${sc.border}`,
                        background: 'var(--bg-card)',
                        animation: 'fadeInUp 0.35s ease-out forwards',
                      }}>
                        <div className="stagger-children" style={{ display: 'grid',
                          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                          gap: '0.8rem', paddingTop: '1rem' }}>
                          {[
                            { label: 'Arrest Date', value: formatDate(u.arrest_date) },
                            { label: 'Prison', value: u.prison },
                            { label: t('statusTracker.charges'), value: u.charges },
                            { label: 'IPC Sections', value: u.ipc_sections },
                            { label: t('statusTracker.lawyer'), value: u.lawyer, warn: !u.has_lawyer },
                            { label: t('statusTracker.court'), value: u.court },
                            { label: t('statusTracker.nextHearing'), value: formatDate(u.next_hearing) },
                            { label: 'Prior Record', value: u.prior_record ? 'Yes' : 'No',
                              warn: u.prior_record },
                          ].map((item, idx) => (
                            <div key={idx}>
                              <div style={{ fontSize: '0.6rem', letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                color: 'var(--text-dim)', marginBottom: 3 }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: '0.8rem',
                                color: item.warn ? '#f09595' : 'var(--text-muted)',
                                lineHeight: 1.4 }}>{item.value}</div>
                            </div>
                          ))}
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.7rem',
                          flexWrap: 'wrap', alignItems: 'center' }}>
                          <button onClick={() => navigate(`/legal/bail?id=${u.id}`)}
                            onMouseEnter={() => setHoveredBailBtn(u.id)}
                            onMouseLeave={() => setHoveredBailBtn(null)}
                            style={{ padding: '0.55rem 1.4rem',
                              background: hoveredBailBtn === u.id
                                ? `linear-gradient(135deg, ${GOLD}, #c4982f)` : GOLD,
                              border: 'none', borderRadius: 8,
                              color: '#0d0c08', fontFamily: "'Outfit',sans-serif",
                              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              transform: hoveredBailBtn === u.id ? 'translateY(-1px)' : 'none',
                              boxShadow: hoveredBailBtn === u.id ? `0 4px 16px ${GOLD}40` : 'none',
                            }}>
                            {t('legal.bailGenerator')}
                          </button>
                          <div style={{ fontSize: '0.75rem',
                            color: 'var(--text-dim)',
                            display: 'flex', alignItems: 'center' }}>
                            Score: {bailScore}/100 —
                            {bailScore >= 60 ? ' Recommended to grant bail'
                              : bailScore >= 40 ? ' Bail with conditions'
                              : ' Bail may be denied'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="reveal-on-scroll" style={{ padding: '3rem', textAlign: 'center',
                background: 'var(--bg-card)',
                border: '1px solid rgba(212,168,67,0.08)', borderRadius: 12 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>✅</div>
                <div style={{ color: 'var(--text-legal)' }}>{t('common.noResults')}</div>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}