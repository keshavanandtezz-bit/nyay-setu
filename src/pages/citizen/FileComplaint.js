import { useState, useRef, useCallback, useEffect } from 'react';
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

/* ── Nearest police station data per district ────────────────────────── */
const POLICE_STATIONS = {
  'Bengaluru Urban': {
    name: 'Cubbon Park Police Station',
    address: 'Cubbon Park, Kasturba Road, Bengaluru - 560001',
    phone: '080-22942222',
    email: 'ps-cubbonpark@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Bengaluru Rural': {
    name: 'Anekal Town Police Station',
    address: 'Anekal Town, Bengaluru Rural - 562106',
    phone: '080-27832100',
    email: 'ps-anekal@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Mysuru': {
    name: 'Devaraja Police Station',
    address: 'Sayyaji Rao Road, Mysuru - 570001',
    phone: '0821-2444800',
    email: 'ps-devaraja@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Mangaluru': {
    name: 'Mangaluru North Police Station',
    address: 'Bunder, Mangaluru - 575001',
    phone: '0824-2220585',
    email: 'ps-mangalorenorth@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Hubballi-Dharwad': {
    name: 'Hubballi Suburban Police Station',
    address: 'Station Road, Hubballi - 580020',
    phone: '0836-2262400',
    email: 'ps-hublisuburban@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Belagavi': {
    name: 'Belagavi City Police Station',
    address: 'Fort Road, Belagavi - 590016',
    phone: '0831-2405233',
    email: 'ps-belgaumcity@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Kalaburagi': {
    name: 'Kalaburagi Town Police Station',
    address: 'Super Market, Kalaburagi - 585101',
    phone: '08472-278100',
    email: 'ps-gulbargatown@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Davanagere': {
    name: 'Davanagere Town Police Station',
    address: 'PJ Extension, Davanagere - 577002',
    phone: '08192-233100',
    email: 'ps-dvgtown@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Ballari': {
    name: 'Ballari Town Police Station',
    address: 'Fort Area, Ballari - 583101',
    phone: '08392-267100',
    email: 'ps-bellarytown@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Tumakuru': {
    name: 'Tumakuru Town Police Station',
    address: 'BH Road, Tumakuru - 572101',
    phone: '0816-2278100',
    email: 'ps-tumkurtown@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Shivamogga': {
    name: 'Shivamogga Town Police Station',
    address: 'Kuvempu Road, Shivamogga - 577201',
    phone: '08182-271100',
    email: 'ps-shimogatown@ksp.gov.in',
    helpline: '112 / 100',
  },
  'Raichur': {
    name: 'Raichur Town Police Station',
    address: 'Station Road, Raichur - 584101',
    phone: '08532-226100',
    email: 'ps-raichurtown@ksp.gov.in',
    helpline: '112 / 100',
  },
};

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [copyToast, setCopyToast] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

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
  // eslint-disable-next-line no-unused-vars
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

  /* ── Summarize complaint (step 3 -> 4) ──────────────────────────────── */
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

  /* ── Generate local e-FIR reference ────────────────────────────────── */
  function generateLocalEFIR() {
    const year = new Date().getFullYear();
    const distCode = (form.district || 'XX').substring(0, 3).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `eFIR-${distCode}-${year}-${rand}`;
  }

  /* ── Save complaint to localStorage ────────────────────────────────── */
  function saveToLocalStorage(caseId, payload) {
    try {
      const existing = JSON.parse(localStorage.getItem('nyaysetu_complaints') || '[]');
      existing.push({
        case_id: caseId,
        ...payload,
        filed_at: new Date().toISOString(),
        police_station: POLICE_STATIONS[payload.district]?.name || 'N/A',
      });
      localStorage.setItem('nyaysetu_complaints', JSON.stringify(existing));
    } catch (e) { /* silently ignore storage errors */ }
  }

  /* ── Submit — tries backend first, falls back to local ─────────────── */
  function handleSubmit() {
    setSubmitting(true);
    setSubmitError('');

    const complaintPayload = {
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
    };

    // Try backend first
    caseAPI.fileComplaint(complaintPayload)
      .then(data => {
        saveToLocalStorage(data.case_id || data.id, complaintPayload);
        setSubmitResult({
          case_id: data.case_id || data.id,
          source: 'server',
          police_station: POLICE_STATIONS[form.district] || null,
          filed_at: new Date().toISOString(),
        });
      })
      .catch(() => {
        // Backend failed — generate local e-FIR
        const localId = generateLocalEFIR();
        saveToLocalStorage(localId, complaintPayload);
        setSubmitResult({
          case_id: localId,
          source: 'local',
          police_station: POLICE_STATIONS[form.district] || null,
          filed_at: new Date().toISOString(),
        });
      })
      .finally(() => setSubmitting(false));
  }

  /* ── Download complaint as text ─────────────────────────────────────── */
  function downloadComplaint(caseId) {
    const ps = POLICE_STATIONS[form.district];
    const lines = [
      '======================================================',
      '           NYAY SETU - e-FIR COMPLAINT COPY',
      '======================================================',
      '',
      `Reference No: ${caseId}`,
      `Filed On:     ${new Date().toLocaleString('en-IN')}`,
      '',
      '-- INCIDENT ------------------------------------------',
      `Category:     ${form.category}`,
      `Description:  ${form.description}`,
      `Date:         ${form.date}`,
      `Location:     ${form.location}, ${form.district}`,
      '',
      '-- COMPLAINANT ---------------------------------------',
      `Name:         ${form.complainantName}`,
      `Phone:        ${form.phone}`,
      `Email:        ${form.email || 'N/A'}`,
      form.accusedName ? `Accused:      ${form.accusedName}` : '',
      '',
      '-- EVIDENCE ------------------------------------------',
      `Details:      ${form.evidenceDescription || 'None provided'}`,
      '',
      '-- NEAREST POLICE STATION ----------------------------',
      ps ? `Station:      ${ps.name}` : 'Station:      Not available',
      ps ? `Address:      ${ps.address}` : '',
      ps ? `Phone:        ${ps.phone}` : '',
      ps ? `Email:        ${ps.email}` : '',
      ps ? `Helpline:     ${ps.helpline}` : '',
      '',
      '-- IMPORTANT NOTICE ----------------------------------',
      'This is a digitally generated e-FIR reference from',
      'Nyay Setu. Please visit the above police station with',
      'this reference number and any physical evidence to',
      'complete the formal FIR process.',
      '',
      'Emergency: Dial 112 | Women Helpline: 181',
      '======================================================',
    ].filter(Boolean).join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nyay_Setu_eFIR_${caseId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
    background: 'rgba(29,158,117,0.06)', border: '1px solid rgba(29,158,117,0.18)',
    borderRadius: 10, padding: '1rem 1.2rem', marginTop: '1rem',
  };

  /* ── Success screen ────────────────────────────────────────────────── */
  if (submitResult) {
    const ps = submitResult.police_station;
    return (
      <PageWrapper style={{ minHeight: '100vh', background: 'var(--bg-citizen)', color: 'var(--text-citizen)' }}>
        <Navbar theme="green" showBack={true} />
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 2rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: 'rgba(29,158,117,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto 1.2rem',
              border: `2px solid ${C.green}`,
            }}>✅</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
              fontWeight: 700, color: 'var(--text-citizen)', margin: '0 0 0.5rem',
            }}>Complaint Registered Successfully</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {submitResult.source === 'server'
                ? 'Your complaint has been submitted to the Nyay Setu server and is being processed.'
                : 'Your complaint has been saved locally. Please visit the nearest police station below to complete the formal FIR.'}
            </p>
          </div>

          {/* e-FIR Reference */}
          <div style={{
            background: C.cardBg, border: `1px solid ${C.cardBorder}`,
            borderRadius: 12, padding: '1.4rem', marginBottom: '1.2rem', textAlign: 'center',
          }}>
            <div style={{
              fontSize: '0.68rem', letterSpacing: 1.5, textTransform: 'uppercase',
              color: C.green, marginBottom: 6,
            }}>Your e-FIR Reference Number</div>
            <div style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem',
              fontWeight: 700, color: C.greenLight, letterSpacing: 2,
            }}>
              {submitResult.case_id}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
              Filed on {new Date(submitResult.filed_at).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Nearest Police Station */}
          {ps && (
            <div style={{
              background: 'rgba(29,158,117,0.04)', border: `1px solid ${C.cardBorder}`,
              borderRadius: 12, padding: '1.4rem', marginBottom: '1.2rem',
            }}>
              <div style={{
                fontSize: '0.68rem', letterSpacing: 1.5, textTransform: 'uppercase',
                color: C.green, marginBottom: 10,
              }}>🏢 Nearest Police Station</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-citizen)', marginBottom: 8 }}>
                {ps.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <InfoRow icon="📍" label="Address" value={ps.address} />
                <InfoRow icon="📞" label="Phone" value={ps.phone} />
                <InfoRow icon="📧" label="Email" value={ps.email} />
                <InfoRow icon="🆘" label="Helpline" value={ps.helpline} />
              </div>
            </div>
          )}

          {/* What to do next */}
          <div style={{
            background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)',
            borderRadius: 12, padding: '1.2rem', marginBottom: '1.5rem',
          }}>
            <div style={{
              fontSize: '0.68rem', letterSpacing: 1.5, textTransform: 'uppercase',
              color: '#d4a843', marginBottom: 10,
            }}>📋 Next Steps</div>
            <ol style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-citizen)',
              lineHeight: 1.8, margin: 0 }}>
              <li>Download your e-FIR copy using the button below</li>
              <li>Visit <strong>{ps?.name || 'your nearest police station'}</strong> with this reference</li>
              <li>Carry any physical evidence (photos, documents, ID proof)</li>
              <li>The police will register the formal FIR and provide you an FIR number</li>
              <li>For emergencies, call <strong>112</strong> immediately</li>
            </ol>
          </div>

          {/* Action buttons */}
          <div style={{ position: 'relative', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {copyToast && (
              <div style={{
                position: 'absolute', top: '-2.5rem', left: '50%', transform: 'translateX(-50%)',
                background: C.green, color: '#fff', padding: '0.4rem 1rem',
                borderRadius: 6, fontSize: '0.8rem', fontWeight: 600,
                pointerEvents: 'none', whiteSpace: 'nowrap',
                animation: 'fadeInUp 0.2s ease-out',
              }}>✓ Copied!</div>
            )}
            <button
              onClick={() => downloadComplaint(submitResult.case_id)}
              style={{
                padding: '0.85rem 1.5rem', background: C.green, border: 'none',
                borderRadius: 8, color: '#fff', fontSize: '0.88rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Outfit',sans-serif", flex: 1,
              }}
            >📥 Download e-FIR Copy</button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(submitResult.case_id);
                setCopyToast(true);
                setTimeout(() => setCopyToast(false), 2000);
              }}
              style={{
                padding: '0.85rem 1.5rem', background: 'rgba(29,158,117,0.1)',
                border: `1px solid ${C.cardBorder}`, borderRadius: 8,
                color: C.green, fontSize: '0.88rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
              }}
            >📋 Copy Ref No.</button>
            <button
              onClick={() => navigate('/citizen')}
              style={{
                padding: '0.85rem 1.5rem', background: 'transparent',
                border: `1px solid ${C.cardBorder}`, borderRadius: 8,
                color: 'var(--text-citizen)', fontSize: '0.88rem', cursor: 'pointer',
                fontFamily: "'Outfit',sans-serif",
              }}
            >← Back to Portal</button>
          </div>
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

          {/* Step 1: What happened? */}
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

          {/* Step 2: When & Where */}
          {step === 1 && (
            <div>
              <h3 style={stepHeading}>{t('fileComplaint.step2Title')}</h3>
              <label style={labelStyle}>{t('fileComplaint.dateOfIncident')} *</label>
              <input
                type="date"
                value={form.date}
                max={new Date().toISOString().split('T')[0]}
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

              {/* Show nearest police station preview */}
              {form.district && POLICE_STATIONS[form.district] && (
                <div style={{
                  ...aiCardStyle, marginTop: '1rem',
                  background: 'rgba(29,158,117,0.04)',
                }}>
                  <div style={{ fontSize: '0.72rem', letterSpacing: 1, textTransform: 'uppercase', color: C.green, marginBottom: 6 }}>
                    🏢 Your nearest police station
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-citizen)' }}>
                    {POLICE_STATIONS[form.district].name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {POLICE_STATIONS[form.district].address} · {POLICE_STATIONS[form.district].phone}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: People Involved */}
          {step === 2 && (
            <div>
              <h3 style={stepHeading}>{t('fileComplaint.step3Title')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
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

          {/* Step 4: Evidence & Summary */}
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

          {/* Step 5: Review & Submit */}
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

              {/* Nearest police station in review */}
              {form.district && POLICE_STATIONS[form.district] && (
                <div style={{
                  background: 'rgba(29,158,117,0.04)', border: `1px solid ${C.cardBorder}`,
                  borderRadius: 10, padding: '1rem 1.2rem', marginBottom: '1rem',
                }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: 1.5, textTransform: 'uppercase', color: C.green, marginBottom: 6 }}>
                    🏢 Will be submitted to
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-citizen)' }}>
                    {POLICE_STATIONS[form.district].name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 3 }}>
                    {POLICE_STATIONS[form.district].address}
                  </div>
                </div>
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

              {ipcSuggestions && renderIPC()}
            </div>
          )}

          {/* Navigation buttons */}
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
                  minWidth: 180,
                }}
              >
                {submitting ? '⏳ Submitting...' : '📤 Submit to Nearest Station'}
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

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
      <span>{icon}</span>
      <span style={{ color: 'var(--text-muted)', minWidth: 60 }}>{label}:</span>
      <span style={{ color: 'var(--text-citizen)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

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
