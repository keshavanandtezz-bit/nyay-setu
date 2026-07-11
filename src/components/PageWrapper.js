import { useEffect, useRef } from 'react';

export default function PageWrapper({ children, style = {} }) {
  const ref = useRef();

  useEffect(() => {
    // Overall page staggered fade in
    if (ref.current) {
      ref.current.style.opacity = '0';
      ref.current.style.transform = 'translateY(16px) scale(0.98)';
      requestAnimationFrame(() => {
        ref.current.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        ref.current.style.opacity = '1';
        ref.current.style.transform = 'translateY(0) scale(1)';
      });
    }

    // Scroll reveal observer for inner elements with 'reveal-on-scroll' class
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Merge background: use CSS variable as default, allow override from style prop
  const wrapperStyle = {
    minHeight: '100vh',
    position: 'relative',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    transition: 'background 0.4s ease, color 0.4s ease',
    ...style,
  };

  // Determine if theme is light for orb visibility
  const isDark = typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') !== 'light';

  return (
    <div ref={ref} style={wrapperStyle}>
      {/* Ambient background orbs — subtle in both modes */}
      <div style={{
        position: 'absolute',
        top: '10%', left: '5%',
        width: '30vw', height: '30vw',
        background: `radial-gradient(circle, rgba(29,158,117,${isDark ? 0.03 : 0.04}) 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 10s infinite ease-in-out'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%', right: '5%',
        width: '40vw', height: '40vw',
        background: `radial-gradient(circle, rgba(212,168,67,${isDark ? 0.02 : 0.03}) 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 12s infinite ease-in-out reverse'
      }} />
      
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}