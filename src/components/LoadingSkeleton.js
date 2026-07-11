import React from 'react';
// Skeleton CSS classes (.skeleton, .skeleton-card, etc.) are defined in App.css,
// which is loaded globally via App.js — no import needed here.

export default function LoadingSkeleton({ variant = 'text', count = 1, style = {} }) {
  const elements = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <>
        {elements.map((_, i) => (
          <div key={i} className="skeleton skeleton-card" style={style} />
        ))}
      </>
    );
  }

  if (variant === 'stat') {
    return (
      <>
        {elements.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
            <div className="skeleton skeleton-circle" />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text short" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'chat-bubble') {
    return (
      <>
        {elements.map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
            <div className="skeleton skeleton-text medium" style={{ height: 36, borderRadius: 18 }} />
            <div className="skeleton skeleton-text short" style={{ height: 36, borderRadius: 18, alignSelf: 'flex-end' }} />
          </div>
        ))}
      </>
    );
  }

  if (variant === 'table-row') {
    return (
      <>
        {elements.map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, ...style }}>
            <div className="skeleton skeleton-text" style={{ flex: 1 }} />
            <div className="skeleton skeleton-text" style={{ flex: 2 }} />
            <div className="skeleton skeleton-text" style={{ flex: 1 }} />
          </div>
        ))}
      </>
    );
  }

  // Default: text lines
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {elements.map((_, i) => (
        <div key={i} className={`skeleton skeleton-text ${i % 3 === 0 ? 'medium' : i % 2 === 0 ? 'short' : ''}`} />
      ))}
    </div>
  );
}
