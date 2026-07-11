/* ── CaseTimeline ────────────────────────────────────────────────────
   Vertical timeline showing all stages of a case's lifecycle.
   Props:
     stages       – array of { stage, timestamp, notes, updated_by }
     currentStage – string key of the active stage
   ──────────────────────────────────────────────────────────────────── */

const STAGE_ORDER = [
  'complaint_filed',
  'fir_registered',
  'investigation',
  'chargesheet_filed',
  'court_hearing',
  'judgment',
  'appeal',
  'closed',
];

const STAGE_LABELS = {
  complaint_filed: 'Complaint Filed',
  fir_registered: 'FIR Registered',
  investigation: 'Investigation',
  chargesheet_filed: 'Chargesheet Filed',
  court_hearing: 'Court Hearing',
  judgment: 'Judgment',
  appeal: 'Appeal',
  closed: 'Case Closed',
};

const STAGE_ICONS = {
  complaint_filed: '📝',
  fir_registered: '🔖',
  investigation: '🔍',
  chargesheet_filed: '📋',
  court_hearing: '⚖️',
  judgment: '🏛️',
  appeal: '📜',
  closed: '✅',
};

const STATUS = { COMPLETED: 'completed', ACTIVE: 'active', PENDING: 'pending' };

function getStageStatus(stageKey, currentStage, stagesData) {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);
  const stageIdx = STAGE_ORDER.indexOf(stageKey);
  if (stageIdx < currentIdx) return STATUS.COMPLETED;
  if (stageIdx === currentIdx) return STATUS.ACTIVE;
  return STATUS.PENDING;
}

function getStageData(stageKey, stagesArr) {
  return stagesArr?.find(s => s.stage === stageKey) || null;
}

function formatDate(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return ts; }
}

const C = {
  green: '#1d9e75',
  blue: '#3b82f6',
  gray: 'rgba(216,237,230,0.2)',
  grayText: 'rgba(216,237,230,0.3)',
  text: '#d8ede6',
  subtext: 'rgba(216,237,230,0.55)',
  cardBg: 'rgba(29,158,117,0.05)',
  cardBorder: 'rgba(29,158,117,0.12)',
  blueBg: 'rgba(59,130,246,0.08)',
  blueBorder: 'rgba(59,130,246,0.25)',
};

export default function CaseTimeline({ stages = [], currentStage = '' }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 32 }}>
      {STAGE_ORDER.map((stageKey, i) => {
        const status = getStageStatus(stageKey, currentStage, stages);
        const data = getStageData(stageKey, stages);
        const isLast = i === STAGE_ORDER.length - 1;
        const dotColor = status === STATUS.COMPLETED ? C.green
          : status === STATUS.ACTIVE ? C.blue : C.gray;

        return (
          <div key={stageKey} style={{ position: 'relative', paddingBottom: isLast ? 0 : 28 }}>
            {/* Vertical connector line */}
            {!isLast && (
              <div style={{
                position: 'absolute', left: -20, top: 20, width: 2,
                bottom: 0,
                background: status === STATUS.COMPLETED || status === STATUS.ACTIVE
                  ? `linear-gradient(to bottom, ${dotColor}, ${i + 1 < STAGE_ORDER.indexOf(currentStage) ? C.green : C.gray})`
                  : C.gray,
              }} />
            )}

            {/* Node dot */}
            <div style={{
              position: 'absolute', left: -28, top: 4,
              width: 18, height: 18, borderRadius: '50%',
              background: status === STATUS.PENDING ? 'transparent' : dotColor,
              border: status === STATUS.PENDING ? `2px solid ${C.gray}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: status === STATUS.ACTIVE ? 'tlPulse 2s ease-in-out infinite' : 'none',
              boxShadow: status === STATUS.ACTIVE ? `0 0 10px rgba(59,130,246,0.4)` : 'none',
              transition: 'all 0.3s ease',
            }}>
              {status === STATUS.COMPLETED && (
                <span style={{ fontSize: '0.6rem', color: '#fff' }}>✓</span>
              )}
              {status === STATUS.ACTIVE && (
                <span style={{ fontSize: '0.55rem', color: '#fff' }}>●</span>
              )}
            </div>

            {/* Content card */}
            <div style={{
              marginLeft: 8,
              background: status === STATUS.ACTIVE ? C.blueBg : status === STATUS.COMPLETED ? C.cardBg : 'transparent',
              border: `1px solid ${status === STATUS.ACTIVE ? C.blueBorder : status === STATUS.COMPLETED ? C.cardBorder : 'rgba(216,237,230,0.06)'}`,
              borderRadius: 10, padding: '0.9rem 1.1rem',
              opacity: status === STATUS.PENDING ? 0.45 : 1,
              transition: 'all 0.3s ease',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: data ? 6 : 0 }}>
                <span style={{ fontSize: '1rem' }}>{STAGE_ICONS[stageKey]}</span>
                <span style={{
                  fontSize: '0.88rem', fontWeight: 600,
                  color: status === STATUS.ACTIVE ? C.blue
                    : status === STATUS.COMPLETED ? C.text : C.grayText,
                }}>
                  {STAGE_LABELS[stageKey] || stageKey}
                </span>

                {/* Status badge */}
                {status === STATUS.ACTIVE && (
                  <span style={{
                    fontSize: '0.6rem', letterSpacing: 1, textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: 10,
                    background: 'rgba(59,130,246,0.15)', color: C.blue,
                    fontWeight: 600,
                  }}>Current</span>
                )}
                {status === STATUS.COMPLETED && (
                  <span style={{
                    fontSize: '0.6rem', letterSpacing: 1, textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: 10,
                    background: 'rgba(29,158,117,0.12)', color: C.green,
                    fontWeight: 600,
                  }}>Done</span>
                )}
              </div>

              {/* Date & notes — only for completed / active with data */}
              {data && (
                <div style={{ marginLeft: 28 }}>
                  {data.timestamp && (
                    <div style={{ fontSize: '0.72rem', color: C.subtext, marginBottom: 3 }}>
                      🕒 {formatDate(data.timestamp)}
                    </div>
                  )}
                  {data.notes && (
                    <div style={{
                      fontSize: '0.78rem', color: 'rgba(216,237,230,0.65)', lineHeight: 1.5,
                      marginTop: 4,
                    }}>
                      {data.notes}
                    </div>
                  )}
                  {data.updated_by && (
                    <div style={{
                      fontSize: '0.68rem', color: C.grayText, marginTop: 4,
                    }}>
                      Updated by: {data.updated_by}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Keyframes */}
      <style>{`
        @keyframes tlPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.45); }
          50%      { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
        }
      `}</style>
    </div>
  );
}
