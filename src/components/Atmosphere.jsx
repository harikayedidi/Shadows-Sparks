import { useEffect, useRef } from 'react';
import ParticleField from './ParticleField';

// Background layers: sector gradient, grid floor, motes, visor light, vignette, scanlines.
export default function Atmosphere({ theme }) {
  const lightRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-soft', theme.accentSoft);
    root.style.setProperty('--secondary', theme.secondary);
  }, [theme]);

  useEffect(() => {
    const el = lightRef.current;
    const onMove = (e) => {
      el.style.setProperty('--mx', `${e.clientX}px`);
      el.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div aria-hidden="true">
      <div className="fixed inset-0" style={{ background: theme.bg, transition: 'background 0.8s ease', zIndex: 0 }} />
      <div className="grid-floor" />
      <ParticleField particle={theme.particle} />
      <div ref={lightRef} className="cursor-light" />
      <div className="vignette" />
      <div className="scanlines" />
    </div>
  );
}
