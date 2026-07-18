import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import CaseTimeline from '../../components/CaseTimeline';
import { caseAPI, aiAPI } from '../../services/api';

/* ── Constants ───────────────────────────────────────────────────────── */
const C = {
  bg: 'var(--bg-citizen)', text: 'var(--text-citizen)', sub: 'var(--text-muted)',
  green: '#1d9e75', greenLight: '#2ed89c',
  blue: '#3b82f6',
  cardBg: 'rgba(29,158,117,0.05)', cardBorder: 'rgba(29,158,117,0.12)',
  inputBg: 'rgba(29,158,117,0.06)', inputBorder: 'rgba(29,158,117,0.2)',
};

/* ── Component ──────────────────────────────────────────────────────── */
export default function CaseJourney() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const STAGE_LABELS = {
    complaint_filed: t('nyayYatra.stages.complaint_filed'),
    fir_registered: t('nyayYatra.stages.fir_registered'),
    investigation: t('nyayYatra.stages.investigation'),
    chargesheet_filed: t('nyayYatra.stages.chargesheet_filed'),
    court_hearing: t('nyayYatra.stages.court_hearing'),
    judgment: t('nyayYatra.stages.judgment'),
    appeal: t('nyayYatra.stages.appeal'),
    closed: t('nyayYatra.stages.closed'),
  };

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* AI Advisor */
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  /* Documents */
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  /* Fetch case on mount */
  useEffect(() => {
    setLoading(true);
    setError('');
    caseAPI.getCase(caseId)
      .then(data => {
        setCaseData(data);
        /* Also fetch documents */
        setDocsLoading(true);
        caseAPI.getDocuments(caseId)
          .then(docs => setDocuments(Array.isArray(docs) ? docs : docs?.documents || []))
          .catch(() => setDocuments(data?.documents || []))
          .finally(() => setDocsLoading(false));
      })
      .catch(err => setError(err.message || 'Failed to load case'))
      .finally(() => setLoading(false));
  }, [caseId]);

  /* Ask AI advisor */
  function askAdvisor() {
    const q = question.trim();
    if (!q) return;
    setAiLoading(true);
    setAiError('');
    aiAPI.caseAdvisor(caseId, caseData?.current_stage || '', q)
      .then(data => setAiResponse(data))
      .catch(err => setAiError(err.message || 'AI advisor failed'))
      .finally(() => setAiLoading(false));
  }

  /* ── Loading state ─────────────────────────────────────────────────── */
  if (loading) {
    return (
      <PageWrapper style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
        <Navbar theme="green" showBack={true} />
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{
            width: 44, height: 44, border: `3px solid ${C.cardBorder}`,
            borderTopColor: C.green, borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }} />
          <div style={{ fontSize: '0.9rem', color: C.sub }}>{t('common.loading')} {caseId}…</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </PageWrapper>
    );
  }

  /* ── Error state ───────────────────────────────────────────────────── */
  if (error) {
    return (
      <PageWrapper style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
        <Navbar theme="green" showBack={true} />
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem',
            fontWeight: 700, color: C.text, margin: '0 0 0.5rem',
          }}>{t('common.error')}</h2>
          <p style={{ fontSize: '0.88rem', color: C.sub, marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => navigate('/citizen/nyay-yatra')}
            style={{
              padding: '0.75rem 1.6rem', background: C.green, border: 'none',
              borderRadius: 8, color: '#fff', fontSize: '0.88rem',
              fontFamily: "'Outfit',sans-serif", cursor: 'pointer',
            }}
          >← Back to Nyay Yatra</button>
        </div>
      </PageWrapper>
    );
  }

  const stages = caseData?.stages || caseData?.timeline || [];
  const currentStage = caseData?.current_stage || 'complaint_filed';
  const allDocs = documents.length > 0 ? documents : (caseData?.documents || []);

  /* ── Main render ───────────────────────────────────────────────────── */
  return (
    <PageWrapper style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 2rem 3rem' }}>
        {/* ── Header ────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
        }}>
          <div>
            <div style={{
              fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
              color: C.green, marginBottom: '0.4rem',
            }}>{t('caseJourney.title')}</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
              fontWeight: 700, color: C.text, margin: 0, lineHeight: 1.2,
            }}>
              {caseData?.complainant_name || 'Case Details'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Case ID badge */}
            <span style={{
              fontSize: '0.72rem', letterSpacing: 1, padding: '4px 12px',
              borderRadius: 20, background: 'rgba(29,158,117,0.1)',
              border: `1px solid ${C.cardBorder}`, color: C.greenLight,
              fontWeight: 600, fontFamily: "'Outfit',sans-serif",
            }}>
              {caseId}
            </span>
            {/* Status badge */}
            <span style={{
              fontSize: '0.68rem', letterSpacing: 1, textTransform: 'uppercase',
              padding: '4px 12px', borderRadius: 20, fontWeight: 600,
              background: currentStage === 'closed' ? 'rgba(29,158,117,0.12)' : 'rgba(59,130,246,0.1)',
              border: `1px solid ${currentStage === 'closed' ? 'rgba(29,158,117,0.25)' : 'rgba(59,130,246,0.25)'}`,
              color: currentStage === 'closed' ? C.green : C.blue,
            }}>
              {STAGE_LABELS[currentStage] || currentStage}
            </span>
          </div>
        </div>

        {/* ── Info cards ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '0.8rem', marginBottom: '2rem' }}>
          {caseData?.category && (
            <InfoCard label="Category" value={caseData.category} icon="📁" />
          )}
          {caseData?.district && (
            <InfoCard label="District" value={caseData.district} icon="📍" />
          )}
          {caseData?.incident_date && (
            <InfoCard label="Incident Date" value={new Date(caseData.incident_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} icon="📅" />
          )}
          {caseData?.phone && (
            <InfoCard label="Phone" value={caseData.phone} icon="📞" />
          )}
        </div>

        {/* ── Timeline ───────────────────────────────────────────────── */}
        <div style={{
          background: C.cardBg, border: `1px solid ${C.cardBorder}`,
          borderRadius: 14, padding: '1.8rem 1.5rem 1.5rem 2.5rem', marginBottom: '2rem',
        }}>
          <div style={{
            fontSize: '0.72rem', letterSpacing: 1.5, textTransform: 'uppercase',
            color: C.green, marginBottom: '1.2rem',
          }}>
            ⚖️ {t('caseJourney.timeline')}
          </div>
          <CaseTimeline stages={stages} currentStage={currentStage} />
        </div>

        {/* ── Documents ──────────────────────────────────────────────── */}
        <div style={{
          background: C.cardBg, border: `1px solid ${C.cardBorder}`,
          borderRadius: 14, padding: '1.5rem', marginBottom: '2rem',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <div style={{
              fontSize: '0.72rem', letterSpacing: 1.5, textTransform: 'uppercase',
              color: C.green,
            }}>
              📎 {t('caseJourney.documents')}
            </div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => {
                  setUploadMsg('Document upload feature coming soon!');
                  setTimeout(() => setUploadMsg(''), 3000);
                }}
                style={{
                  fontSize: '0.75rem', padding: '4px 14px',
                  background: 'rgba(29,158,117,0.1)', border: `1px solid ${C.cardBorder}`,
                  borderRadius: 6, color: C.greenLight, cursor: 'pointer',
                  fontFamily: "'Outfit',sans-serif",
                }}
              >+ {t('caseJourney.uploadDoc')}</button>
              {uploadMsg && (
                <div role="status" aria-live="polite" style={{
                  position: 'absolute', bottom: 'calc(100% + 6px)', right: 0,
                  background: 'var(--bg-card, #1a2b25)', border: `1px solid ${C.cardBorder}`,
                  borderRadius: 6, padding: '4px 10px', whiteSpace: 'nowrap',
                  fontSize: '0.72rem', color: C.greenLight,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  animation: 'fadeInUp 0.2s ease forwards',
                  zIndex: 10,
                }}>{uploadMsg}</div>
              )}
            </div>
          </div>

          {docsLoading ? (
            <div style={{ fontSize: '0.82rem', color: C.sub, padding: '0.5rem 0' }}>{t('common.loading')}…</div>
          ) : allDocs.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '1.5rem',
              fontSize: '0.85rem', color: C.sub, opacity: 0.6,
            }}>
              {t('caseJourney.noDocuments')}
            </div>
          ) : (
            allDocs.map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.7rem 0.9rem', marginBottom: 4,
                background: 'rgba(29,158,117,0.03)',
                border: `1px solid rgba(29,158,117,0.08)`,
                borderRadius: 8,
              }}>
                <span style={{ fontSize: '1.1rem' }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', color: C.text, fontWeight: 500 }}>
                    {doc.name || doc.title || doc.filename || `Document ${i + 1}`}
                  </div>
                  {doc.uploaded_at && (
                    <div style={{ fontSize: '0.7rem', color: C.sub }}>
                      {new Date(doc.uploaded_at).toLocaleDateString('en-IN')}
                    </div>
                  )}
                </div>
                {doc.type && (
                  <span style={{
                    fontSize: '0.6rem', letterSpacing: 1, textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: 8,
                    background: 'rgba(29,158,117,0.08)', color: C.green,
                  }}>{doc.type}</span>
                )}
              </div>
            ))
          )}
        </div>

        {/* ── AI Advisor ─────────────────────────────────────────────── */}
        <div style={{
          background: 'rgba(59,130,246,0.04)',
          border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: 14, padding: '1.5rem',
        }}>
          <div style={{
            fontSize: '0.72rem', letterSpacing: 1.5, textTransform: 'uppercase',
            color: C.blue, marginBottom: '0.8rem',
          }}>
            🤖 {t('caseJourney.aiAdvisor')}
          </div>
          <p style={{ fontSize: '0.82rem', color: C.sub, lineHeight: 1.5, margin: '0 0 1rem' }}>
            Ask any question about your case — next steps, legal rights, expected timelines, or procedures.
          </p>

          <div style={{
            display: 'flex', background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8, overflow: 'hidden',
          }}>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !aiLoading && askAdvisor()}
              placeholder="e.g. What should I do next? How long will investigation take?"
              aria-label="Ask the AI advisor a question about your case"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '0.8rem 1rem', fontSize: '0.85rem', color: C.text,
                fontFamily: "'Outfit',sans-serif",
              }}
            />
            <button
              onClick={askAdvisor}
              disabled={aiLoading || !question.trim()}
              tabIndex={0}
              aria-label={t('caseJourney.askAdvisor')}
              style={{
                padding: '0.8rem 1.4rem', background: C.blue, border: 'none',
                color: '#fff', fontFamily: "'Outfit',sans-serif", fontSize: '0.82rem',
                fontWeight: 500, cursor: aiLoading ? 'wait' : 'pointer',
                opacity: aiLoading || !question.trim() ? 0.6 : 1,
              }}
            >
              {aiLoading ? '…' : t('caseJourney.askAdvisor')}
            </button>
          </div>

          {aiError && (
            <div role="alert" style={{
              marginTop: '0.8rem', padding: '0.6rem 0.8rem',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, fontSize: '0.82rem', color: 'var(--color-error, #f87171)',
            }}>⚠️ {aiError}</div>
          )}

          {aiResponse && (
            <div style={{
              marginTop: '1rem', background: 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10,
              padding: '1rem 1.2rem',
            }}>
              <div style={{
                fontSize: '0.7rem', letterSpacing: 1, textTransform: 'uppercase',
                color: C.blue, marginBottom: 6,
              }}>AI Advisor Response</div>
              <div style={{ fontSize: '0.88rem', color: C.text, lineHeight: 1.7 }}>
                {aiResponse.response || aiResponse.advice || aiResponse.answer || JSON.stringify(aiResponse)}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

/* ── Helper components ───────────────────────────────────────────────── */
function InfoCard({ label, value, icon }) {
  return (
    <div style={{
      background: 'rgba(29,158,117,0.05)', border: '1px solid rgba(29,158,117,0.12)',
      borderRadius: 10, padding: '0.9rem 1rem',
    }}>
      <div style={{ fontSize: '1rem', marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-citizen)' }}>{value}</div>
      <div style={{
        fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
        color: 'var(--text-muted)', marginTop: 2,
      }}>{label}</div>
    </div>
  );
}
