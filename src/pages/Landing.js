import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';

const stats = [
  { num: '5.02', suffix: 'Cr', label: 'Pending Cases' },
  { num: '75', suffix: '%', label: 'Are Undertrials' },
  { num: '1', suffix: 'L+', label: 'Missing Yearly' },
  { num: '1.6', suffix: 'Cr', label: 'Without Legal Aid' },
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

function CountUpNumber({ end, suffix }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 2000;
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
  }, [end]);

  // Format to 2 decimal places if it's a float, otherwise integer
  const display = count % 1 !== 0 ? count.toFixed(2) : Math.floor(count);
  return <span>{display}{suffix}</span>;
}

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const citizenFeatures = [
    t('citizen.prisonerStatus'),
    t('citizen.knowYourRights'),
    t('citizen.freeLegalAid'),
    t('citizen.courtCalendar'),
  ];

  const legalFeatures = [
    t('legal.nyayMitra'),
    t('legal.undertrialAlerts'),
    t('legal.bailGenerator'),
    t('legal.precedentFinder'),
  ];


  return (
    <PageWrapper style={{ background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1.5rem', padding: '1rem 2rem', flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255,255,255,0.015)',
        position: 'relative', zIndex: 2 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="reveal-on-scroll">
            <div style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem',
                fontWeight: 600, color: '#d4a843', animation: 'countFade 1s ease-out forwards', animationDelay: `${i * 0.2}s` }}>
                <CountUpNumber end={parseFloat(s.num)} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: 'var(--text-dim)' }}>{s.label}</div>
            </div>
            {i < stats.length - 1 && (
              <div className="hide-mobile" style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.06)' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', position: 'relative', zIndex: 2 }}>

        <div className="reveal-on-scroll" style={{ fontSize: '0.72rem', letterSpacing: 3, textTransform: 'uppercase',
          color: 'rgba(212,168,67,0.7)', marginBottom: '1.2rem',
          display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 40, height: 1,
            background: 'rgba(212,168,67,0.3)' }} />
          AI-Powered Justice Platform · India
          <span style={{ display: 'inline-block', width: 40, height: 1,
            background: 'rgba(212,168,67,0.3)' }} />
        </div>

        <h1 className="reveal-on-scroll" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3.8rem',
          fontWeight: 700, textAlign: 'center', lineHeight: 1.1, marginBottom: '0.8rem',
          color: '#d4a843', background: 'linear-gradient(90deg, #d4a843, #f4db95, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'rotateGradient 5s linear infinite' }}>
          {t('landing.headline')}
        </h1>

        <p className="reveal-on-scroll" style={{ fontSize: '1rem', color: 'var(--text-muted)', textAlign: 'center',
          maxWidth: 480, lineHeight: 1.7, marginBottom: '3rem', fontWeight: 300 }}>
          {t('landing.subtitle')}
        </p>

        <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem', width: '100%', maxWidth: 820, marginBottom: '2rem' }}>

          <div style={{ animation: 'slideInLeft 0.6s ease-out forwards' }}>
            <PortalCard
              onClick={() => navigate('/citizen')}
              bg="linear-gradient(135deg,#0a1f1a,#0d2b24)"
              border="rgba(29,158,117,0.25)"
              iconBg="rgba(29,158,117,0.15)"
              iconBorder="rgba(29,158,117,0.3)"
              icon="🏛️"
              badgeColor="#1d9e75"
              badge={t('common.citizenPortal')}
              tag="No login needed"
              title={t('landing.citizenBtn')}
              desc={t('landing.citizenDesc')}
              features={citizenFeatures}
              dotColor="#1d9e75"
              ctaBg="rgba(29,158,117,0.15)"
              ctaColor="#1d9e75"
              ctaBorder="rgba(29,158,117,0.3)"
              cta={t('landing.citizenBtn') + ' →'}
            />
          </div>

          <div style={{ animation: 'slideInRight 0.6s ease-out forwards', animationDelay: '0.1s', opacity: 0 }}>
            <PortalCard
              onClick={() => navigate('/legal')}
              bg="linear-gradient(135deg,#1a1008,#251808)"
              border="rgba(212,168,67,0.2)"
              iconBg="rgba(212,168,67,0.1)"
              iconBorder="rgba(212,168,67,0.25)"
              icon="⚖️"
              badgeColor="#d4a843"
              badge={t('common.legalPortal')}
              tag="Professional"
              title={t('landing.legalBtn')}
              desc={t('landing.legalDesc')}
              features={legalFeatures}
              dotColor="#d4a843"
              ctaBg="rgba(212,168,67,0.1)"
              ctaColor="#d4a843"
              ctaBorder="rgba(212,168,67,0.25)"
              cta={t('landing.legalBtn') + ' →'}
            />
          </div>
        </div>

        <div className="reveal-on-scroll stagger-children" style={{ fontSize: '0.75rem', color: 'var(--text-dim)',
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
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
  
  // Choose glow color based on the theme (dotColor is a good proxy)
  const isCitizen = dotColor === '#1d9e75';
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass-card"
      style={{ 
        background: bg,
        border: `1px solid ${hovered ? border.replace('0.25','0.5').replace('0.2','0.4') : border}`,
        borderRadius: 16, padding: '2.2rem 2rem', cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered ? `0 12px 40px ${isCitizen ? 'rgba(29,158,117,0.2)' : 'rgba(212,168,67,0.15)'}` : 'none',
        height: '100%'
      }}>
        
      {/* Shimmer sweep effect */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
        transition: 'transform 0.6s ease',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem',
          fontSize: '0.65rem', padding: '3px 8px', borderRadius: 20,
          background: `${dotColor}12`, color: `${dotColor}aa`,
          border: `1px solid ${dotColor}30`, transition: 'all 0.3s',
          transform: hovered ? 'scale(1.05)' : 'scale(1)' }}>{tag}</div>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: iconBg,
          border: `1px solid ${iconBorder}`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.2rem',
          transition: 'transform 0.3s', transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)' }}>{icon}</div>
        <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
          color: badgeColor, marginBottom: '0.6rem', fontWeight: 500 }}>{badge}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem',
          fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)',
          lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 300 }}>{desc}</div>
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem',
          marginBottom: '1.5rem' }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.8rem', color: 'var(--text-muted)', opacity: hovered ? 1 : 0.8, transition: 'opacity 0.3s' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%',
                background: dotColor, flexShrink: 0,
                boxShadow: hovered ? `0 0 8px ${dotColor}` : 'none', transition: 'box-shadow 0.3s' }} />
              {f}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem',
          fontWeight: 500, padding: '0.7rem 1.2rem', borderRadius: 8,
          background: ctaBg, color: ctaColor, border: `1px solid ${ctaBorder}`,
          width: 'fit-content', transition: 'all 0.3s',
          transform: hovered ? 'translateX(5px)' : 'none',
          boxShadow: hovered ? `0 4px 12px ${ctaBg}` : 'none' }}>{cta}</div>
      </div>
    </div>
  );
}