import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { undertrials, getDaysInCustody, getBailScore } from '../../data/undertrials';
import { aiAPI } from '../../services/api';

const GOLD = '#d4a843';
const BG = '#0d0c08';

export default function BailGenerator() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('id');

  const [selectedId, setSelectedId] = useState(preselectedId || '');
  const [generating, setGenerating] = useState(false);
  const [application, setApplication] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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
      setError(err.message || 'Could not generate application. Make sure the backend is running on port 8000.');
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
    <div style={{ minHeight: '100vh', background: BG, color: '#e8e0cc' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 2.5rem' }}>

        <div style={{ marginBottom: '1.8rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: 2,
            textTransform: 'uppercase', color: 'rgba(212,168,67,0.6)',
            marginBottom: '0.4rem' }}>AI Document Generator</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
            fontWeight: 700, color: '#e8e0cc', marginBottom: '0.3rem' }}>
            Bail Application Generator
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(232,224,204,0.4)', fontWeight: 300 }}>
            Select a prisoner — AI generates a complete, court-ready bail application in seconds
          </p>
        </div>

        <div style={{ display: 'grid',
          gridTemplateColumns: application ? '1fr 1.6fr' : '1fr',
          gap: '1.5rem', alignItems: 'start' }}>

          <div>
            <div style={{ background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,168,67,0.1)',
              borderRadius: 12, padding: '1.4rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: 2,
                textTransform: 'uppercase', color: 'rgba(212,168,67,0.5)',
                marginBottom: '0.8rem' }}>Select Prisoner</div>
              <select
                value={selectedId}
                onChange={e => {
                  setSelectedId(e.target.value);
                  setApplication('');
                  setError('');
                }}
                style={{ width: '100%', padding: '0.8rem 1rem',
                  background: 'rgba(212,168,67,0.04)',
                  border: '1px solid rgba(212,168,67,0.18)',
                  borderRadius: 8,
                  color: selectedId ? '#e8e0cc' : 'rgba(232,224,204,0.35)',
                  fontSize: '0.85rem', fontFamily: "'Outfit',sans-serif",
                  outline: 'none', cursor: 'pointer' }}>
                <option value="" style={{ background: '#1a1408' }}>
                  — Select prisoner —
                </option>
                {undertrials.map(u => {
                  const d = getDaysInCustody(u.arrest_date);
                  const s = d > 90 ? '🔴' : d > 60 ? '🟡' : '🟢';
                  return (
                    <option key={u.id} value={u.id}
                      style={{ background: '#1a1408' }}>
                      {s} {u.name} · {d} days
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedPrisoner && (
              <div style={{ background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(212,168,67,0.1)',
                borderRadius: 12, overflow: 'hidden', marginBottom: '1rem' }}>

                <div style={{ padding: '1rem 1.4rem',
                  borderBottom: '1px solid rgba(212,168,67,0.08)',
                  background: 'rgba(212,168,67,0.04)' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '1.2rem', fontWeight: 700, color: '#e8e0cc' }}>
                    {selectedPrisoner.name}
                  </div>
                  <div style={{ fontSize: '0.72rem',
                    color: 'rgba(232,224,204,0.4)', marginTop: 2 }}>
                    Age {selectedPrisoner.age} · {selectedPrisoner.prisoner_id}
                  </div>
                </div>

                <div style={{ padding: '1rem 1.4rem' }}>
                  {[
                    { label: 'Charges', value: selectedPrisoner.charges },
                    { label: 'IPC Sections', value: selectedPrisoner.ipc_sections },
                    { label: 'Days in Custody', value: `${days} days`, highlight: true },
                    { label: 'Court', value: selectedPrisoner.court },
                    { label: 'Lawyer', value: selectedPrisoner.lawyer,
                      warn: !selectedPrisoner.has_lawyer },
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '0.7rem' }}>
                      <div style={{ fontSize: '0.6rem', letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        color: 'rgba(232,224,204,0.3)', marginBottom: 2 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.82rem',
                        color: item.warn ? '#f09595'
                          : item.highlight ? GOLD : 'rgba(232,224,204,0.7)',
                        fontWeight: item.highlight ? 600 : 400 }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '0.9rem 1.4rem',
                  borderTop: '1px solid rgba(212,168,67,0.08)',
                  background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.6rem', letterSpacing: 1.5,
                      textTransform: 'uppercase',
                      color: 'rgba(232,224,204,0.3)' }}>AI Bail Risk Score</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600,
                      color: scoreColor }}>{bailScore}/100</div>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)',
                    borderRadius: 3, overflow: 'hidden', marginBottom: '0.4rem' }}>
                    <div style={{ height: '100%', borderRadius: 3,
                      width: `${bailScore}%`, background: scoreColor,
                      transition: 'width 0.5s ease' }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: scoreColor }}>
                    {scoreLabel}
                  </div>
                </div>
              </div>
            )}

            {selectedPrisoner && (
              <button
                onClick={generateBailApplication}
                disabled={generating}
                style={{ width: '100%', padding: '0.9rem',
                  background: generating ? 'rgba(212,168,67,0.3)' : GOLD,
                  border: 'none', borderRadius: 10, color: '#0d0c08',
                  fontFamily: "'Outfit',sans-serif", fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: generating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s' }}>
                {generating ? (
                  <span style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 14, height: 14,
                      border: '2px solid #0d0c08',
                      borderTopColor: 'transparent', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite' }} />
                    Generating Application...
                  </span>
                ) : (
                  application ? '↻ Regenerate Application' : 'Generate Bail Application →'
                )}
              </button>
            )}

            {error && (
              <div style={{ marginTop: '1rem', padding: '0.8rem 1rem',
                background: 'rgba(226,75,74,0.08)',
                border: '1px solid rgba(226,75,74,0.25)',
                borderRadius: 8, color: '#f09595', fontSize: '0.8rem' }}>
                ⚠ {error}
              </div>
            )}
          </div>

          {application && (
            <div style={{ background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,168,67,0.15)',
              borderRadius: 12, overflow: 'hidden' }}>

              <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '0.8rem 1.2rem',
                borderBottom: '1px solid rgba(212,168,67,0.1)',
                background: 'rgba(212,168,67,0.04)' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: 'rgba(212,168,67,0.6)' }}>Generated Document</div>
                  <div style={{ fontSize: '0.72rem',
                    color: 'rgba(232,224,204,0.35)', marginTop: 2 }}>
                    Review before filing — add case number and sign
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={copyToClipboard}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.75rem',
                      background: copied
                        ? 'rgba(29,158,117,0.15)' : 'rgba(212,168,67,0.1)',
                      border: `1px solid ${copied
                        ? 'rgba(29,158,117,0.3)' : 'rgba(212,168,67,0.25)'}`,
                      borderRadius: 6,
                      color: copied ? '#1d9e75' : GOLD,
                      cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
                      transition: 'all 0.2s' }}>
                    {copied ? '✓ Copied!' : 'Copy Text'}
                  </button>
                  <button onClick={() => window.print()}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.75rem',
                      background: 'transparent',
                      border: '1px solid rgba(212,168,67,0.15)',
                      borderRadius: 6, color: 'rgba(212,168,67,0.5)',
                      cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                    Print
                  </button>
                </div>
              </div>

              <div style={{ padding: '1.4rem', maxHeight: '70vh', overflowY: 'auto' }}>
                <pre style={{ fontFamily: 'Georgia, serif', fontSize: '0.82rem',
                  color: 'rgba(232,224,204,0.8)', lineHeight: 1.9,
                  whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {application}
                </pre>
              </div>

              <div style={{ padding: '0.7rem 1.2rem',
                borderTop: '1px solid rgba(212,168,67,0.08)',
                fontSize: '0.7rem', color: 'rgba(232,224,204,0.25)',
                display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>⚠</span>
                <span>AI-generated draft. Review carefully, add correct case number,
                  obtain client signature before filing.</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}