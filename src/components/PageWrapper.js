import { useEffect, useRef } from 'react';

export default function PageWrapper({ children, style = {} }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = '0';
      ref.current.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        ref.current.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
        ref.current.style.opacity = '1';
        ref.current.style.transform = 'translateY(0)';
      });
    }
  }, []);

  return (
    <div ref={ref} style={{ minHeight: '100vh', ...style }}>
      {children}
    </div>
  );
}