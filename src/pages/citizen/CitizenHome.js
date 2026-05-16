import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';

export default function CitizenHome() {
  const navigate = useNavigate();

  const features = [
    { icon: '👤', title: 'Prisoner Status', tag: 'Search by name or ID →',
      desc: 'Find where your family member is held, next hearing date, lawyer details.',
      route: '/citizen/status' },
    { icon: '🤖', title: 'Know Your Rights', tag: 'Ask the AI →',
      desc: 'Ask any legal question in plain English or Hindi. AI explains without jargon.',
      route: '/citizen/rights' },
    { icon: '🗓️', title: 'Court Calendar', tag: 'Check dates →',
      desc: 'View all upcoming hearing dates. Subscribe to SMS alerts so you never miss one.',
      route: '/citizen/calendar' },
    { icon: '🧑‍⚖️', title: 'Find Free Legal Aid', tag: 'Find near me →',
      desc: 'Locate the nearest DLSA and free lawyers available in your district.',
      route: '/citizen/legal-aid' },
    { icon: '📋', title: 'File a Complaint', tag: 'Step by step guide →',
      desc: 'Understand how to file an FIR and what to do if police refuses.',
      route: '/citizen/rights' },
    { icon: '🔔', title: 'SMS Alerts', tag: 'Subscribe →',
      desc: 'Subscribe your phone to receive automatic alerts for hearing date changes.',
      route: '/citizen/calendar' },
  ];

  function handleSearch(e) {
    if (e.key === 'Enter' || e.type === 'click') {
      const val = document.getElementById('main-search').value.trim();
      if (val) navigate(`/citizen/status?q=${encodeURIComponent(val)}`);
    }
  }

  return (
    <PageWrapper style={{ minHeight: '100vh', background: '#08120f', color: '#d8ede6' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        margin: '1rem 2.5rem', padding: '0.9rem 1.4rem',
        background: 'rgba(162,29,29,0.08)', border: '1px solid rgba(162,29,29,0.2)',
        borderRadius: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e24b4a',
            animation: 'cpulse 1.5s infinite' }} />
          <span style={{ fontSize: '0.82rem', color: 'rgba(216,237,230,0.6)' }}>
            <strong style={{ color: '#f09595' }}>Emergency?</strong>
            {' '}Call 112 · Legal Aid: 15100 · Women Helpline: 1091
          </span>
        </div>
        <button style={{ fontSize: '0.75rem', padding: '5px 14px',
          background: 'rgba(162,29,29,0.15)', border: '1px solid rgba(162,29,29,0.3)',
          borderRadius: 6, color: '#f09595', cursor: 'pointer' }}>Quick Dial →</button>
      </div>

      <div style={{ padding: '1.5rem 2.5rem 1rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase',
          color: '#1d9e75', marginBottom: '0.5rem' }}>Welcome · नमस्ते</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.6rem',
          fontWeight: 700, color: '#d8ede6', lineHeight: 1.15, marginBottom: '0.5rem' }}>
          How can we help<br />you today?
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(216,237,230,0.45)', fontWeight: 300,
          maxWidth: 450, lineHeight: 1.6 }}>
          Search for any case, find your loved one's hearing date, or understand your
          legal rights — no login required.
        </p>
      </div>

      <div style={{ padding: '0 2.5rem 1.5rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase',
          color: 'rgba(29,158,117,0.7)', marginBottom: '0.8rem' }}>Track a case or prisoner</div>
        <div style={{ display: 'flex', background: 'rgba(29,158,117,0.06)',
          border: '1px solid rgba(29,158,117,0.2)', borderRadius: 10, overflow: 'hidden' }}>
          <input id="main-search" type="text" onKeyDown={handleSearch}
            placeholder="Enter Prisoner ID, Case Number, or Name (e.g. KA/BLR/2024/001)"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              padding: '0.9rem 1.2rem', fontSize: '0.9rem', color: '#d8ede6',
              fontFamily: "'Outfit',sans-serif" }}
          />
          <button onClick={handleSearch}
            style={{ padding: '0.9rem 1.8rem', background: '#1d9e75', border: 'none',
              color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: '0.85rem',
              fontWeight: 500, cursor: 'pointer' }}>Search</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem',
        padding: '0 2.5rem 2.5rem', maxWidth: 1000, margin: '0 auto' }}>
        {features.map((f, i) => (
          <div key={i} onClick={() => navigate(f.route)}
            style={{ background: 'rgba(29,158,117,0.05)',
              border: '1px solid rgba(29,158,117,0.12)', borderRadius: 12,
              padding: '1.4rem', cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(29,158,117,0.1)';
              e.currentTarget.style.borderColor = 'rgba(29,158,117,0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(29,158,117,0.05)';
              e.currentTarget.style.borderColor = 'rgba(29,158,117,0.12)';
              e.currentTarget.style.transform = 'none';
            }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{f.icon}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#d8ede6',
              marginBottom: '0.3rem' }}>{f.title}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(216,237,230,0.4)',
              lineHeight: 1.5, marginBottom: '0.8rem' }}>{f.desc}</div>
            <div style={{ fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
              color: '#1d9e75', opacity: 0.7 }}>{f.tag}</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes cpulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </PageWrapper>
  );
}