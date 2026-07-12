import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import StepWizard from '../../components/StepWizard';
import { caseAPI, aiAPI } from '../../services/api';

/* ── Constants ───────────────────────────────────────────────────────── */
const C = {
  bg: 'var(--bg-citizen)', text: 'var(--text-citizen)', sub: 'var(--text-muted)',
  green: '#1d9e75', greenLight: '#2ed89c',
  cardBg: 'rgba(29,158,117,0.05)', cardBorder: 'rgba(29,158,117,0.12)',
  inputBg: 'rgba(29,158,117,0.06)', inputBorder: 'rgba(29,158,117,0.2)',
};

const CATEGORIES = [
  'Theft', 'Assault', 'Fraud/Cheating', 'Domestic Violence', 'Cybercrime',
  'Robbery', 'Murder/Attempt', 'Drug Offense', 'Property Dispute', 'Other',
];

const DISTRICTS = [
  'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru',
  'Hubballi-Dharwad', 'Belagavi', 'Kalaburagi', 'Davanagere',
  'Ballari', 'Tumakuru', 'Shivamogga', 'Raichur',
];

/* ── Shared input style ──────────────────────────────────────────────── */
const inputStyle = {
  width: '100%', boxSizing: 'border-box', background: 'var(--bg-input)',
  border: `1px solid ${C.inputBorder}`, borderRadius: 8, outline: 'none',
  padding: '0.8rem 1rem', fontSize: '0.88rem', color: 'var(--text-citizen)',
  fontFamily: "'Outfit',sans-serif",
};
const selectStyle = { ...inputStyle, appearance: 'none', cursor: 'pointer' };
const labelStyle = {
  display: 'block', fontSize: '0.75rem', letterSpacing: 1,
  textTransform: 'uppercase', color: 'rgba(29,158,117,0.7)', marginBottom: 6,
};

/* ── Component ──────────────────────────────────────────────────────── */
export default function FileComplaint() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const STEPS = [
    { title: t('fileComplaint.step1Title'), description: t('fileComplaint.step1Desc') },
    { title: t('fileComplaint.step2Title'), description: t('fileComplaint.step2Desc') },
    { title: t('fileComplaint.step3Title'), description: t('fileComplaint.step3Desc') },
    { title: t('fileComplaint.step4Title'), description: t('fileComplaint.step4Desc') },
    { title: t('fileComplaint.step5Title'), description: t('fileComplaint.step5Desc') },
  ];

  /* Form data */
  const [form, setForm] = useState({
    description: '', category: '',
    date: '', location: '', district: '',
    complainantName: '', phone: '', email: '',
    accusedName: '', evidenceDescription: '',
  });

  /* AI state */
  const [ipcSuggestions, setIpcSuggestions] = useState(null);
  const [ipcLoading, setIpcLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  /* Submit state */
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState('');

  /* Debounce ref for IPC */
  const ipcTimerRef = useRef(null);

  /* ── Updaters ──────────────────────────────────────────────────────── */
  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  /* ── IPC auto-suggest on description blur ──────────────────────────── */
  function handleDescriptionBlur() {
    const desc = form.description.trim();
    if (desc.length < 20) return;
    if (ipcTimerRef.current) clearTimeout(ipcTimerRef.current);
    ipcTimerRef.current = setTimeout(() => {
      setIpcLoading(true);
      aiAPI.suggestIPC(desc)
        .then(data => setIpcSuggestions(data))
        .catch(() => setIpcSuggestions(null))
        .finally(() => setIpcLoading(false));
    }, 400);
  }

  /* ── Summarize complaint (step 3 → 4) ──────────────────────────────── */
  function generateSummary() {
    setAiSummaryLoading(true);
    aiAPI.summarizeComplaint({
      description: form.description,
      category: form.category,
      incident_date: form.date,
      location: form.location,
      district: form.district,
      complainant_name: form.complainantName,
      phone: form.phone,
      accused_name: form.accusedName,
      evidence_description: form.evidenceDescription,
    })
      .then(data => setAiSummary(data))
      .catch(() => setAiSummary(null))
      .finally(() => setAiSummaryLoading(false));
  }

  /* ── Submit ────────────────────────────────────────────────────────── */
  function handleSubmit() {
    setSubmitting(true);
    setSubmitError('');
    caseAPI.fileComplaint({
      description: form.description,
      category: form.category,
      incident_date: form.date,
      location: form.location,
      district: form.district,
      complainant_name: form.complainantName,
      phone: form.phone,
      email: form.email,
      accused_name: form.accusedName,
      evidence_description: form.evidenceDescription,
      ai_summary: aiSummary?.summary || '',
      suggested_ipc: ipcSuggestions?.sections || [],
    })
      .then(data => setSubmitResult(data))
      .catch(err => setSubmitError(err.message || 'Submission failed'))
      .finally(() => setSubmitting(false));
  }

  /* ── Navigation ────────────────────────────────────────────────────── */
  function next() {
    if (step === 3) generateSummary();
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  }
  function prev() { setStep(s => Math.max(s - 1, 0)); }

  /* ── Validation ────────────────────────────────────────────────────── */
  function canProceed() {
    switch (step) {
      case 0: return form.description.trim().length >= 20 && form.category;
      case 1: return form.date && form.location.trim() && form.district;
      case 2: return form.complainantName.trim() && form.phone.trim();
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  }

  /* ── Render helpers ────────────────────────────────────────────────── */
  function renderIPC() {
    if (ipcLoading) return (
      <div style={{ ...aiCardStyle, color: 'var(--text-muted)' }}>🤖 {t('fileComplaint.aiSuggesting')}</div>
    );
    if (!ipcSuggestions) return null;
    const sections = ipcSuggestions?.sections || ipcSuggestions?.suggested_sections || [];
    return (
      <div style={aiCardStyle}>
        <div style={{ fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase', color: C.green, marginBottom: 8 }}>
          🤖 AI-Suggested IPC Sections
        </div>
        {sections.length > 0 ? sections.map((s, i) => (
          <div key={i} style={{
            background: 'rgba(29,158,117,0.08)', borderRadius: 6,
            padding: '0.5rem 0.8rem', marginBottom: 6, fontSize: '0.82rem', color: 'var(--text-citizen)',
          }}>
            <strong style={{ color: C.greenLight }}>Section {s.section || s}:</strong>{' '}
            {s.description || s.title || ''}
          </div>
        )) : (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {ipcSuggestions?.summary || 'No specific sections identified. A legal expert will review.'}
          </div>
        )}
      </div>
    );
  }

  const aiCardStyle = {
    background: 'rgba(29,158,117,0.06)', border: `1px solid rgba(29,158,117,0.18)`,
    borderRadius: 10, padding: '1rem 1.2rem', marginTop: '1rem',
  };

  /* ── Success screen ────────────────────────────────────────────────── */
  if (submitResult) {
    return (
      <PageWrapper style={{ minHeight: '100vh', background: 'var(--bg-citizen)', color: 'var(--text-citizen)' }}>
        <Navbar theme="green" showBack={true} />
        <div style={{ maxWidth: 560, margin: '3rem auto', textAlign: 'center', padding: '0 2rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'rgba(29,158,117,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 1.5rem',
            border: `2px solid ${C.green}`,
          }}>✅</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
            fontWeight: 700, color: 'var(--text-citizen)', margin: '0 0 0.5rem',
          }}>{t('fileComplaint.successTitle')}</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {t('fileComplaint.successMsg')}
          </p>
          <div style={{
            background: C.cardBg, border: `1px solid ${C.cardBorder}`,
            borderRadius: 12, padding: '1.4rem', marginBottom: '1.5rem',
          }}>
            <div style={{
              fontSize: '0.68rem', letterSpacing: 1.5, textTransform: 'uppercase',
              color: C.green, marginBottom: 6,
            }}>Your Case ID</div>
            <div style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem',
              fontWeight: 700, color: C.greenLight, letterSpacing: 2,
            }}>
              {submitResult.case_id || submitResult.id || 'Assigned'}
            </div>
          </div>
          <button
            onClick={() => navigate(`/citizen/case/${submitResult.case_id || submitResult.id}`)}
            style={{
              padding: '0.85rem 2rem', background: C.green, border: 'none',
              borderRadius: 8, color: '#fff', fontSize: '0.9rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
              marginRight: '0.8rem',
            }}
          >{t('fileComplaint.trackNow')}</button>
          <button
            onClick={() => navigate('/citizen/nyay-yatra')}
            style={{
              padding: '0.85rem 2rem', background: 'transparent',
              border: `1px solid ${C.cardBorder}`, borderRadius: 8,
              color: 'var(--text-citizen)', fontSize: '0.9rem', cursor: 'pointer',
              fontFamily: "'Outfit',sans-serif",
            }}
          >Back to Portal</button>
        </div>
      </PageWrapper>
    );
  }

  /* ── Main form ─────────────────────────────────────────────────────── */
  return (
    <PageWrapper style={{ minHeight: '100vh', background: 'var(--bg-citizen)', color: 'var(--text-citizen)' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 2rem 3rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
            color: C.green, marginBottom: '0.4rem',
          }}>{t('fileComplaint.title')}</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
            fontWeight: 700, color: 'var(--text-citizen)', margin: 0,
          }}>Guided Complaint Filing</h1>
        </div>

        {/* Stepper */}
        <StepWizard steps={STEPS} currentStep={step} onStepClick={i => i < step && setStep(i)} />

        {/* Step content */}
        <div style={{
          background: C.cardBg, border: `1px solid ${C.cardBorder}`,
          borderRadius: 14, padding: '1.8rem',
        }}>

          {/* ── Step 1: What happened? ─────────────────────────────── */}
          {step === 0 && (
            <div>
              <h3 style={stepHeading}>{t('fileComplaint.step1Title')}</h3>
              <label style={labelStyle}>{t('fileComplaint.category')} *</label>
              <select
                value={form.category}
                onChange={e => updateField('category', e.target.value)}
                style={selectStyle}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <div style={{ marginTop: '1rem' }}>
                <label style={labelStyle}>{t('fileComplaint.incidentDesc')} *</label>
                <textarea
                  value={form.description}
                  onChange={e => updateField('description', e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder="Describe the incident in detail (minimum 20 characters). AI will suggest applicable IPC sections…"
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {form.description.length} characters
                </div>
              </div>

              {renderIPC()}
            </div>
          )}

          {/* ── Step 2: When & Where ───────────────────────────────── */}
          {step === 1 && (
            <div>
              <h3 style={stepHeading}>{t('fileComplaint.step2Title')}</h3>
              <label style={labelStyle}>{t('fileComplaint.dateOfIncident')} *</label>
              <input
                type="date"
                value={form.date}
                onChange={e => updateField('date', e.target.value)}
                style={inputStyle}
              />

              <div style={{ marginTop: '1rem' }}>
                <label style={labelStyle}>{t('fileComplaint.location')} *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => updateField('location', e.target.value)}
                  placeholder="Street, area, landmark…"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={labelStyle}>{t('fileComplaint.district')} *</label>
                <select
                  value={form.district}
                  onChange={e => updateField('district', e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Select district…</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── Step 3: People Involved ────────────────────────────── */}
          {step === 2 && (
            <div>
              <h3 style={stepHeading}>{t('fileComplaint.step3Title')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>{t('fileComplaint.complainantName')} *</label>
                  <input type="text" value={form.complainantName}
                    onChange={e => updateField('complainantName', e.target.value)}
                    placeholder="Full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t('fileComplaint.phone')} *</label>
                  <input type="tel" value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    placeholder="10-digit number" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email (optional)</label>
                  <input type="email" value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="email@example.com" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t('fileComplaint.accusedName')} (optional)</label>
                  <input type="text" value={form.accusedName}
                    onChange={e => updateField('accusedName', e.target.value)}
                    placeholder="If known" style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Evidence & Summary ─────────────────────────── */}
          {step === 3 && (
            <div>
              <h3 style={stepHeading}>{t('fileComplaint.step4Title')}</h3>
              <label style={labelStyle}>{t('fileComplaint.evidenceDesc')}</label>
              <textarea
                value={form.evidenceDescription}
                onChange={e => updateField('evidenceDescription', e.target.value)}
                placeholder="Describe any evidence: photos, CCTV footage, witnesses, documents…"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              />

              {/* Info summary card */}
              <div style={{
                ...aiCardStyle, marginTop: '1.2rem',
                background: 'rgba(29,158,117,0.04)',
              }}>
                <div style={{ fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase', color: C.green, marginBottom: 8 }}>
                  📋 Complaint Summary
                </div>
                <SummaryRow label="Category" value={form.category} />
                <SummaryRow label="Description" value={form.description.slice(0, 100) + (form.description.length > 100 ? '…' : '')} />
                <SummaryRow label="Date" value={form.date} />
                <SummaryRow label="Location" value={`${form.location}, ${form.district}`} />
                <SummaryRow label="Complainant" value={`${form.complainantName} · ${form.phone}`} />
                {form.accusedName && <SummaryRow label="Accused" value={form.accusedName} />}
              </div>

              {/* AI summary */}
              {aiSummaryLoading && (
                <div style={{ ...aiCardStyle, color: 'var(--text-muted)' }}>🤖 {t('fileComplaint.aiSuggesting')}</div>
              )}
              {aiSummary && (
                <div style={aiCardStyle}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase', color: C.green, marginBottom: 8 }}>
                    🤖 AI Legal Summary
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-citizen)', lineHeight: 1.7 }}>
                    {aiSummary.summary || aiSummary.legal_summary || JSON.stringify(aiSummary)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 5: Review & Submit ────────────────────────────── */}
          {step === 4 && (
            <div>
              <h3 style={stepHeading}>{t('fileComplaint.step5Title')}</h3>

              <div style={{
                background: 'rgba(29,158,117,0.04)', border: `1px solid ${C.cardBorder}`,
                borderRadius: 10, padding: '1.2rem', marginBottom: '1rem',
              }}>
                <ReviewSection title="Incident">
                  <SummaryRow label="Category" value={form.category} />
                  <SummaryRow label="Description" value={form.description} />
                </ReviewSection>
                <ReviewSection title="When & Where">
                  <SummaryRow label="Date" value={form.date} />
                  <SummaryRow label="Location" value={form.location} />
                  <SummaryRow label="District" value={form.district} />
                </ReviewSection>
                <ReviewSection title="People">
                  <SummaryRow label="Complainant" value={form.complainantName} />
                  <SummaryRow label="Phone" value={form.phone} />
                  {form.email && <SummaryRow label="Email" value={form.email} />}
                  {form.accusedName && <SummaryRow label="Accused" value={form.accusedName} />}
                </ReviewSection>
                {form.evidenceDescription && (
                  <ReviewSection title="Evidence">
                    <SummaryRow label="Details" value={form.evidenceDescription} />
                  </ReviewSection>
                )}
              </div>

              {/* AI summary */}
              {aiSummary && (
                <div style={aiCardStyle}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase', color: C.green, marginBottom: 8 }}>
                    🤖 AI Legal Summary
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-citizen)', lineHeight: 1.7 }}>
                    {aiSummary.summary || aiSummary.legal_summary || JSON.stringify(aiSummary)}
                  </div>
                </div>
              )}

              {/* IPC sections */}
              {ipcSuggestions && renderIPC()}

              {submitError && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 8, padding: '0.7rem 1rem', marginTop: '1rem',
                  fontSize: '0.82rem', color: '#f87171',
                }}>
                  ⚠️ {submitError}
                </div>
              )}
            </div>
          )}

          {/* ── Navigation buttons ───────────────────────────────── */}
          <div style={{
            display: 'flex', justifyContent: step === 0 ? 'flex-end' : 'space-between',
            marginTop: '1.8rem', gap: '0.8rem',
          }}>
            {step > 0 && (
              <button onClick={prev} style={btnSecondary}>← Previous</button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                disabled={!canProceed()}
                style={{
                  ...btnPrimary,
                  opacity: canProceed() ? 1 : 0.45,
                  cursor: canProceed() ? 'pointer' : 'not-allowed',
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  ...btnPrimary,
                  background: submitting ? 'rgba(29,158,117,0.5)' : C.green,
                  cursor: submitting ? 'wait' : 'pointer',
                  minWidth: 160,
                }}
              >
                {submitting ? t('fileComplaint.submitting') : `📤 ${t('fileComplaint.submitComplaint')}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

/* ── Small helpers ───────────────────────────────────────────────────── */
const stepHeading = {
  fontFamily: "'Cormorant Garamond',serif", fontSize: '1.35rem',
  fontWeight: 700, color: 'var(--text-citizen)', margin: '0 0 1.2rem',
};

const btnPrimary = {
  padding: '0.8rem 1.8rem', background: '#1d9e75', border: 'none',
  borderRadius: 8, color: '#fff', fontSize: '0.88rem', fontWeight: 600,
  fontFamily: "'Outfit',sans-serif", cursor: 'pointer', transition: 'all 0.2s',
};

const btnSecondary = {
  padding: '0.8rem 1.8rem', background: 'transparent',
  border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8,
  color: 'var(--text-citizen)', fontSize: '0.88rem', fontFamily: "'Outfit',sans-serif",
  cursor: 'pointer', transition: 'all 0.2s',
};

function SummaryRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: '0.82rem' }}>
      <span style={{ color: 'var(--text-muted)', minWidth: 90, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: 'var(--text-citizen)', lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase',
        color: '#1d9e75', marginBottom: 6, paddingBottom: 4,
        borderBottom: '1px solid rgba(29,158,117,0.1)',
      }}>{title}</div>
      {children}
    </div>
  );
}
