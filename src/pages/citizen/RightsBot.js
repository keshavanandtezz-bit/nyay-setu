import { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';

const TEAL = '#1d9e75';
const G = '#08120f';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Namaste 🙏 I am Nyay Sahayak, your legal rights assistant.\n\nI can explain Indian laws, your rights after arrest, bail procedures, and help you understand the justice system in plain language.\n\nHow can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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

      // Always route through backend — never call Groq directly from frontend
      const response = await fetch(`${API_URL}/ai/rights-bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content: userMsg }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status} - ${errData.detail || 'Server error'}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.reply || "I'm sorry, I could not process that. Please try again."
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `I'm having trouble connecting right now.\n\n${err.message}\n\nFor urgent legal help, call the free helpline: 15100`
      }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: G, color: '#d8ede6',
      display: 'flex', flexDirection: 'column' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ padding: '1.5rem 2.5rem 0.5rem',
        maxWidth: 780, width: '100%', margin: '0 auto' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: 2,
          textTransform: 'uppercase', color: 'rgba(29,158,117,0.7)',
          marginBottom: '0.3rem' }}>AI Legal Assistant</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
          fontWeight: 700, color: '#d8ede6' }}>Know Your Rights</h1>
        <p style={{ fontSize: '0.82rem', color: 'rgba(216,237,230,0.4)',
          fontWeight: 300, marginTop: '0.3rem' }}>
          Ask anything about Indian law in plain English or Hindi.
        </p>
      </div>

      {/* Suggested Questions */}
      <div style={{ padding: '0.8rem 2.5rem',
        maxWidth: 780, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SUGGESTED.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              style={{ fontSize: '0.72rem', padding: '5px 12px',
                background: 'rgba(29,158,117,0.07)',
                border: '1px solid rgba(29,158,117,0.18)',
                borderRadius: 20, color: 'rgba(216,237,230,0.6)',
                cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
                transition: 'all 0.2s' }}
              onMouseEnter={e => {
                e.target.style.background = 'rgba(29,158,117,0.14)';
                e.target.style.color = '#d8ede6';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'rgba(29,158,117,0.07)';
                e.target.style.color = 'rgba(216,237,230,0.6)';
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 2.5rem',
        maxWidth: 780, width: '100%', margin: '0 auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '1rem' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(29,158,117,0.15)',
                border: '1px solid rgba(29,158,117,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', marginRight: 10,
                flexShrink: 0, marginTop: 2 }}>⚖️</div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '0.8rem 1.1rem',
              borderRadius: m.role === 'user'
                ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: m.role === 'user'
                ? 'rgba(29,158,117,0.18)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${m.role === 'user'
                ? 'rgba(29,158,117,0.3)' : 'rgba(255,255,255,0.07)'}`,
              fontSize: '0.85rem', lineHeight: 1.65,
              color: '#d8ede6', whiteSpace: 'pre-wrap'
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start',
            marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(29,158,117,0.15)',
              border: '1px solid rgba(29,158,117,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', marginRight: 10, flexShrink: 0 }}>⚖️</div>
            <div style={{ padding: '0.8rem 1.1rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px 14px 14px 4px',
              display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(d => (
                <div key={d} style={{ width: 7, height: 7, borderRadius: '50%',
                  background: 'rgba(29,158,117,0.5)',
                  animation: `bounce 1.2s ${d * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1rem 2.5rem 1.5rem',
        maxWidth: 780, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', background: 'rgba(29,158,117,0.06)',
          border: '1px solid rgba(29,158,117,0.22)',
          borderRadius: 12, overflow: 'hidden' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your legal rights..."
            disabled={loading}
            style={{ flex: 1, background: 'transparent', border: 'none',
              outline: 'none', padding: '0.9rem 1.2rem',
              fontSize: '0.9rem', color: '#d8ede6',
              fontFamily: "'Outfit',sans-serif" }}
          />
          <button onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{ padding: '0.9rem 1.5rem',
              background: loading ? 'rgba(29,158,117,0.3)' : TEAL,
              border: 'none', color: 'white',
              fontFamily: "'Outfit',sans-serif", fontSize: '0.85rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? '...' : 'Ask →'}
          </button>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(216,237,230,0.2)',
          marginTop: '0.5rem', textAlign: 'center' }}>
          General legal information only. For personal advice consult a lawyer.
          Free legal aid: 15100
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}