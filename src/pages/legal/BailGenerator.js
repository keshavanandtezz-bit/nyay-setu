import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { undertrials, getDaysInCustody, getBailScore } from '../../data/undertrials';
import { aiAPI } from '../../services/api';

const GOLD = '#d4a843';
const BG = 'var(--bg-legal)';

export default function BailGenerator() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('id');
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = useState(preselectedId || '');
  const [generating, setGenerating] = useState(false);
  const [application, setApplication] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (preselectedId) setSelectedId(preselectedId);
  }, [preselectedId]);

  const selectedPrisoner = undertrials.find(u => u.id === selectedId);
  const days = selectedPrisoner ? getDaysInCustody(selectedPrisoner.arrest_date) : 0;
  const bailScore = selectedPrisoner ? getBailScore(selectedPrisoner) : 0;

  async function generateBailApplication() {
    if (!selectedPrisoner) return;
    setGenerating(true);
    setApplication('');
    setError('');

    try {
      const data = await aiAPI.generateBail({
        prisoner_name: selectedPrisoner.name,
        age: selectedPrisoner.age,
        prisoner_id: selectedPrisoner.prisoner_id,
        charges: selectedPrisoner.charges,
        ipc_sections: selectedPrisoner.ipc_sections,
        court: selectedPrisoner.court,
        district: selectedPrisoner.district,
        arrest_date: new Date(selectedPrisoner.arrest_date).toLocaleDateString('en-IN',
          { day: 'numeric', month: 'long', year: 'numeric' }),
        days_in_custody: days,
        has_prior_record: selectedPrisoner.prior_record || false,
        case_status: selectedPrisoner.case_status,
        lawyer: selectedPrisoner.lawyer,
      });

      if (data.success) {
        setApplication(data.application);
      } else {
        throw new Error('Generation failed. Please try again.');
      }
    } catch (err) {
      // Fallback: Generate local template if backend is dead
      const mockBail = `IN THE COURT OF THE PRINCIPAL DISTRICT AND SESSIONS JUDGE AT ${selectedPrisoner.district.toUpperCase()}

Bail Application No. _____ of ${new Date().getFullYear()}

BETWEEN:
${selectedPrisoner.name.toUpperCase()} ... APPLICANT/ACCUSED

AND:
STATE OF KARNATAKA ... COMPLAINANT/RESPONDENT

APPLICATION UNDER SECTION 439 OF THE CODE OF CRIMINAL PROCEDURE, 1973

The Applicant respectfully submits as under:

1. That the Applicant, aged ${selectedPrisoner.age} years, is an innocent citizen and has been falsely implicated in the present case involving charges of ${selectedPrisoner.charges} (under IPC Sections: ${selectedPrisoner.ipc_sections}).

2. That the Applicant was arrested on ${new Date(selectedPrisoner.arrest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} and has been languishing in custody for the past ${days} days without any substantive progress in the trial.

3. That the Applicant has deep roots in society and is not a flight risk. The Applicant undertakes to abide by all conditions imposed by this Hon'ble Court.

4. That prolonged incarceration without trial violates the fundamental right to life and liberty guaranteed under Article 21 of the Constitution of India.

PRAYER

Wherefore, it is most respectfully prayed that this Hon'ble Court may be pleased to enlarge the Applicant on bail in the interest of justice and equity.

Place: ${selectedPrisoner.district}
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

ADVOCATE FOR APPLICANT`;
      
      setApplication(mockBail);
      setError('Note: AI server is offline. Generated standard legal fallback template.');
    }
    setGenerating(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(application).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const scoreColor = bailScore >= 60 ? '#1d9e75'
    : bailScore >= 40 ? '#ef9f27' : '#e24b4a';
  const scoreLabel = bailScore >= 60
    ? 'Recommended — Grant Bail'
    : bailScore >= 40
    ? 'Consider Bail with Conditions'
    : 'High Risk — Bail May Be Denied';

  return (
    <PageWrapper style={{ minHeight: '100vh', background: BG, color: 'var(--text-legal)' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '1.5rem' : '2.5rem' }}>

        <div className="reveal-on-scroll" style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: 2,
            textTransform: 'uppercase', color: 'rgba(212,168,67,0.6)',
            marginBottom: '0.6rem' }}>AI Document Generator</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.6rem',
            fontWeight: 700, color: 'var(--text-legal)', marginBottom: '0.4rem',
            background: 'linear-gradient(90deg, var(--text-legal), #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('legal.bailGenerator')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            {t('legal.bailGeneratorDesc')}
          </p>
        </div>

        <div style={{ display: 'grid',
          gridTemplateColumns: application && !isMobile ? '1fr 1.6fr' : '1fr',
          gap: '2rem', alignItems: 'start' }}>

          <div className="stagger-children">
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,168,67,0.1)',
              borderRadius: 14, padding: '1.6rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: 2,
                textTransform: 'uppercase', color: 'rgba(212,168,67,0.6)',
                marginBottom: '1rem', fontWeight: 500 }}>Select Prisoner</div>
              <select
                value={selectedId}
                onChange={e => {
                  setSelectedId(e.target.value);
                  setApplication('');
                  setError('');
                }}
                style={{ width: '100%', padding: '1rem',
                  background: 'rgba(212,168,67,0.04)',
                  border: '1px solid rgba(212,168,67,0.2)',
                  borderRadius: 10,
                  color: selectedId ? 'var(--text-legal)' : 'var(--text-muted)',
                  fontSize: '0.9rem', fontFamily: "'Outfit',sans-serif",
                  outline: 'none', cursor: 'pointer', transition: 'box-shadow 0.3s' }}
                onFocus={e => e.target.style.boxShadow = '0 0 15px rgba(212,168,67,0.15)'}
                onBlur={e => e.target.style.boxShadow = 'none'}>
                <option value="" style={{ background: 'var(--bg-input)' }}>
                  — Select prisoner to generate bail —
                </option>
                {undertrials.map(u => {
                  const d = getDaysInCustody(u.arrest_date);
                  const s = d > 90 ? '🔴' : d > 60 ? '🟡' : '🟢';
                  return (
                    <option key={u.id} value={u.id}
                      style={{ background: 'var(--bg-input)' }}>
                      {s} {u.name} · {d} days
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedPrisoner && (
              <div style={{ background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(212,168,67,0.15)',
                borderRadius: 16, overflow: 'hidden', marginBottom: '1.5rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)', animation: 'fadeInScale 0.4s ease-out' }}>

                <div style={{ padding: '1.2rem 1.6rem',
                  borderBottom: '1px solid rgba(212,168,67,0.1)',
                  background: 'linear-gradient(135deg, rgba(212,168,67,0.05), rgba(212,168,67,0.02))' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-legal)' }}>
                    {selectedPrisoner.name}
                  </div>
                  <div style={{ fontSize: '0.75rem',
                    color: 'var(--text-muted)', marginTop: 4 }}>
                    Age {selectedPrisoner.age} · {selectedPrisoner.prisoner_id}
                  </div>
                </div>

                <div style={{ padding: '1.2rem 1.6rem' }}>
                  {[
                    { label: t('statusTracker.charges'), value: selectedPrisoner.charges },
                    { label: 'IPC Sections', value: selectedPrisoner.ipc_sections },
                    { label: t('statusTracker.daysInCustody'), value: `${days} days`, highlight: true },
                    { label: t('statusTracker.court'), value: selectedPrisoner.court },
                    { label: t('statusTracker.lawyer'), value: selectedPrisoner.lawyer,
                      warn: !selectedPrisoner.has_lawyer },
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '0.9rem' }}>
                      <div style={{ fontSize: '0.65rem', letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)', marginBottom: 3 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.85rem',
                        color: item.warn ? '#f09595'
                          : item.highlight ? GOLD : 'var(--text-muted)',
                        fontWeight: item.highlight ? 600 : 400 }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '1rem 1.6rem',
                  borderTop: '1px solid rgba(212,168,67,0.1)',
                  background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '0.6rem' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: 1.5,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)' }}>AI Bail Risk Score</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600,
                      color: scoreColor }}>{bailScore}/100</div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.08)',
                    borderRadius: 4, overflow: 'hidden', marginBottom: '0.6rem' }}>
                    <div style={{ height: '100%', borderRadius: 4,
                      width: 0, background: scoreColor,
                      animation: 'slideInLeft 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: scoreColor, fontWeight: 500 }}>
                    {scoreLabel}
                  </div>
                </div>
              </div>
            )}

            {selectedPrisoner && (
              <button
                onClick={generateBailApplication}
                disabled={generating}
                style={{ width: '100%', padding: '1.1rem',
                  background: generating ? 'rgba(212,168,67,0.3)' : 'linear-gradient(135deg, #d4a843, #e2bb61)',
                  border: 'none', borderRadius: 12, color: '#0d0c08',
                  fontFamily: "'Outfit',sans-serif", fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: generating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: generating ? 'none' : '0 4px 15px rgba(212,168,67,0.3)' }}
                onMouseEnter={e => {
                  if(!generating) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,168,67,0.4)';
                  }
                }}
                onMouseLeave={e => {
                  if(!generating) {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(212,168,67,0.3)';
                  }
                }}>
                {generating ? (
                  <span style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 10 }}>
                    <span style={{ display: 'inline-block', width: 16, height: 16,
                      border: '2px solid #0d0c08',
                      borderTopColor: 'transparent', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite' }} />
                    Drafting Application via AI...
                  </span>
                ) : (
                  application ? '↻ Regenerate Application' : 'Generate Bail Application →'
                )}
              </button>
            )}

            {error && (
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.2rem',
                background: 'rgba(226,75,74,0.08)',
                border: '1px solid rgba(226,75,74,0.25)',
                borderRadius: 10, color: '#f09595', fontSize: '0.85rem',
                animation: 'fadeInUp 0.3s ease-out' }}>
                ⚠ {error}
              </div>
            )}
          </div>

          {application && (
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,168,67,0.15)',
              borderRadius: 16, overflow: 'hidden', animation: 'fadeInScale 0.5s ease-out' }}>

              <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '1rem 1.6rem',
                borderBottom: '1px solid rgba(212,168,67,0.1)',
                background: 'rgba(212,168,67,0.05)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: 'rgba(212,168,67,0.7)', fontWeight: 500 }}>Generated Document</div>
                  <div style={{ fontSize: '0.75rem',
                    color: 'var(--text-muted)', marginTop: 4 }}>
                    Review before filing — add case number and sign
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={copyToClipboard}
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem',
                      background: copied
                        ? 'rgba(29,158,117,0.15)' : 'rgba(212,168,67,0.1)',
                      border: `1px solid ${copied
                        ? 'rgba(29,158,117,0.3)' : 'rgba(212,168,67,0.25)'}`,
                      borderRadius: 8,
                      color: copied ? '#1d9e75' : GOLD,
                      cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
                      transition: 'all 0.2s', fontWeight: 500 }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                    {copied ? '✓ Copied!' : 'Copy Text'}
                  </button>
                  <button onClick={() => window.print()}
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem',
                      background: 'transparent',
                      border: '1px solid rgba(212,168,67,0.2)',
                      borderRadius: 8, color: 'rgba(212,168,67,0.6)',
                      cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(212,168,67,0.1)';
                      e.currentTarget.style.color = GOLD;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(212,168,67,0.6)';
                    }}>
                    Print
                  </button>
                </div>
              </div>

              <div style={{ padding: '2rem', maxHeight: isMobile ? '50vh' : '65vh', overflowY: 'auto' }}>
                <pre style={{ fontFamily: 'Georgia, serif', fontSize: '0.88rem',
                  color: 'var(--text-muted)', lineHeight: 2,
                  whiteSpace: 'pre-wrap', wordWrap: 'break-word',
                  animation: 'fadeInUp 1s ease-out' }}>
                  {application}
                </pre>
              </div>

              <div style={{ padding: '0.9rem 1.6rem',
                borderTop: '1px solid rgba(212,168,67,0.1)',
                fontSize: '0.75rem', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.1)' }}>
                <span style={{ color: GOLD }}>⚠</span>
                <span>AI-generated draft. Review carefully, add correct case number,
                  obtain client signature before filing.</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </PageWrapper>
  );
}