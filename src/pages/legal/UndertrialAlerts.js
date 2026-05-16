import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { undertrials, getDaysInCustody, getAlertStatus, getBailScore } from '../../data/undertrials';
import { legalAPI } from '../../services/api';

const GOLD = '#d4a843';
const BG = '#0d0c08';

const STATUS_CONFIG = {
  red: { bg: 'rgba(226,75,74,0.1)', border: 'rgba(226,75,74,0.3)',
    text: '#f09595', dot: '#e24b4a', label: 'Overdue' },
  yellow: { bg: 'rgba(239,159,39,0.08)', border: 'rgba(239,159,39,0.25)',
    text: '#fac775', dot: '#ef9f27', label: 'Approaching Limit' },
  green: { bg: 'rgba(29,158,117,0.08)', border: 'rgba(29,158,117,0.2)',
    text: '#1d9e75', dot: '#1d9e75', label: 'Within Limit' },
};

const DISTRICTS = [...new Set(undertrials.map(u => u.district))];

export default function UndertrialAlerts() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState('days_desc');
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState([]);
  const [liveCounts, setLiveCounts] = useState({ total: 0, red: 0, yellow: 0, green: 0 });
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    setLoading(true);
    legalAPI.getUndertrials()
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
  }, []);

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
    <div style={{ minHeight: '100vh', background: BG, color: '#e8e0cc' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 2.5rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: 2,
            textTransform: 'uppercase', color: 'rgba(212,168,67,0.6)',
            marginBottom: '0.4rem' }}>Legal Compliance Monitor</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
            fontWeight: 700, color: '#e8e0cc', marginBottom: '0.3rem' }}>
            Undertrial Overdue Alerts
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(232,224,204,0.4)', fontWeight: 300 }}>
            Prisoners who have exceeded or are approaching their legal detention limit — Karnataka
          </p>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '3rem', gap: 12 }}>
            <div style={{ width: 20, height: 20,
              border: '2px solid rgba(212,168,67,0.3)',
              borderTopColor: GOLD, borderRadius: '50%',
              animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '0.85rem', color: 'rgba(232,224,204,0.4)' }}>
              Loading live data from database...
            </span>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Undertrials', value: counts.total, color: GOLD, filter: 'all' },
                { label: 'Overdue — Red Alert', value: counts.red, color: '#e24b4a', filter: 'red' },
                { label: 'Approaching Limit', value: counts.yellow, color: '#ef9f27', filter: 'yellow' },
                { label: 'Within Legal Limit', value: counts.green, color: '#1d9e75', filter: 'green' },
              ].map((s, i) => (
                <div key={i} onClick={() => setFilter(s.filter)}
                  style={{ background: filter === s.filter
                    ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${filter === s.filter
                      ? s.color + '40' : 'rgba(212,168,67,0.08)'}`,
                    borderRadius: 10, padding: '1rem',
                    cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = filter === s.filter
                    ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)'}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '2rem', fontWeight: 600, color: s.color,
                    lineHeight: 1, marginBottom: '0.3rem' }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(232,224,204,0.4)',
                    textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '1.2rem',
              flexWrap: 'wrap', alignItems: 'center' }}>
              {['all', 'red', 'yellow', 'green'].map(f => {
                const labels = { all: 'All', red: '🔴 Overdue',
                  yellow: '🟡 Approaching', green: '🟢 Within Limit' };
                const isActive = filter === f;
                return (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.78rem',
                      fontFamily: "'Outfit',sans-serif", cursor: 'pointer',
                      borderRadius: 8, transition: 'all 0.2s',
                      background: isActive ? 'rgba(212,168,67,0.15)' : 'transparent',
                      border: `1px solid ${isActive
                        ? 'rgba(212,168,67,0.4)' : 'rgba(212,168,67,0.1)'}`,
                      color: isActive ? GOLD : 'rgba(232,224,204,0.45)' }}>
                    {labels[f]}
                  </button>
                );
              })}

              <select value={districtFilter}
                onChange={e => setDistrictFilter(e.target.value)}
                style={{ padding: '0.45rem 1rem',
                  background: 'rgba(212,168,67,0.04)',
                  border: '1px solid rgba(212,168,67,0.12)', borderRadius: 8,
                  color: districtFilter ? '#e8e0cc' : 'rgba(232,224,204,0.35)',
                  fontSize: '0.78rem', fontFamily: "'Outfit',sans-serif",
                  outline: 'none', cursor: 'pointer' }}>
                <option value="" style={{ background: '#1a1408' }}>All Districts</option>
                {DISTRICTS.map((d, i) => (
                  <option key={i} value={d} style={{ background: '#1a1408' }}>{d}</option>
                ))}
              </select>

              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding: '0.45rem 1rem',
                  background: 'rgba(212,168,67,0.04)',
                  border: '1px solid rgba(212,168,67,0.12)', borderRadius: 8,
                  color: '#e8e0cc', fontSize: '0.78rem',
                  fontFamily: "'Outfit',sans-serif",
                  outline: 'none', cursor: 'pointer', marginLeft: 'auto' }}>
                <option value="days_desc" style={{ background: '#1a1408' }}>Most Days First</option>
                <option value="days_asc" style={{ background: '#1a1408' }}>Least Days First</option>
                <option value="bail_desc" style={{ background: '#1a1408' }}>Highest Bail Score</option>
                <option value="name" style={{ background: '#1a1408' }}>Name A–Z</option>
              </select>

              <span style={{ fontSize: '0.75rem', color: 'rgba(232,224,204,0.3)' }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
              padding: '0.5rem 1.2rem', marginBottom: '0.4rem' }}>
              {['Prisoner', 'District', 'Days', 'Status', 'Bail Score', 'Action'].map((h, i) => (
                <div key={i} style={{ fontSize: '0.62rem', letterSpacing: 1.5,
                  textTransform: 'uppercase', color: 'rgba(232,224,204,0.3)',
                  textAlign: i > 1 ? 'center' : 'left' }}>{h}</div>
              ))}
            </div>

            {filtered.map((u) => {
              const alertStatus = u.alert_status || 'green';
              const sc = STATUS_CONFIG[alertStatus] || STATUS_CONFIG.green;
              const isExpanded = expanded === u.id;
              const days = u.days_in_custody || 0;
              const bailScore = u.bail_score || 0;

              return (
                <div key={u.id} style={{ marginBottom: '0.5rem',
                  border: `1px solid ${isExpanded ? sc.border : 'rgba(212,168,67,0.08)'}`,
                  borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s' }}>

                  <div onClick={() => setExpanded(isExpanded ? null : u.id)}
                    style={{ display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                      padding: '0.85rem 1.2rem', cursor: 'pointer',
                      background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                      transition: 'background 0.2s' }}
                    onMouseEnter={e => !isExpanded && (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => !isExpanded && (e.currentTarget.style.background = 'transparent')}>

                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 500,
                        color: '#e8e0cc', marginBottom: 2 }}>{u.name}</div>
                      <div style={{ fontSize: '0.7rem',
                        color: 'rgba(232,224,204,0.35)' }}>{u.prisoner_id}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem',
                        color: 'rgba(232,224,204,0.5)' }}>{u.district}</span>
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
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 2,
                          width: `${bailScore}%`,
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
                        style={{ padding: '4px 12px', fontSize: '0.7rem',
                          background: 'rgba(212,168,67,0.1)',
                          border: '1px solid rgba(212,168,67,0.25)',
                          borderRadius: 6, color: GOLD, cursor: 'pointer',
                          fontFamily: "'Outfit',sans-serif",
                          transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => e.target.style.background = 'rgba(212,168,67,0.2)'}
                        onMouseLeave={e => e.target.style.background = 'rgba(212,168,67,0.1)'}>
                        Bail App →
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 1.2rem 1.2rem',
                      borderTop: `1px solid ${sc.border}`,
                      background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'grid',
                        gridTemplateColumns: 'repeat(4,1fr)',
                        gap: '0.8rem', paddingTop: '1rem' }}>
                        {[
                          { label: 'Arrest Date', value: formatDate(u.arrest_date) },
                          { label: 'Prison', value: u.prison },
                          { label: 'Charges', value: u.charges },
                          { label: 'IPC Sections', value: u.ipc_sections },
                          { label: 'Lawyer', value: u.lawyer, warn: !u.has_lawyer },
                          { label: 'Court', value: u.court },
                          { label: 'Next Hearing', value: formatDate(u.next_hearing) },
                          { label: 'Prior Record', value: u.prior_record ? 'Yes' : 'No',
                            warn: u.prior_record },
                        ].map((item, idx) => (
                          <div key={idx}>
                            <div style={{ fontSize: '0.6rem', letterSpacing: 1.5,
                              textTransform: 'uppercase',
                              color: 'rgba(232,224,204,0.3)', marginBottom: 3 }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: '0.8rem',
                              color: item.warn ? '#f09595' : 'rgba(232,224,204,0.7)',
                              lineHeight: 1.4 }}>{item.value}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.7rem' }}>
                        <button onClick={() => navigate(`/legal/bail?id=${u.id}`)}
                          style={{ padding: '0.55rem 1.4rem',
                            background: GOLD, border: 'none', borderRadius: 8,
                            color: '#0d0c08', fontFamily: "'Outfit',sans-serif",
                            fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                          Generate Bail Application
                        </button>
                        <div style={{ fontSize: '0.75rem',
                          color: 'rgba(232,224,204,0.3)',
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

            {filtered.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(212,168,67,0.08)', borderRadius: 12 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>✅</div>
                <div style={{ color: '#e8e0cc' }}>No undertrials match this filter</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}