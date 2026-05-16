import { useState } from 'react';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { prisoners } from '../../data/prisoners';

const TEAL = '#1d9e75';

export default function CourtCalendar() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [phone, setPhone] = useState('');

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

  return (
    <PageWrapper style={{ minHeight: '100vh', background: '#08120f', color: '#d8ede6' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 2.5rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(29,158,117,0.7)', marginBottom: '0.3rem' }}>Hearing Schedule</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
          fontWeight: 700, color: '#d8ede6', marginBottom: '0.4rem' }}>Court Calendar</h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(216,237,230,0.45)', fontWeight: 300,
          marginBottom: '2rem' }}>
          Enter a case number or prisoner ID to view the full hearing history and next date.
        </p>

        <div style={{ display: 'flex', background: 'rgba(29,158,117,0.06)',
          border: '1px solid rgba(29,158,117,0.22)', borderRadius: 10,
          overflow: 'hidden', marginBottom: '0.6rem' }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Case number e.g. SC/BLR/2024/1182 or Prisoner ID"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              padding: '0.9rem 1.2rem', fontSize: '0.9rem', color: '#d8ede6',
              fontFamily: "'Outfit',sans-serif" }}
          />
          <button onClick={handleSearch}
            style={{ padding: '0.9rem 2rem', background: TEAL, border: 'none',
              color: 'white', fontFamily: "'Outfit',sans-serif",
              fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>Search</button>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(216,237,230,0.25)',
          marginBottom: '1.5rem' }}>
          Try: SC/BLR/2024/1182 · JMFC/MYS/2023/887 · SC/TUK/2023/445
        </div>

        {notFound && (
          <div style={{ padding: '2rem', textAlign: 'center',
            border: '1px solid rgba(29,158,117,0.1)', borderRadius: 12 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
            <div style={{ color: '#d8ede6', marginBottom: '0.4rem' }}>No case found</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(216,237,230,0.4)' }}>
              Check the case number and try again, or contact your nearest court registry.
            </div>
          </div>
        )}

        {result && (
          <div>
            <div style={{ background: 'rgba(29,158,117,0.05)',
              border: '1px solid rgba(29,158,117,0.15)', borderRadius: 12,
              padding: '1.4rem 1.8rem', marginBottom: '1.5rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
                  color: 'rgba(29,158,117,0.6)', marginBottom: 4 }}>Next hearing in</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '2rem', fontWeight: 700, color: '#d4a843', lineHeight: 1 }}>
                  {daysUntil(result.next_hearing_date)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(216,237,230,0.3)' }}>days</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(29,158,117,0.1)', borderRadius: 12,
              padding: '1.5rem 1.8rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem',
                fontWeight: 600, color: '#d8ede6', marginBottom: '1.5rem' }}>Full Hearing Timeline</div>
              <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0,
                  width: 1, background: 'rgba(29,158,117,0.15)' }} />
                {allDates.map((item, i) => {
                  const isUpcoming = item.type === 'upcoming';
                  return (
                    <div key={i} style={{ position: 'relative', marginBottom: '1.3rem' }}>
                      <div style={{ position: 'absolute', left: '-1.5rem', top: 5,
                        width: 13, height: 13, borderRadius: '50%', zIndex: 1,
                        background: isUpcoming ? 'transparent' : '#1d9e75',
                        border: isUpcoming ? '2px solid #d4a843' : '2px solid #08120f' }} />
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

            {!subscribed ? (
              <div style={{ background: 'rgba(29,158,117,0.05)',
                border: '1px solid rgba(29,158,117,0.15)', borderRadius: 12,
                padding: '1.2rem 1.8rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500,
                  color: '#d8ede6', marginBottom: '0.3rem' }}>🔔 Get SMS Alerts</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(216,237,230,0.45)',
                  marginBottom: '0.9rem' }}>
                  We'll text you when the hearing date changes or a new date is set.
                </div>
                <div style={{ display: 'flex', gap: '0.7rem' }}>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="Enter your mobile number"
                    style={{ flex: 1, background: 'rgba(29,158,117,0.06)',
                      border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8,
                      padding: '0.7rem 1rem', color: '#d8ede6', outline: 'none',
                      fontSize: '0.85rem', fontFamily: "'Outfit',sans-serif" }}
                  />
                  <button onClick={() => setSubscribed(true)}
                    style={{ padding: '0.7rem 1.5rem', background: TEAL, border: 'none',
                      borderRadius: 8, color: 'white', fontFamily: "'Outfit',sans-serif",
                      fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
                    Subscribe
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem 1.4rem', background: 'rgba(29,158,117,0.08)',
                border: '1px solid rgba(29,158,117,0.2)', borderRadius: 10,
                display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div style={{ fontSize: '0.85rem', color: 'rgba(216,237,230,0.7)' }}>
                  You'll receive SMS alerts on <strong style={{ color: '#d8ede6' }}>{phone}</strong> when this case has an update.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}