import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageWrapper style={{ 
      background: '#08091a', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Navbar showBack={true} />
      
      {/* Subtle particle/star background */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, rgba(212,168,67,0.05) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 1,
        animation: 'fadeInScale 0.6s ease-out'
      }}>
        <h1 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: '12vw', 
          lineHeight: 1,
          fontWeight: 700, 
          color: '#d4a843',
          margin: 0,
          background: 'linear-gradient(135deg, #f0d58b 0%, #d4a843 50%, #8a6a24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'float 6s ease-in-out infinite'
        }}>
          404
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'rgba(232,228,216,0.6)', 
          marginTop: '1rem',
          marginBottom: '3rem',
          letterSpacing: 2,
          textTransform: 'uppercase'
        }}>
          Lost in the corridors of justice?
        </p>
        
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '1rem 2.5rem', 
            fontSize: '1rem', 
            fontWeight: 500,
            color: '#08091a', 
            background: '#d4a843', 
            border: 'none', 
            borderRadius: 30,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(212,168,67,0.4)',
            transition: 'all 0.3s ease',
            animation: 'pulseGlow 2s infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Go Back Home
        </button>
      </div>
    </PageWrapper>
  );
}