import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { aiAPI } from '../../services/api';

const GOLD = '#d4a843';
const BG = '#0d0c08';

const SAMPLE_CASE_TEXT = `IN THE COURT OF SESSIONS JUDGE, BENGALURU URBAN DISTRICT
Sessions Case No. SC/BLR/2023/4521

STATE OF KARNATAKA vs.
1. Venkat Raman S/o Krishnamurthy, Age 38, R/o No.14, 3rd Cross, Jayanagar, Bengaluru
2. Suresh Kumar S/o Ramaiah, Age 42, R/o No.8, Brigade Road, Bengaluru

CHARGES: The accused persons are jointly charged under Section 420 (Cheating), Section 406 (Criminal Breach of Trust), and Section 120B (Criminal Conspiracy) of the Indian Penal Code, 1860.

BRIEF FACTS: The complainant M/s Lakshmi Enterprises, represented by its proprietor Gopal Das, alleges that the accused approached him in January 2022 promising 24% annual returns on real estate investment. The accused collected Rs. 42,00,000 from the complainant. Accused then ceased communication and failed to return the amount or pay any returns. FIR registered on 15.03.2022 at Jayanagar Police Station, Bengaluru under Crime No. 142/2022.

ARREST & REMAND: Accused No.1 arrested on 20.04.2022. Accused No.2 arrested on 25.04.2022. Both remanded to judicial custody. Bail application of Accused No.1 dated 15.05.2022 rejected by this court. Second bail application dated 10.09.2022 rejected by Sessions Court. Bail applications of Accused No.2 rejected on 20.05.2022 and 15.10.2022.

CHARGESHEET: Filed by Jayanagar Police on 30.06.2022. Documents seized include forged property documents, fraudulent receipts, bank statements showing fund diversion to shell companies.

WITNESSES: Prosecution has listed 14 witnesses. PWs 1 through 9 have been examined. PWs 10 through 14 yet to be examined. Cross-examination of PW-7 is pending.

CASE PROGRESS: First hearing: 15.05.2022. Charges framed: 20.08.2022. Witness examination commenced: 10.01.2023. Current stage: Cross-examination of prosecution witnesses ongoing.

NEXT HEARING DATE: 15.06.2026
CURRENT STATUS: Trial in Progress — Cross-examination of prosecution witnesses PW-10 onwards
PRESIDING JUDGE: Hon. Justice K. Ramakrishna, Sessions Judge, Bengaluru Urban District`;

export default function NyayMitra() {
  const { t } = useTranslation();
  const [stage, setStage] = useState('upload');
  const [extracting, setExtracting] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  async function processFile(file) {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setFileName(file.name);
    setError('');
    setStage('processing');
    setExtracting(true);
    setAnalyzing(false);

    try {
      setExtracting(true);
      const data = await aiAPI.analyzePDF(file);
      setExtracting(false);
      setAnalyzing(true);
      if (data.success) {
        setResult(data.analysis);
        setStage('result');
      } else {
        throw new Error('Analysis failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Make sure backend is running on port 8000.');
      setStage('upload');
    } finally {
      setAnalyzing(false);
    }
  }

  async function loadSampleCase() {
    setFileName('Sample_Case_SC_BLR_2023_4521.pdf');
    setError('');
    setStage('processing');
    setAnalyzing(true);

    try {
      const data = await aiAPI.analyzeText(SAMPLE_CASE_TEXT);
      if (data.success) {
        setResult(data.analysis);
        setStage('result');
      } else {
        throw new Error('Sample analysis failed.');
      }
    } catch (err) {
      setError(err.message || 'Sample analysis failed. Make sure backend is running on port 8000.');
      setStage('upload');
    } finally {
      setAnalyzing(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleReset() {
    setStage('upload');
    setResult(null);
    setError('');
    setFileName('');
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(212,168,67,0.1)',
    borderRadius: 12,
  };

  return (
    <PageWrapper style={{ minHeight: '100vh', background: BG, color: '#e8e0cc' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '2rem 2.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: '1.8rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
              color: 'rgba(212,168,67,0.6)', marginBottom: '0.4rem' }}>AI Case Intelligence</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
              fontWeight: 700, color: '#e8e0cc', marginBottom: '0.3rem' }}>{t('legal.nyayMitra')}</h1>
            <p style={{ fontSize: '0.82rem', color: 'rgba(232,224,204,0.4)', fontWeight: 300 }}>
              {t('legal.nyayMitraDesc')}
            </p>
          </div>
          {stage === 'result' && (
            <button onClick={handleReset}
              style={{ padding: '0.6rem 1.2rem', background: 'transparent',
                border: '1px solid rgba(212,168,67,0.25)', borderRadius: 8,
                color: 'rgba(212,168,67,0.7)', cursor: 'pointer', fontSize: '0.8rem',
                fontFamily: "'Outfit',sans-serif" }}>
              ← New Analysis
            </button>
          )}
        </div>

        {stage === 'upload' && (
          <div>
            {error && (
              <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(226,75,74,0.08)',
                border: '1px solid rgba(226,75,74,0.25)', borderRadius: 8,
                color: '#f09595', fontSize: '0.82rem', marginBottom: '1.2rem' }}>
                ⚠ {error}
              </div>
            )}

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              style={{
                border: `2px dashed ${dragOver ? GOLD : 'rgba(212,168,67,0.2)'}`,
                borderRadius: 16, padding: '3.5rem 2rem', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.25s', marginBottom: '1.2rem',
                background: dragOver ? 'rgba(212,168,67,0.04)' : 'rgba(255,255,255,0.01)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,67,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = dragOver ? 'rgba(212,168,67,0.04)' : 'rgba(255,255,255,0.01)'}>
              <input ref={fileRef} type="file" accept=".pdf"
                style={{ display: 'none' }}
                onChange={e => e.target.files[0] && processFile(e.target.files[0])} />
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>📄</div>
              <div style={{ fontSize: '1rem', color: '#e8e0cc', fontWeight: 500,
                marginBottom: '0.4rem' }}>Drop case PDF here</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(232,224,204,0.35)',
                marginBottom: '1rem' }}>or click to browse — chargesheets, FIRs, court orders</div>
              <div style={{ display: 'inline-block', padding: '0.6rem 1.5rem',
                background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)',
                borderRadius: 8, fontSize: '0.82rem', color: GOLD }}>
                Browse PDF →
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(232,224,204,0.3)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button onClick={loadSampleCase}
                style={{ padding: '0.7rem 2rem', background: 'transparent',
                  border: '1px solid rgba(212,168,67,0.2)', borderRadius: 8,
                  color: 'rgba(212,168,67,0.6)', cursor: 'pointer',
                  fontFamily: "'Outfit',sans-serif", fontSize: '0.82rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(212,168,67,0.06)'; e.target.style.color = GOLD; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(212,168,67,0.6)'; }}>
                Use Sample Case (Demo)
              </button>
              <div style={{ fontSize: '0.7rem', color: 'rgba(232,224,204,0.2)', marginTop: '0.4rem' }}>
                SC/BLR/2023/4521 · Cheating & Criminal Conspiracy Case
              </div>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <div style={{ ...cardStyle, padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%',
              border: `2px solid ${GOLD}`, borderTopColor: 'transparent',
              margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem',
              color: '#e8e0cc', marginBottom: '0.4rem' }}>
              {extracting ? 'Extracting text from PDF...' : 'Analyzing with AI...'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(232,224,204,0.35)' }}>{fileName}</div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(212,168,67,0.5)' }}>
              {extracting ? 'Reading all pages of the document' : t('fileComplaint.aiSuggesting')}
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {stage === 'result' && result && (
          <div>
            <div style={{ ...cardStyle, padding: '1.5rem 1.8rem', marginBottom: '1rem',
              background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
                    color: 'rgba(212,168,67,0.6)', marginBottom: '0.4rem' }}>Case Analysis Complete</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem',
                    fontWeight: 700, color: '#e8e0cc', marginBottom: '0.3rem' }}>{result.case_title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(232,224,204,0.45)' }}>
                    {result.case_number} · {result.court}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
                    color: 'rgba(212,168,67,0.5)', marginBottom: 4 }}>Next Hearing</div>
                  <div style={{ fontSize: '1rem', fontWeight: 500, color: GOLD }}>
                    {result.next_hearing}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.2rem' }}>
                {[
                  { label: 'Bail', value: result.bail_status },
                  { label: 'Status', value: result.current_status },
                  { label: 'Witnesses', value: `${result.witnesses_examined || '?'}/${result.witnesses_total || '?'} Examined` },
                  { label: 'IPC Sections', value: (result.ipc_sections?.length || 0) + ' sections' },
                ].map((chip, i) => (
                  <div key={i} style={{ padding: '4px 12px',
                    background: 'rgba(212,168,67,0.08)',
                    border: '1px solid rgba(212,168,67,0.18)', borderRadius: 20 }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(212,168,67,0.6)',
                      textTransform: 'uppercase', letterSpacing: 1 }}>{chip.label}: </span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(232,224,204,0.7)' }}>{chip.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid-mobile-1 stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem', marginBottom: '1rem' }}>

              <div style={{ ...cardStyle, padding: '1.2rem 1.4rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
                  color: 'rgba(212,168,67,0.5)', marginBottom: '0.8rem' }}>Accused</div>
                {result.accused?.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start',
                    gap: 8, marginBottom: '0.5rem' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', color: GOLD, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <span style={{ fontSize: '0.82rem', color: '#e8e0cc', lineHeight: 1.4 }}>{a}</span>
                  </div>
                ))}
              </div>

              <div style={{ ...cardStyle, padding: '1.2rem 1.4rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
                  color: 'rgba(212,168,67,0.5)', marginBottom: '0.8rem' }}>Charges & IPC</div>
                <div style={{ marginBottom: '0.6rem' }}>
                  {result.ipc_sections?.map((s, i) => (
                    <div key={i} style={{ display: 'inline-block', margin: '0 4px 4px 0',
                      padding: '2px 8px', background: 'rgba(212,168,67,0.1)',
                      border: '1px solid rgba(212,168,67,0.2)',
                      borderRadius: 4, fontSize: '0.72rem', color: GOLD }}>{s}</div>
                  ))}
                </div>
                {result.charges?.map((c, i) => (
                  <div key={i} style={{ fontSize: '0.78rem', color: 'rgba(232,224,204,0.55)',
                    marginBottom: '0.3rem', display: 'flex', gap: 6 }}>
                    <span style={{ color: 'rgba(212,168,67,0.4)' }}>•</span>{c}
                  </div>
                ))}
              </div>

              <div style={{ ...cardStyle, padding: '1.2rem 1.4rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
                  color: 'rgba(212,168,67,0.5)', marginBottom: '0.8rem' }}>Key Facts</div>
                {result.key_facts?.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8,
                    marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%',
                      background: GOLD, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.78rem', color: 'rgba(232,224,204,0.6)',
                      lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.important_dates?.length > 0 && (
              <div style={{ ...cardStyle, padding: '1.4rem 1.8rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
                  color: 'rgba(212,168,67,0.5)', marginBottom: '1rem' }}>Case Timeline</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
                  {result.important_dates.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ padding: '0.4rem 0.9rem',
                        background: 'rgba(212,168,67,0.07)',
                        border: '1px solid rgba(212,168,67,0.15)', borderRadius: 6 }}>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(212,168,67,0.6)', marginBottom: 1 }}>
                          {d.event}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#e8e0cc', fontWeight: 500 }}>{d.date}</div>
                      </div>
                      {i < result.important_dates.length - 1 && (
                        <div style={{ width: 20, height: 1,
                          background: 'rgba(212,168,67,0.2)', margin: '0 4px' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ ...cardStyle, padding: '1.4rem 1.8rem',
              background: 'rgba(212,168,67,0.03)', border: '1px solid rgba(212,168,67,0.12)' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
                color: 'rgba(212,168,67,0.5)', marginBottom: '0.7rem' }}>AI Case Summary</div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(232,224,204,0.7)',
                lineHeight: 1.75, fontStyle: 'italic' }}>"{result.summary}"</p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}