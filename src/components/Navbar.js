import { useNavigate } from 'react-router-dom';

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.2rem 2.5rem',
  borderBottom: '1px solid rgba(212,168,67,0.15)',
  background: 'rgba(8,9,26,0.97)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

export default function Navbar({ theme = 'gold', showBack = false }) {
  const navigate = useNavigate();

  const color = theme === 'green' ? '#1d9e75' : '#d4a843';
  const portalLabel = theme === 'green' ? 'Citizen Portal' : 
                      theme === 'legal' ? 'Legal Portal' : 'India';

  return (
    <nav style={navStyle}>
      <div
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 4L6 9v6c0 5.5 4 10.7 10 12 6-1.3 10-6.5 10-12V9L16 4z"
            stroke={color} strokeWidth="1.5" fill={`${color}15`} />
          <line x1="10" y1="16" x2="22" y2="16" stroke={color} strokeWidth="1.5" />
          <line x1="16" y1="10" x2="16" y2="22" stroke={color} strokeWidth="1.5" />
        </svg>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem',
            fontWeight: 700, color, lineHeight: 1 }}>Nyay Setu</div>
          <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
            color: `${color}99`, lineHeight: 1 }}>{portalLabel}</div>
        </div>
      </div>

      {showBack && (
        <div onClick={() => navigate('/')}
          style={{ fontSize: '0.8rem', color: 'rgba(232,228,216,0.45)', cursor: 'pointer',
            padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
          ← Back to Home
        </div>
      )}

      {!showBack && (
        <div style={{ fontSize: '0.7rem', padding: '4px 12px',
          border: '1px solid rgba(212,168,67,0.3)', borderRadius: 20,
          color: 'rgba(212,168,67,0.7)', letterSpacing: 1 }}>
          Beta v0.1 · India
        </div>
      )}
    </nav>
  );
}