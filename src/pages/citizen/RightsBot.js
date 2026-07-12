import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { aiAPI } from '../../services/api';

const TEAL = '#1d9e75';

const SUGGESTED = [
  "What are my rights if I am arrested?",
  "What is the maximum time police can hold someone without charge?",
  "How do I apply for bail?",
  "What is Section 498A IPC?",
  "What are undertrial prisoner rights in India?",
  "What is the difference between bailable and non-bailable offence?",
  "How to file an FIR if police refuses?",
  "What is legal aid and am I eligible for it?",
];

export default function RightsBot() {
  const { t } = useTranslation();

  const INITIAL_MESSAGE = {
    role: 'assistant',
    text: t('rightsBot.greeting'),
  };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function resetConversation() {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setLoading(false);
  }

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text
      }));

      const data = await aiAPI.rightsBot(
        [...history, { role: 'user', content: userMsg }]
      );

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.reply || t('rightsBot.errorMsg')
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `${t('rightsBot.errorMsg')}\n\n${err.message}\n\nFor urgent legal help, call the free helpline: 15100`
      }]);
    }
    setLoading(false);
  }

  return (
    <PageWrapper style={{ minHeight: '100vh', background: 'var(--bg-citizen)', color: 'var(--text-citizen)',
      display: 'flex', flexDirection: 'column' }}>
      <Navbar theme="green" showBack={true} />

      <div className="reveal-on-scroll" style={{ padding: isMobile ? '1rem 1.5rem 0.5rem' : '1.5rem 2.5rem 0.5rem',
        maxWidth: 780, width: '100%', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.72rem', letterSpacing: 2,
            textTransform: 'uppercase', color: 'rgba(29,158,117,0.7)',
            marginBottom: '0.4rem' }}>{t('rightsBot.subtitle')}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
            fontWeight: 700, color: 'var(--text-citizen)', background: 'linear-gradient(90deg, #d8ede6, #1d9e75)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('rightsBot.title')}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)',
            fontWeight: 300, marginTop: '0.4rem' }}>
            {t('citizen.knowYourRightsDesc')}
          </p>
        </div>
        {messages.length > 1 && (
          <button onClick={resetConversation}
            style={{ padding: '0.5rem 1.2rem', background: 'transparent',
              border: '1px solid rgba(29,158,117,0.3)', borderRadius: 20,
              color: 'rgba(29,158,117,0.9)', cursor: 'pointer', fontSize: '0.75rem',
              fontFamily: "'Outfit',sans-serif", whiteSpace: 'nowrap',
              marginTop: '0.5rem', transition: 'all 0.2s' }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(29,158,117,0.1)';
              e.target.style.color = '#2ed89c';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'rgba(29,158,117,0.9)';
              e.target.style.transform = 'scale(1)';
            }}>
            ↺ {t('rightsBot.newChat')}
          </button>
        )}
      </div>

      {/* Suggested Questions */}
      <div style={{ padding: isMobile ? '0.5rem 1.5rem' : '0.8rem 2.5rem',
        maxWidth: 780, width: '100%', margin: '0 auto', opacity: messages.length > 1 ? 0.4 : 1, transition: 'opacity 0.5s' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {SUGGESTED.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              disabled={loading}
              style={{ fontSize: '0.72rem', padding: '6px 14px',
                background: 'rgba(29,158,117,0.05)',
                border: '1px solid rgba(29,158,117,0.2)',
                borderRadius: 20, color: 'rgba(216,237,230,0.7)',
                cursor: loading ? 'default' : 'pointer', fontFamily: "'Outfit',sans-serif",
                transition: 'all 0.2s', animation: 'fadeInScale 0.4s ease-out forwards', animationDelay: `${i * 0.05}s`, opacity: 0 }}
              onMouseEnter={e => {
                if(!loading) {
                  e.target.style.background = 'rgba(29,158,117,0.15)';
                  e.target.style.color = 'var(--text-citizen)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                if(!loading) {
                  e.target.style.background = 'rgba(29,158,117,0.05)';
                  e.target.style.color = 'rgba(216,237,230,0.7)';
                  e.target.style.transform = 'none';
                }
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '1rem 1.5rem' : '1rem 2.5rem',
        maxWidth: 780, width: '100%', margin: '0 auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '1.2rem',
            animation: m.role === 'user' ? 'slideInRight 0.3s ease-out' : 'slideInLeft 0.3s ease-out' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(29,158,117,0.15)',
                border: '1px solid rgba(29,158,117,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', marginRight: 12,
                flexShrink: 0, marginTop: 2, boxShadow: '0 0 10px rgba(29,158,117,0.1)' }}>⚖️</div>
            )}
            <div style={{
              maxWidth: '80%',
              padding: '1rem 1.4rem',
              borderRadius: m.role === 'user'
                ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user'
                ? 'linear-gradient(135deg, rgba(29,158,117,0.15), rgba(29,158,117,0.25))' 
                : 'var(--bg-card)',
              border: `1px solid ${m.role === 'user'
                ? 'rgba(29,158,117,0.4)' : 'var(--border-card)'}`,
              fontSize: '0.9rem', lineHeight: 1.7,
              color: 'var(--text-citizen)', whiteSpace: 'pre-wrap',
              boxShadow: m.role === 'user' ? '0 4px 15px rgba(29,158,117,0.1)' : '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start',
            marginBottom: '1.2rem', animation: 'fadeInUp 0.3s ease-out' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(29,158,117,0.15)',
              border: '1px solid rgba(29,158,117,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', marginRight: 12, flexShrink: 0 }}>⚖️</div>
            <div style={{ padding: '1rem 1.4rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: '16px 16px 16px 4px',
              display: 'flex', gap: 6, alignItems: 'center', height: 44 }}>
              {[0, 1, 2].map(d => (
                <div key={d} style={{ width: 8, height: 8, borderRadius: '50%',
                  background: 'rgba(29,158,117,0.7)',
                  animation: `float 1s ${d * 0.2}s infinite ease-in-out` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: isMobile ? '1rem 1.5rem 1.5rem' : '1rem 2.5rem 2rem',
        maxWidth: 780, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', background: 'rgba(29,158,117,0.06)',
          border: '1px solid rgba(29,158,117,0.22)',
          borderRadius: 14, overflow: 'hidden', transition: 'box-shadow 0.3s' }}
          onFocus={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(29,158,117,0.2)'}
          onBlur={e => e.currentTarget.style.boxShadow = 'none'}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={t('rightsBot.placeholder')}
            disabled={loading}
            style={{ flex: 1, background: 'transparent', border: 'none',
              outline: 'none', padding: '1.2rem 1.4rem',
              fontSize: '0.95rem', color: 'var(--text-citizen)',
              fontFamily: "'Outfit',sans-serif" }}
          />
          <button onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{ padding: '0 2rem',
              background: loading || !input.trim() ? 'rgba(29,158,117,0.2)' : TEAL,
              border: 'none', color: 'white',
              fontFamily: "'Outfit',sans-serif", fontSize: '0.9rem',
              fontWeight: 600,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s' }}
            onMouseEnter={e => {
              if(!loading && input.trim()) {
                e.currentTarget.style.background = '#2ed89c';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(29,158,117,0.4)';
              }
            }}
            onMouseLeave={e => {
              if(!loading && input.trim()) {
                e.currentTarget.style.background = TEAL;
                e.currentTarget.style.boxShadow = 'none';
              }
            }}>
            {loading ? t('rightsBot.thinking') : t('rightsBot.send')}
          </button>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)',
          marginTop: '0.8rem', textAlign: 'center' }}>
          General legal information only. For personal advice consult a lawyer.
          Free legal aid: 15100
        </div>
      </div>
    </PageWrapper>
  );
}