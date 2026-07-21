import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { legalAPI } from '../../services/api';
import { undertrials, getDaysInCustody } from '../../data/undertrials';

const GOLD = '#d4a843';

const sidebarSections = [
  {
    section: 'Overview',
    items: [{ icon: '📊', label: 'Dashboard', route: '/legal', active: true }],
  },
  {
    section: 'AI Tools',
    items: [
      { icon: '🤖', label: 'Nyay Mitra', route: '/legal/nyay-mitra' },
      { icon: '🔍', label: 'Precedent Finder', route: '/legal/precedents' },
      { icon: '📄', label: 'Bail Generator', route: '/legal/bail' },
    ],
  },
  {
    section: 'Case Management',
    items: [
      { icon: '⚠️', label: 'Overdue Alerts', route: '/legal/alerts' },
      { icon: '📅', label: 'Hearing Schedule', route: '/legal/alerts' },
    ],
  },
  {
    section: 'Reports',
    items: [
      { icon: '📈', label: 'District Analytics', route: '/legal/alerts' },
      { icon: '⚖️', label: 'Bail Risk Report', route: '/legal/bail' },
    ],
  },
];

function CountUp({ end, suffix = '', duration = 1500, rawStr }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (end === 0) return;
    let start = 0;
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
  }, [end, duration]);

  if (end === 0) return <span>{rawStr}</span>;
  const display = count % 1 !== 0 ? count.toFixed(1) : Math.floor(count).toLocaleString('en-IN');
  return <span>{display}{suffix}</span>;
}

export default function LegalHome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [overdueCount, setOverdueCount] = useState(null);

  const DEFAULT_STATS = [
    { num: 0, rawStr: '—', label: t('legal.totalUndertrials'), change: t('common.loading'), changeColor: 'rgba(232,224,204,0.3)', numColor: GOLD },
    { num: 0, rawStr: '—', label: t('legal.overdue'), change: t('common.loading'), changeColor: 'rgba(232,224,204,0.3)', numColor: '#e24b4a' },
    { num: 0, rawStr: '—', label: t('legal.approaching'), change: t('common.loading'), changeColor: 'rgba(232,224,204,0.3)', numColor: '#1d9e75' },
    { num: 0, rawStr: '1.2s', label: t('legal.noLawyer'), change: 'Nyay Mitra 99% uptime', changeColor: '#1d9e75', numColor: GOLD, suffix: 's' },
  ];

  const tools = [
    {
      icon: '🤖', title: t('legal.nyayMitra'), alert: false,
      route: '/legal/nyay-mitra',
      desc: t('legal.nyayMitraDesc'),
      cta: 'Open AI Summarizer →', ctaColor: 'rgba(212,168,67,0.7)',
    },
    {
      icon: '⚠️', title: t('legal.undertrialAlerts'), alert: true,
      route: '/legal/alerts',
      desc: t('legal.undertrialAlertsDesc'),
      cta: 'View Alerts →', ctaColor: 'rgba(226,75,74,0.7)',
    },
    {
      icon: '📚', title: t('legal.precedentFinder'), alert: false,
      route: '/legal/precedents',
      desc: t('legal.precedentFinderDesc'),
      cta: 'Search Precedents →', ctaColor: 'rgba(212,168,67,0.7)',
    },
    {
      icon: '📄', title: t('legal.bailGenerator'), alert: false,
      route: '/legal/bail',
      desc: t('legal.bailGeneratorDesc'),
      cta: 'Generate Application →', ctaColor: 'rgba(212,168,67,0.7)',
    },
  ];

  const [statsData, setStatsData] = useState(DEFAULT_STATS);
  
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    legalAPI.getStats()
      .then(data => {
        const overdue = data.overdue_count ?? 0;
        setOverdueCount(overdue);
        setStatsData([
          { num: data.total_undertrials ?? 0, rawStr: '—', label: t('legal.totalUndertrials'), change: 'Updated just now', changeColor: '#e24b4a', numColor: GOLD },
          { num: overdue, rawStr: '—', label: t('legal.overdue'), change: 'Exceeding legal limit', changeColor: '#e24b4a', numColor: '#e24b4a' },
          { num: data.approaching_limit ?? 0, rawStr: '—', label: t('legal.approaching'), change: 'In next 30 days', changeColor: '#1d9e75', numColor: '#1d9e75' },
          { num: data.no_lawyer_assigned ?? 0, rawStr: '—', label: t('legal.noLawyer'), change: 'Need representation', changeColor: '#1d9e75', numColor: GOLD },
        ]);
      })
      .catch(() => {
        // Fallback to local data if API is down
        const total = undertrials.length;
        const overdue = undertrials.filter(u => getDaysInCustody(u.arrest_date) > 90).length;
        const approaching = undertrials.filter(u => {
           const d = getDaysInCustody(u.arrest_date);
           return d > 60 && d <= 90;
        }).length;
        const noLawyer = undertrials.filter(u => !u.has_lawyer).length;
        
        setOverdueCount(overdue);
        setStatsData([
          { num: total, rawStr: '—', label: t('legal.totalUndertrials'), change: 'Local Fallback Mode', changeColor: '#e24b4a', numColor: GOLD },
          { num: overdue, rawStr: '—', label: t('legal.overdue'), change: 'Exceeding legal limit', changeColor: '#e24b4a', numColor: '#e24b4a' },
          { num: approaching, rawStr: '—', label: t('legal.approaching'), change: 'In next 30 days', changeColor: '#1d9e75', numColor: '#1d9e75' },
          { num: noLawyer, rawStr: '—', label: t('legal.noLawyer'), change: 'Need representation', changeColor: '#1d9e75', numColor: GOLD },
        ]);
      });
  }, [t]);

  // Build sidebar with dynamic overdue badge from state
  const sidebarWithBadge = sidebarSections.map(section => ({
    ...section,
    items: section.items.map(item => {
      if (item.label === 'Overdue Alerts') {
        return overdueCount != null && overdueCount > 0
          ? { ...item, badge: String(overdueCount) }
          : { ...item, badge: null };
      }
      return item;
    }),
  }));

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return t('legal.greeting', { timeOfDay: t('legal.morning') });
    if (hour < 17) return t('legal.greeting', { timeOfDay: t('legal.afternoon') });
    return t('legal.greeting', { timeOfDay: t('legal.evening') });
  }

  return (
    <PageWrapper style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-legal)', color: 'var(--text-legal)' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ display: 'flex', flex: 1, flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Sidebar */}
        <div style={{ width: isMobile ? '100%' : 220, background: 'var(--bg-card)',
          borderRight: isMobile ? 'none' : '1px solid rgba(212,168,67,0.08)',
          borderBottom: isMobile ? '1px solid rgba(212,168,67,0.08)' : 'none',
          padding: '1.5rem 1rem', display: 'flex',
          flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
          {sidebarWithBadge.map((section, si) => (
            <div key={si}>
              <div style={{ fontSize: '0.6rem', letterSpacing: 2,
                textTransform: 'uppercase', color: 'var(--text-dim)',
                padding: '0.8rem 0.6rem 0.3rem',
                marginTop: si > 0 ? '0.5rem' : 0 }}>{section.section}</div>
              {section.items.map((item, ii) => (
                <div key={ii} onClick={() => navigate(item.route)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10,
                    padding: '0.6rem 0.8rem', borderRadius: 8,
                    cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
                    color: item.active ? GOLD : 'var(--text-muted)',
                    background: item.active ? 'rgba(212,168,67,0.1)' : 'transparent',
                    borderLeft: item.active ? `2px solid ${GOLD}` : '2px solid transparent' }}
                  onMouseEnter={e => !item.active && (e.currentTarget.style.background = 'rgba(212,168,67,0.06)')}
                  onMouseLeave={e => !item.active && (e.currentTarget.style.background = 'transparent')}>
                  <span>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize: '0.6rem', padding: '2px 6px',
                      background: 'rgba(226,75,74,0.15)', color: '#f09595',
                      borderRadius: 10, border: '1px solid rgba(226,75,74,0.2)' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: isMobile ? '1.5rem' : '2rem', overflowY: 'auto' }}>
          <div style={{ marginBottom: '2rem', animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
              color: 'rgba(212,168,67,0.6)', marginBottom: '0.4rem' }}>{getGreeting()}</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.4rem',
              fontWeight: 700, color: 'var(--text-legal)', marginBottom: '0.3rem',
              background: 'linear-gradient(90deg, var(--text-legal), #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Legal Dashboard
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300 }}>
              Karnataka District Courts · Updated just now
            </p>
          </div>

          {/* Stats */}
          <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)',
            gap: '1rem', marginBottom: '2.5rem' }}>
            {statsData.map((s, i) => (
              <div key={i} className="glass-card" style={{ background: 'var(--bg-card)',
                border: '1px solid rgba(212,168,67,0.08)', borderRadius: 12, padding: '1.2rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '2rem', fontWeight: 600, color: s.numColor,
                  marginBottom: '0.2rem' }}>
                  <CountUp end={s.num} suffix={s.suffix} rawStr={s.rawStr} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                <div style={{ fontSize: '0.7rem', color: s.changeColor,
                  marginTop: '0.5rem', fontWeight: 500 }}>{s.change}</div>
              </div>
            ))}
          </div>

          {/* Tool Cards */}
          <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.2rem' }}>
            {tools.map((tool, i) => (
              <ToolCard key={i} t={tool} onClick={() => navigate(tool.route)} />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function ToolCard({ t, onClick }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div onClick={onClick}
      className="glass-card"
      style={{ background: t.alert ? 'rgba(226,75,74,0.03)' : 'var(--bg-card)',
        border: `1px solid ${t.alert ? 'rgba(226,75,74,0.2)' : 'rgba(212,168,67,0.08)'}`,
        borderRadius: 14, padding: '1.6rem', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: hovered ? `0 8px 30px ${t.alert ? 'rgba(226,75,74,0.15)' : 'rgba(212,168,67,0.1)'}` : 'none',
        transform: hovered ? 'translateY(-3px)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      
      {/* Shimmer sweep */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
        transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
        transition: 'transform 0.5s ease',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', marginBottom: '1rem', transition: 'transform 0.3s',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          background: t.alert ? 'rgba(226,75,74,0.08)' : 'rgba(212,168,67,0.08)',
          border: `1px solid ${t.alert ? 'rgba(226,75,74,0.2)' : 'rgba(212,168,67,0.15)'}` }}>
          {t.icon}
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 600,
          color: 'var(--text-legal)', marginBottom: '0.4rem' }}>{t.title}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)',
          lineHeight: 1.6, marginBottom: '1.2rem' }}>{t.desc}</div>
        <div style={{ fontSize: '0.8rem', color: t.ctaColor, fontWeight: 500,
          transition: 'transform 0.3s', transform: hovered ? 'translateX(5px)' : 'none' }}>
          {t.cta}
        </div>
      </div>
    </div>
  );
}