import { useEffect, useRef } from 'react';

/* ── StepWizard ──────────────────────────────────────────────────────
   Reusable horizontal progress stepper with animated transitions.
   Props:
     steps        – array of { title, description }
     currentStep  – 0-based index of the active step
     onStepClick  – optional callback(stepIndex) for clickable steps
   ──────────────────────────────────────────────────────────────────── */

const STATUS = { COMPLETED: 'completed', ACTIVE: 'active', UPCOMING: 'upcoming' };

function getStatus(index, currentStep) {
  if (index < currentStep) return STATUS.COMPLETED;
  if (index === currentStep) return STATUS.ACTIVE;
  return STATUS.UPCOMING;
}

const colors = {
  green: '#1d9e75',
  greenGlow: 'rgba(29,158,117,0.35)',
  greenBg: 'rgba(29,158,117,0.12)',
  gray: 'rgba(216,237,230,0.18)',
  grayText: 'rgba(216,237,230,0.35)',
  text: '#d8ede6',
  subtext: 'rgba(216,237,230,0.55)',
};

export default function StepWizard({ steps = [], currentStep = 0, onStepClick }) {
  const containerRef = useRef(null);

  /* Animate on step change */
  useEffect(() => {
    if (!containerRef.current) return;
    const nodes = containerRef.current.querySelectorAll('[data-step-content]');
    nodes.forEach((node, i) => {
      if (i === currentStep) {
        node.style.opacity = '0';
        node.style.transform = 'translateY(8px)';
        requestAnimationFrame(() => {
          node.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
        });
      }
    });
  }, [currentStep]);

  return (
    <div ref={containerRef}>
      {/* ── Progress Bar ────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        gap: 0, padding: '0 1rem', marginBottom: '2rem', position: 'relative',
      }}>
        {steps.map((step, i) => {
          const status = getStatus(i, currentStep);
          const isLast = i === steps.length - 1;
          const clickable = onStepClick && status === STATUS.COMPLETED;

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? '0 0 auto' : 1 }}>
              {/* Step circle + label */}
              <div
                onClick={clickable ? () => onStepClick(i) : undefined}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  cursor: clickable ? 'pointer' : 'default', minWidth: 60,
                }}
              >
                {/* Circle */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: status === STATUS.COMPLETED ? '1rem' : '0.82rem',
                  fontWeight: 600, transition: 'all 0.35s ease',
                  background: status === STATUS.COMPLETED ? colors.green
                    : status === STATUS.ACTIVE ? 'transparent' : 'transparent',
                  border: status === STATUS.ACTIVE ? `2px solid ${colors.green}`
                    : status === STATUS.COMPLETED ? 'none'
                    : `2px solid ${colors.gray}`,
                  color: status === STATUS.UPCOMING ? colors.grayText : '#fff',
                  boxShadow: status === STATUS.ACTIVE ? `0 0 12px ${colors.greenGlow}` : 'none',
                  animation: status === STATUS.ACTIVE ? 'stepPulse 2s ease-in-out infinite' : 'none',
                }}>
                  {status === STATUS.COMPLETED ? '✓' : i + 1}
                </div>

                {/* Label */}
                <div style={{
                  marginTop: 8, textAlign: 'center', maxWidth: 90,
                }}>
                  <div style={{
                    fontSize: '0.68rem', fontWeight: 600, letterSpacing: 0.5,
                    color: status === STATUS.ACTIVE ? colors.text
                      : status === STATUS.COMPLETED ? colors.green : colors.grayText,
                    transition: 'color 0.3s',
                    lineHeight: 1.3,
                  }}>
                    {step.title}
                  </div>
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  paddingTop: 18, /* centre on the circle */
                  minWidth: 24,
                }}>
                  <div style={{
                    height: 2, width: '100%', borderRadius: 1,
                    background: i < currentStep ? colors.green : colors.gray,
                    transition: 'background 0.35s ease',
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Active Step Description ────────────────────────── */}
      {steps[currentStep]?.description && (
        <div data-step-content style={{
          textAlign: 'center', marginBottom: '1.5rem',
          fontSize: '0.82rem', color: colors.subtext, lineHeight: 1.5,
        }}>
          {steps[currentStep].description}
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes stepPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(29,158,117,0.4); }
          50%      { box-shadow: 0 0 0 8px rgba(29,158,117,0); }
        }
      `}</style>
    </div>
  );
}
