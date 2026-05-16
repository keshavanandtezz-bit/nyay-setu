import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#08091a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: '8rem',
        fontWeight: 700,
        color: 'rgba(212,168,67,0.15)',
        lineHeight: 1,
        marginBottom: '1rem',
        userSelect: 'none',
      }}>404</div>

      <h1 style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: '2rem',
        fontWeight: 700,
        color: '#e8e4d8',
        marginBottom: '0.5rem',
      }}>Page Not Found</h1>

      <p style={{
        fontSize: '0.9rem',
        color: 'rgba(232,228,216,0.45)',
        maxWidth: 360,
        lineHeight: 1.7,
        marginBottom: '2rem',
        fontWeight: 300,
      }}>
        The page you are looking for does not exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <button onClick={() => navigate('/')}
          style={{
            padding: '0.7rem 1.8rem',
            background: '#d4a843',
            border: 'none',
            borderRadius: 8,
            color: '#0d0c08',
            fontFamily: "'Outfit',sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
          Go Home
        </button>
        <button onClick={() => navigate(-1)}
          style={{
            padding: '0.7rem 1.8rem',
            background: 'transparent',
            border: '1px solid rgba(212,168,67,0.25)',
            borderRadius: 8,
            color: 'rgba(212,168,67,0.7)',
            fontFamily: "'Outfit',sans-serif",
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}>
          Go Back
        </button>
      </div>
    </div>
  );
}