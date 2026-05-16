import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';

const stats = [
  { num: '5.02Cr', label: 'Pending Cases' },
  { num: '75%', label: 'Are Undertrials' },
  { num: '1L+', label: 'Missing Yearly' },
  { num: '1.6Cr', label: 'Without Legal Aid' },
];

const citizenFeatures = [
  'Search by prisoner ID or name',
  'Know your legal rights in Hindi',
  'Find free legal aid near you',
  'SMS alerts for hearing dates',
];

const legalFeatures = [
  'Nyay Mitra — AI case summarizer',
  'Undertrial overdue alert dashboard',
  'One-click bail application generator',
  'Indian Kanoon precedent finder',
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <PageWrapper style={{ background: '#08091a' }}>
      <Navbar />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '2rem', padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255,255,255,0.015)' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem',
                fontWeight: 600, color: '#d4a843' }}>{s.num}</div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: 'rgba(232,228,216,0.35)' }}>{s.label}</div>
            </div>
            {i < stats.length - 1 && (
              <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.06)' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>

        <div style={{ fontSize: '0.72rem', letterSpacing: 3, textTransform: 'uppercase',
          color: 'rgba(212,168,67,0.7)', marginBottom: '1.2rem',
          display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 40, height: 1,
            background: 'rgba(212,168,67,0.3)' }} />
          AI-Powered Justice Platform · India
          <span style={{ display: 'inline-block', width: 40, height: 1,
            background: 'rgba(212,168,67,0.3)' }} />
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3.8rem',
          fontWeight: 700, textAlign: 'center', lineHeight: 1.1, marginBottom: '0.8rem' }}>
          Where <span style={{ color: '#d4a843', fontStyle: 'italic' }}>Justice</span> meets
          <br />Intelligence
        </h1>

        <p style={{ fontSize: '1rem', color: 'rgba(232,228,216,0.5)', textAlign: 'center',
          maxWidth: 480, lineHeight: 1.7, marginBottom: '3rem', fontWeight: 300 }}>
          A unified platform connecting citizens, lawyers and judges — powered by AI
          to make the Indian judicial system transparent, fast, and accessible.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem', width: '100%', maxWidth: 820, marginBottom: '2rem' }}>

          <PortalCard
            onClick={() => navigate('/citizen')}
            bg="linear-gradient(135deg,#0a1f1a,#0d2b24)"
            border="rgba(29,158,117,0.25)"
            iconBg="rgba(29,158,117,0.15)"
            iconBorder="rgba(29,158,117,0.3)"
            icon="🏛️"
            badgeColor="#1d9e75"
            badge="Citizen Portal"
            tag="No login needed"
            title="For Common People"
            desc="Find case status, track your family member in custody, know your rights — in plain language."
            features={citizenFeatures}
            dotColor="#1d9e75"
            ctaBg="rgba(29,158,117,0.15)"
            ctaColor="#1d9e75"
            ctaBorder="rgba(29,158,117,0.3)"
            cta="Enter Citizen Portal →"
          />

          <PortalCard
            onClick={() => navigate('/legal')}
            bg="linear-gradient(135deg,#1a1008,#251808)"
            border="rgba(212,168,67,0.2)"
            iconBg="rgba(212,168,67,0.1)"
            iconBorder="rgba(212,168,67,0.25)"
            icon="⚖️"
            badgeColor="#d4a843"
            badge="Legal Professional Portal"
            tag="Professional login"
            title="For Lawyers & Judges"
            desc="AI-powered tools to summarize cases, find precedents, track overdue undertrials and generate bail documents."
            features={legalFeatures}
            dotColor="#d4a843"
            ctaBg="rgba(212,168,67,0.1)"
            ctaColor="#d4a843"
            ctaBorder="rgba(212,168,67,0.25)"
            cta="Enter Legal Portal →"
          />
        </div>

        <div style={{ fontSize: '0.75rem', color: 'rgba(232,228,216,0.25)',
          display: 'flex', alignItems: 'center', gap: 6 }}>
          {['Built for India', 'Free to use', 'Powered by Groq AI', 'Data from NCRB · NJDG']
            .map((t, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ width: 3, height: 3, borderRadius: '50%',
                background: 'rgba(232,228,216,0.2)', display: 'inline-block' }} />}
              {t}
            </span>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function PortalCard({ onClick, bg, border, iconBg, iconBorder, icon, badgeColor,
  badge, tag, title, desc, features, dotColor, ctaBg, ctaColor, ctaBorder, cta }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: bg,
        border: `1px solid ${hovered ? border.replace('0.25','0.5').replace('0.2','0.4') : border}`,
        borderRadius: 16, padding: '2.2rem 2rem', cursor: 'pointer',
        transition: 'all 0.3s ease', position: 'relative',
        transform: hovered ? 'translateY(-4px)' : 'none' }}>
      <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem',
        fontSize: '0.65rem', padding: '3px 8px', borderRadius: 20,
        background: `${dotColor}12`, color: `${dotColor}aa`,
        border: `1px solid ${dotColor}30` }}>{tag}</div>
      <div style={{ width: 52, height: 52, borderRadius: 12, background: iconBg,
        border: `1px solid ${iconBorder}`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.2rem' }}>{icon}</div>
      <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
        color: badgeColor, marginBottom: '0.6rem', fontWeight: 500 }}>{badge}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem',
        fontWeight: 700, marginBottom: '0.5rem', color: '#e8e4d8' }}>{title}</div>
      <div style={{ fontSize: '0.85rem', color: 'rgba(232,228,216,0.5)',
        lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 300 }}>{desc}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem',
        marginBottom: '1.5rem' }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8,
            fontSize: '0.8rem', color: 'rgba(232,228,216,0.5)' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%',
              background: dotColor, flexShrink: 0 }} />
            {f}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem',
        fontWeight: 500, padding: '0.7rem 1.2rem', borderRadius: 8,
        background: ctaBg, color: ctaColor, border: `1px solid ${ctaBorder}`,
        width: 'fit-content' }}>{cta}</div>
    </div>
  );
}